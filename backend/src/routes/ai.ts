import { Router } from 'express';
import { prisma } from '../db';
import { calculateProgresKelulusan } from '../engine';

const router = Router();

async function callAiApi(url: string, key: string, model: string, systemPrompt: string, userMessage: string) {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${key}`
    },
    body: JSON.stringify({
      model: model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage || "Apa saran untuk studi saya?" }
      ]
    })
  });
  
  const data = await response.json();
  
  let errorObj = data.error;
  if (Array.isArray(data) && data[0]?.error) {
    errorObj = data[0].error;
  }
  
  if (errorObj) {
    throw new Error(errorObj.message || "Unknown AI error");
  }

  const reply = data.choices?.[0]?.message?.content || data.response;
  if (!reply) {
    throw new Error("Invalid response format from AI API");
  }
  
  return reply;
}

router.post('/chat', async (req, res) => {
  try {
    const { userId, message } = req.body;
    
    // Ambil konteks akademik user
    const semesters = await prisma.semester.findMany({
      where: { user_id: userId },
      include: { courses: true }
    });

    let allCourses: any[] = [];
    semesters.forEach(s => allCourses.push(...s.courses));
    
    const progress = calculateProgresKelulusan(allCourses);
    const eCourses = allCourses.filter(c => c.huruf_mutu === 'E');
    
    // System prompt untuk AI agar konteksnya jelas
    const systemPrompt = `Anda adalah penasihat akademik IPB. 
Mahasiswa ini telah lulus ${progress.totalSksLulus} SKS dari syarat 144 SKS.
${eCourses.length > 0 ? `Mahasiswa ini memiliki nilai E pada matkul: ${eCourses.map(c => c.nama_mk).join(', ')}. Aturan IPB: Nilai E wajib diulang maksimal 4 semester setelahnya, dan maksimal diulang 2 kali. Jika gagal dikeluarkan.` : 'Mahasiswa ini tidak memiliki nilai E.'}`;

    const AI_API_URL = process.env.AI_API_URL;
    const AI_API_KEY = process.env.AI_API_KEY;

    if (!AI_API_URL) {
      return res.json({
        reply: `(Mode Offline) Halo! Berdasarkan catatan, Anda sudah lulus ${progress.totalSksLulus} SKS. Sisa ${Math.max(0, 144 - progress.totalSksLulus)} SKS lagi. ${eCourses.length > 0 ? 'PENTING: Anda punya nilai E yang wajib diulang maksimal 4 semester dari pengambilan awal agar tidak DO!' : 'Terus pertahankan nilai Anda!'}`
      });
    }

    try {
      const reply = await callAiApi(AI_API_URL, AI_API_KEY || '', 'gemini-3.8-flash', systemPrompt, message);
      return res.json({ reply });
    } catch (primaryError: any) {
      console.error("Primary AI failed:", primaryError.message);
      return res.json({ reply: `(AI Error) ${primaryError.message}` });
    }

  } catch (error) {
    console.error("Server AI error:", error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
