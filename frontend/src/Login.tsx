import { API_BASE } from './api';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, ShieldCheck } from '@phosphor-icons/react';
import { motion } from 'motion/react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const endpoint = isRegister ? '/api/auth/register' : '/api/auth/login';
    
    try {
      const res = await fetch(`${API_BASE}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      
      if (res.ok) {
        localStorage.setItem('ipku_user_id', data.user.id);
        localStorage.setItem('ipku_token', data.token);
        navigate('/app');
      } else {
        alert(data.error || 'Gagal login');
      }
    } catch (err) {
      alert('Terjadi kesalahan koneksi');
    }
  };

  return (
    <div className="min-h-[100dvh] w-full flex bg-white dark:bg-zinc-950">
      
      {/* Left Column - Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-16 md:px-24 xl:px-32 py-12">
        <Link to="/" className="w-fit flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors mb-16">
          <ArrowLeft size={16} />
          Kembali ke Beranda
        </Link>
        
        <motion.div 
          className="max-w-md w-full"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="mb-10">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tighter text-zinc-950 dark:text-white mb-3">
              {isRegister ? 'Mulai Pemantauan.' : 'Selamat Datang.'}
            </h1>
            <p className="text-zinc-500 dark:text-zinc-400">
              {isRegister 
                ? 'Buat profil akademik IPKu untuk melacak progres studi Anda dengan aman.' 
                : 'Masuk kembali untuk melanjutkan pengelolaan target 144 SKS Anda.'}
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-widest text-zinc-700 dark:text-zinc-300">Email Kampus</label>
              <input 
                type="email" 
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition-colors"
                placeholder="mahasiswa@apps.ipb.ac.id"
              />
            </div>
            
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-widest text-zinc-700 dark:text-zinc-300">Kata Sandi</label>
              <input 
                type="password" 
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition-colors"
                placeholder="••••••••"
              />
            </div>
            
            <button type="submit" className="w-full bg-brand-600 hover:bg-brand-700 text-white font-medium py-4 rounded-sm transition-colors mt-4 flex items-center justify-center gap-2">
              {isRegister ? 'Daftar Sekarang' : 'Masuk ke Dashboard'}
            </button>
          </form>
          
          <div className="mt-8 pt-8 border-t border-zinc-100 dark:border-zinc-900">
            <p className="text-sm text-zinc-500">
              {isRegister ? 'Sudah memiliki profil studi? ' : 'Baru pertama kali menggunakan IPKu? '}
              <button 
                onClick={() => setIsRegister(!isRegister)} 
                className="text-brand-600 dark:text-brand-500 hover:text-brand-700 font-semibold transition-colors"
              >
                {isRegister ? 'Masuk di sini' : 'Daftar di sini'}
              </button>
            </p>
          </div>
        </motion.div>
      </div>

      {/* Right Column - Visual (Hidden on mobile) */}
      <div className="hidden lg:flex w-1/2 bg-zinc-100 dark:bg-zinc-900 relative overflow-hidden border-l border-zinc-200 dark:border-zinc-800">
        <img 
          src="https://picsum.photos/seed/ipb-academic-architecture/1200/1600" 
          alt="Editorial Architecture" 
          className="absolute inset-0 w-full h-full object-cover grayscale mix-blend-multiply dark:mix-blend-screen opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-950/80 to-transparent" />
        
        <div className="absolute bottom-16 left-16 right-16 flex flex-col text-white">
          <ShieldCheck size={48} className="mb-6 opacity-80 text-brand-400" />
          <h2 className="text-3xl font-bold tracking-tighter mb-4 max-w-sm">
            Satu Keputusan, Puluhan SKS Terselamatkan.
          </h2>
          <p className="text-brand-100/70 max-w-md">
            Identifikasi lebih awal matakuliah yang wajib diulang, simulasikan target nilai, dan hindari sanksi DO. Data Anda dilindungi privasi sepenuhnya.
          </p>
        </div>
      </div>
      
    </div>
  );
}
