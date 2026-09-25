import { Router } from 'express';
import { prisma } from '../db';

const router = Router();

// Get active academic configuration
router.get('/active', async (req, res) => {
  try {
    let config = await prisma.academicConfig.findFirst({
      where: { active: true }
    });

    // If no config in DB, return default IPB rules
    if (!config) {
      config = {
        id: 'default',
        version: 'default-1.0',
        active: true,
        created_at: new Date(),
        updated_at: new Date(),
        grade_mapping: {
          "A": 4.0,
          "AB": 3.5,
          "B": 3.0,
          "BC": 2.5,
          "C": 2.0,
          "D": 1.0,
          "E": 0.0
        },
        predicate_rules: {
          "Cumlaude": { "min": 3.51, "max": 4.00, "max_study_years": 4 },
          "Sangat Memuaskan": { "min": 3.01, "max": 3.50 },
          "Memuaskan": { "min": 2.76, "max": 3.00 }
        }
      } as any;
    }

    res.json(config);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
