import { Router } from 'express';
import { prisma } from '../db';
import { calculatePredictiveImpact, calculateRetrospectiveImpact } from '../engine';

const router = Router();

// Mode Prediktif: POST /api/simulation/predictive/:userId
router.post('/predictive/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { plannedCourses } = req.body; // Array of { nama_mk, sks }

    if (!plannedCourses || !Array.isArray(plannedCourses) || plannedCourses.length === 0) {
      return res.status(400).json({ error: 'plannedCourses is required and must be a non-empty array' });
    }

    // Get current total SKS and total mutu
    const semesters = await prisma.semester.findMany({
      where: { user_id: userId },
      include: { courses: true }
    });

    let config = await prisma.academicConfig.findFirst({ where: { active: true } });
    let gradeMapping: any = config?.grade_mapping || { "A": 4.0, "AB": 3.5, "B": 3.0, "BC": 2.5, "C": 2.0, "D": 1.0, "E": 0.0 };

    let currentSks = 0;
    let currentMutu = 0;

    for (const sem of semesters) {
      for (const c of sem.courses) {
        if (c.huruf_mutu !== 'BL') { // Skip Belum Lengkap
          const points = gradeMapping[c.huruf_mutu] || 0;
          currentSks += c.sks;
          currentMutu += c.sks * points;
        }
      }
    }

    const impact = calculatePredictiveImpact(currentSks, currentMutu, plannedCourses);

    res.json({
      currentSks,
      currentIpk: currentSks > 0 ? (Math.round((currentMutu / currentSks) * 100) / 100) : 0,
      impact
    });
  } catch (error) {
    console.error('Error in predictive simulation:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Mode Retrospektif: GET /api/simulation/retrospective/:userId
router.get('/retrospective/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const semesters = await prisma.semester.findMany({
      where: { user_id: userId },
      include: { courses: true }
    });

    let config = await prisma.academicConfig.findFirst({ where: { active: true } });
    let gradeMapping: any = config?.grade_mapping || { "A": 4.0, "AB": 3.5, "B": 3.0, "BC": 2.5, "C": 2.0, "D": 1.0, "E": 0.0 };

    let currentSks = 0;
    let currentMutu = 0;
    let pastCourses: any[] = [];

    for (const sem of semesters) {
      for (const c of sem.courses) {
        if (c.huruf_mutu !== 'BL') {
          const points = gradeMapping[c.huruf_mutu] || 0;
          currentSks += c.sks;
          currentMutu += c.sks * points;
          
          pastCourses.push({
            id: c.id,
            nama_mk: c.nama_mk,
            sks: c.sks,
            huruf_mutu: c.huruf_mutu,
            grade_points: points
          });
        }
      }
    }

    const currentIpk = currentSks > 0 ? (currentMutu / currentSks) : 0;
    
    // Only calculate if user has taken any courses
    if (currentSks === 0) {
      return res.json({ currentIpk: 0, impact: [] });
    }

    const impact = calculateRetrospectiveImpact(pastCourses, currentSks, currentMutu);

    res.json({
      currentIpk: Math.round(currentIpk * 100) / 100,
      impact
    });
  } catch (error) {
    console.error('Error in retrospective simulation:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
