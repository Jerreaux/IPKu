import { Router } from 'express';
import { prisma } from '../db';
import { calculateIP, calculateProgresKelulusan } from '../engine';

const router = Router();

// Endpoint for Dashboard summary (Auth required, but mocked for now using user_id in query/body)
router.get('/summary/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { skor_toefl: true, status_skripsi: true, status_kkn: true }
    });

    const semesters = await prisma.semester.findMany({
      where: { user_id: userId },
      include: { courses: true },
      orderBy: { created_at: 'asc' }
    });

    let config = await prisma.academicConfig.findFirst({ where: { active: true } });
    let gradeMapping: any = config?.grade_mapping || { "A": 4.0, "AB": 3.5, "B": 3.0, "BC": 2.5, "C": 2.0, "D": 1.0, "E": 0.0 };

    let allCourses: any[] = [];
    let cumulativeSks = 0;
    let cumulativeMutu = 0;

    const trendIP = semesters.map((sem, index) => {
      let semSks = 0;
      let semMutu = 0;
      
      const processedCourses = sem.courses.map(c => {
        allCourses.push(c);
        const points = gradeMapping[c.huruf_mutu] || 0;
        if (c.huruf_mutu !== 'BL') {
          semSks += c.sks;
          semMutu += c.sks * points;
          
          if (c.huruf_mutu !== 'E') {
            cumulativeSks += c.sks;
          }
          cumulativeMutu += c.sks * points;
        }
        return {
          sks: c.sks,
          grade_points: points
        };
      });
      
      // Hitung IPK Kumulatif yang sesungguhnya (SKS pembagi adalah semua SKS yang diambil, bukan cuma yang lulus)
      // Perbaikan logika: cumulativeSks di atas hanya menghitung SKS lulus untuk progress kelulusan.
      // Kita butuh SKS total (yang diambil) untuk pembagi IPK.
      return {
        semester: sem.nama_semester,
        semester_ke: index + 1,
        ip: calculateIP(processedCourses), // IPS
        sks_kumulatif: 0, // Akan dihitung ulang di bawah agar akurat
        ipk_kumulatif: 0
      };
    });

    // Kalkulasi ulang cumulative dengan presisi yang sama dengan IPK utama
    let runningSksTotal = 0;
    let runningMutuTotal = 0;
    let runningSksLulus = 0;

    for (let i = 0; i < semesters.length; i++) {
      for (const c of semesters[i].courses) {
        if (c.huruf_mutu !== 'BL') {
          const points = gradeMapping[c.huruf_mutu] || 0;
          runningSksTotal += c.sks;
          runningMutuTotal += c.sks * points;
          if (c.huruf_mutu !== 'E') {
            runningSksLulus += c.sks;
          }
        }
      }
      trendIP[i].sks_kumulatif = runningSksLulus;
      trendIP[i].ipk_kumulatif = runningSksTotal > 0 ? (Math.round((runningMutuTotal / runningSksTotal) * 100) / 100) : 0;
    }

    const allProcessed = allCourses.map(c => ({
      sks: c.sks,
      grade_points: gradeMapping[c.huruf_mutu] || 0
    }));

    const ipk = calculateIP(allProcessed);
    const progress = calculateProgresKelulusan(allCourses);

    // E-Grade Warnings
    const eCourses = allCourses.filter(c => c.huruf_mutu === 'E');

    // Generate Roadmap (1 to 14 semesters)
    const roadmap = [];
    const maxSemesters = 14;
    const historyLength = trendIP.length;
    
    for (let i = 1; i <= maxSemesters; i++) {
      if (i <= historyLength) {
        roadmap.push({
          semester_ke: i,
          status: 'completed',
          sks_kumulatif: trendIP[i - 1].sks_kumulatif,
          ipk_kumulatif: trendIP[i - 1].ipk_kumulatif
        });
      } else if (i === historyLength + 1) {
        roadmap.push({
          semester_ke: i,
          status: 'current',
          sks_kumulatif: null,
          ipk_kumulatif: null
        });
      } else {
        roadmap.push({
          semester_ke: i,
          status: 'planned',
          sks_kumulatif: null,
          ipk_kumulatif: null
        });
      }
    }

    // --- GENERATE DYNAMIC INSIGHTS ---
    const insights: Array<{ type: 'info'|'warning'|'success', message: string, actionLabel?: string, actionLink?: string }> = [];
    
    // 1. Insight Cumlaude (Jika IPK >= 3.0 tapi < 3.51 dan belum lulus)
    if (ipk >= 3.0 && ipk < 3.51 && progress.totalSksLulus < 144) {
      const targetMutu = 3.51 * 144; // Total mutu minimum untuk Cumlaude
      const currentMutu = runningMutuTotal;
      const sisaSks = 144 - runningSksTotal; // SKS yang masih harus ditempuh (asumsi total diambil minimal 144)
      
      if (sisaSks > 0) {
        const requiredIp = (targetMutu - currentMutu) / sisaSks;
        if (requiredIp <= 4.0 && requiredIp > 0) {
          insights.push({
            type: 'info',
            message: `Untuk lulus dengan Cumlaude, kamu perlu rata-rata IP ${requiredIp.toFixed(2)} di ${sisaSks} SKS tersisa.`,
            actionLabel: 'Simulasikan',
            actionLink: '/simulation'
          });
        }
      }
    }

    // 2. Insight Nilai Bermasalah (C/D/E)
    const badCourses = allCourses.filter(c => ['C', 'D', 'E'].includes(c.huruf_mutu));
    if (badCourses.length > 0) {
      insights.push({
        type: 'warning',
        message: `Kamu punya ${badCourses.length} nilai C/D/E yang bisa diulang untuk mendongkrak IPK secara instan.`,
        actionLabel: 'Lihat Analisis Retrospektif',
        actionLink: '/simulation'
      });
    } else if (progress.totalSksLulus > 0 && ipk >= 3.51) {
      insights.push({
        type: 'success',
        message: 'Luar biasa! Pertahankan performa untuk lulus dengan predikat Cumlaude.',
      });
    }

    res.json({
      ipk,
      total_sks_lulus: progress.totalSksLulus,
      has_e: progress.hasE,
      skor_toefl: user?.skor_toefl || null,
      status_skripsi: user?.status_skripsi || false,
      status_kkn: user?.status_kkn || false,
      trend: trendIP,
      roadmap,
      insights,
      warnings: eCourses.map(c => ({
        nama_mk: c.nama_mk,
        semester_asal: semesters.find(s => s.id === c.semester_id)?.nama_semester
      }))
    });

  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
