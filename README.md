# IPKu — Pelacak Akademik & Perencana Kelulusan Mahasiswa IPB

IPKu adalah aplikasi web khusus mahasiswa Sarjana Institut Pertanian Bogor (IPB) untuk mencatat **seluruh riwayat nilai mata kuliah** secara terpusat, memantau *dashboard* progres kelulusan (IPK berjalan, sisa SKS menuju 144), dan memberikan **rekomendasi konkret** berbasis aturan akademik (termasuk panduan penanganan saat mendapatkan nilai E).

Aplikasi ini didesain dengan pendekatan arsitektural *stark CMS* (bersih, kaku, dan profesional) dan terintegrasi dengan asisten akademik berbasis *Artificial Intelligence* (AI).

## Fitur Utama

- 📊 **Dashboard Akademik (CMS Style)**: Ringkasan visual masif (tabular & geometris) untuk IPK, SKS terselesaikan, dan riwayat per semester.
- 🗂 **Manajemen Riwayat Nilai**: Input nilai mata kuliah secara menyeluruh, mendukung perhitungan otomatis sesuai aturan pembobotan huruf mutu IPB.
- 🚨 **Sistem Peringatan Nilai E**: Pelacakan batas waktu wajib mengulang (maks 4 semester, maks 2 kali) agar terhindar dari *Drop-Out*.
- 🤖 **Asisten AI Terintegrasi**: *Chatbot* akademik cerdas berbasis Google Gemini (mendukung *fallback* otomatis ke model OpenRouter bila *server* penuh).
- 👤 **Profil Generatif**: Manajemen identitas dengan pembuatan avatar otomatis berbasis inisial.

## Tech Stack

- **Frontend**: React.js (Vite), Tailwind CSS (Desain kustom berbasis aturan *anti-slop*), Phosphor Icons, Motion (Framer).
- **Backend**: Node.js, Express.js.
- **Database**: PostgreSQL (dikelola via Prisma ORM).
- **AI Integration**: Google Gemini API (dengan cadangan model Nvidia/Llama via OpenRouter).

## Cara Menjalankan Secara Lokal (Development)

Pastikan Anda memiliki Node.js dan PostgreSQL terpasang.

### 1. Kloning Repositori
```bash
git clone https://github.com/USERNAME/IPKu.git
cd IPKu
```

### 2. Setup Database (Backend)
```bash
cd backend
npm install
```
- Buat file `.env` di folder `backend/` dan isi variabel berikut:
```env
DATABASE_URL="postgresql://user:pass@host:port/dbname"
JWT_SECRET="rahasia_anda"
AI_API_KEY="api_key_gemini_anda"
AI_API_URL="https://generativelanguage.googleapis.com/v1beta/openai/chat/completions"
```
- Jalankan migrasi Prisma dan jalankan server:
```bash
npx prisma db push
npm run dev
```

### 3. Setup Frontend
Buka terminal baru di *root directory*.
```bash
cd frontend
npm install
npm run dev
```
Aplikasi bisa diakses di `http://localhost:5173`.

## Panduan Desain (*Design Directives*)
UI proyek ini ditulis dengan mengacu ketat pada aturan kustom (tidak menggunakan komponen *mainstream* seperti neomorfisme atau *oversaturated pill-shapes*). Harap patuhi sistem desain *stark* saat berkontribusi.

## Lisensi
Hak cipta © 2026 IPKu. Khusus untuk kalangan mahasiswa IPB.
