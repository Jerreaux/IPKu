import { useEffect, useState } from 'react';
import { FloppyDisk, User as UserIcon } from '@phosphor-icons/react';
import Layout from './Layout';

export default function Profile() {
  const [nama, setNama] = useState('');
  const [programStudi, setProgramStudi] = useState('');
  const [angkatan, setAngkatan] = useState('');
  const [email, setEmail] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const userId = localStorage.getItem('ipku_user_id');

  useEffect(() => {
    if (!userId) return;
    
    fetch(`http://localhost:3001/api/user/${userId}`)
      .then(res => res.json())
      .then(d => {
        if (!d.error) {
          setNama(d.nama || '');
          setProgramStudi(d.program_studi || '');
          setAngkatan(d.angkatan?.toString() || '');
          setEmail(d.email || '');
        }
      })
      .catch(console.error);
  }, [userId]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await fetch(`http://localhost:3001/api/user/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nama, program_studi: programStudi, angkatan })
      });
      if (res.ok) {
        // Reload to update sidebar initial and name
        window.location.reload();
      } else {
        alert("Gagal menyimpan profil");
        setIsSaving(false);
      }
    } catch (e) {
      alert("Gagal menghubungi server");
      setIsSaving(false);
    }
  };

  const initial = nama ? nama.charAt(0).toUpperCase() : email.charAt(0).toUpperCase();

  return (
    <Layout>
      <div className="w-full max-w-3xl flex flex-col gap-8">
        
        <header className="border-b border-zinc-200 dark:border-zinc-800 pb-6">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-950 dark:text-white">Profil Identitas</h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-2">
            Kelola informasi data diri dan detail akademik Anda.
          </p>
        </header>

        <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-sm shadow-sm overflow-hidden">
          
          <div className="p-8 border-b border-zinc-200 dark:border-zinc-800 flex items-center gap-6 bg-zinc-50 dark:bg-zinc-950/50">
            <div className="w-24 h-24 rounded-sm bg-brand-600 text-white flex items-center justify-center font-bold text-4xl shadow-inner">
              {initial || <UserIcon />}
            </div>
            <div>
              <h2 className="text-xl font-bold text-zinc-950 dark:text-white">{nama || 'Mahasiswa IPB'}</h2>
              <p className="text-zinc-500">{email}</p>
              <div className="mt-3 inline-block px-3 py-1 bg-zinc-200 dark:bg-zinc-800 text-xs font-semibold uppercase tracking-widest text-zinc-700 dark:text-zinc-300 rounded-sm">
                Avatar Generatif Otomatis
              </div>
            </div>
          </div>

          <form onSubmit={handleSave} className="p-8 flex flex-col gap-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold uppercase tracking-widest text-zinc-500">Nama Lengkap</label>
                <input 
                  type="text" 
                  value={nama}
                  onChange={e => setNama(e.target.value)}
                  className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-sm px-4 py-3 outline-none focus:border-brand-500 transition-colors"
                  placeholder="Masukkan nama lengkap"
                />
              </div>
              
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold uppercase tracking-widest text-zinc-500">Email Kampus</label>
                <input 
                  type="email" 
                  value={email}
                  disabled
                  className="w-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-sm px-4 py-3 outline-none text-zinc-500 cursor-not-allowed"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold uppercase tracking-widest text-zinc-500">Program Studi</label>
                <input 
                  type="text" 
                  value={programStudi}
                  onChange={e => setProgramStudi(e.target.value)}
                  className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-sm px-4 py-3 outline-none focus:border-brand-500 transition-colors"
                  placeholder="Contoh: Ilmu Komputer"
                />
              </div>
              
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold uppercase tracking-widest text-zinc-500">Angkatan</label>
                <input 
                  type="number" 
                  value={angkatan}
                  onChange={e => setAngkatan(e.target.value)}
                  className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-sm px-4 py-3 outline-none focus:border-brand-500 transition-colors"
                  placeholder="Contoh: 60"
                />
              </div>
            </div>

            <div className="mt-4 pt-6 border-t border-zinc-200 dark:border-zinc-800 flex justify-end">
              <button 
                type="submit"
                disabled={isSaving}
                className="flex items-center gap-2 px-8 py-3 bg-brand-600 hover:bg-brand-700 text-white rounded-sm font-medium transition-colors disabled:opacity-70"
              >
                <FloppyDisk weight="fill" size={20} />
                {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
              </button>
            </div>

          </form>
        </div>

      </div>
    </Layout>
  );
}
