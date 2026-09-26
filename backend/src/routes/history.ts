import { Router } from 'express';
import { prisma } from '../db';

const router = Router();

// Simpan/update riwayat semester
router.post('/save', async (req, res) => {
  try {
    const { user_id, nama_semester, courses } = req.body;
    
    // Upsert semester
    const semester = await prisma.semester.upsert({
      where: { user_id_nama_semester: { user_id, nama_semester } },
      update: {},
      create: { user_id, nama_semester }
    });

    // Hapus course lama untuk semester ini (cara sederhana untuk update batch)
    await prisma.course.deleteMany({ where: { semester_id: semester.id } });

    // Insert course baru
    const newCourses = courses.map((c: any) => ({
      semester_id: semester.id,
      nama_mk: c.nama_mk || '',
      sks: Number(c.sks),
      huruf_mutu: c.huruf_mutu,
      kelompok_mk: c.kelompok_mk || 'reguler'
    }));

    await prisma.course.createMany({ data: newCourses });

    res.json({ message: 'Riwayat berhasil disimpan' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Ambil riwayat lengkap
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const semesters = await prisma.semester.findMany({
      where: { user_id: userId },
      include: { courses: true },
      orderBy: { created_at: 'asc' }
    });
    res.json(semesters);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
