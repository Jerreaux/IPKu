import { Router } from 'express';
import { calculateIP } from '../engine';
import { prisma } from '../db';

const router = Router();

// Calculate IP/IPK based on active rules
router.post('/calculate', async (req, res) => {
  try {
    const { courses } = req.body;
    // courses: [{sks: 3, huruf_mutu: "A"}, {sks: 2, huruf_mutu: "AB"}]
    
    // Get active config
    let config = await prisma.academicConfig.findFirst({ where: { active: true } });
    let gradeMapping: any = config?.grade_mapping;
    
    if (!config) {
       gradeMapping = { "A": 4.0, "AB": 3.5, "B": 3.0, "BC": 2.5, "C": 2.0, "D": 1.0, "E": 0.0 };
    }

    const processedCourses = courses.map((c: any) => ({
      sks: c.sks,
      grade_points: gradeMapping[c.huruf_mutu] || 0
    }));

    const ip = calculateIP(processedCourses);
    
    res.json({ ip, total_sks: courses.reduce((sum: number, c: any) => sum + c.sks, 0) });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
