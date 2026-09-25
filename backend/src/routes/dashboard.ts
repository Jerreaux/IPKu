import { Router } from 'express';
import { prisma } from '../db';
import { calculateIP, calculateProgresKelulusan } from '../engine';

const router = Router();

// Endpoint for Dashboard summary (Auth required, but mocked for now using user_id in query/body)
router.get('/summary/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const semesters = await prisma.semester.findMany({
      where: { user_id: userId },
      include: { courses: true },
      orderBy: { created_at: 'asc' }
    });

    let config = await prisma.academicConfig.findFirst({ where: { active: true } });
    let gradeMapping: any = config?.grade_mapping || { "A": 4.0, "AB": 3.5, "B": 3.0, "BC": 2.5, "C": 2.0, "D": 1.0, "E": 0.0 };

    let allCourses: any[] = [];
    const trendIP = semesters.map(sem => {
      const processedCourses = sem.courses.map(c => {
        allCourses.push(c);
        return {
          sks: c.sks,
          grade_points: gradeMapping[c.huruf_mutu] || 0
        };
      });
      return {
        semester: sem.nama_semester,
        ip: calculateIP(processedCourses)
      };
    });

    const allProcessed = allCourses.map(c => ({
      sks: c.sks,
      grade_points: gradeMapping[c.huruf_mutu] || 0
    }));

    const ipk = calculateIP(allProcessed);
    const progress = calculateProgresKelulusan(allCourses);

    // E-Grade Warnings
    const eCourses = allCourses.filter(c => c.huruf_mutu === 'E');

    res.json({
      ipk,
      total_sks_lulus: progress.totalSksLulus,
      has_e: progress.hasE,
      trend: trendIP,
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
