import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// GET user profile
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        nama: true,
        program_studi: true,
        angkatan: true,
        skor_toefl: true,
        status_skripsi: true,
        status_kkn: true,
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User tidak ditemukan' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ error: 'Gagal mengambil profil' });
  }
});

// PUT update user profile
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nama, program_studi, angkatan, skor_toefl, status_skripsi, status_kkn } = req.body;

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        nama: nama || null,
        program_studi: program_studi || null,
        angkatan: angkatan ? parseInt(angkatan) : null,
        skor_toefl: skor_toefl ? parseInt(skor_toefl) : null,
        status_skripsi: status_skripsi === true,
        status_kkn: status_kkn === true,
      },
      select: {
        id: true,
        email: true,
        nama: true,
        program_studi: true,
        angkatan: true,
        skor_toefl: true,
        status_skripsi: true,
        status_kkn: true,
      }
    });

    res.json(updatedUser);
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ error: 'Gagal menyimpan profil' });
  }
});

export default router;
