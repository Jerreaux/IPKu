import { API_BASE } from './api';
import { useEffect, useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { ChartLineUp, Plus, User, SignOut, ShieldCheck, Target } from '@phosphor-icons/react';

export default function Layout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const userId = localStorage.getItem('ipku_user_id');

  useEffect(() => {
    if (!userId) {
      navigate('/login');
      return;
    }
    
    fetch(`${API_BASE}/api/user/${userId}`)
      .then(res => {
        if (!res.ok) throw new Error("Gagal mengambil data user");
        return res.json();
      })
      .then(d => {
        if (d.error) {
          localStorage.removeItem('ipku_user_id');
          navigate('/login');
        } else {
          setUser(d);
        }
      })
      .catch(err => {
        console.error("Gagal terhubung ke server:", err);
        // Terjadi kesalahan koneksi (misal CORS/Mixed Content). Paksa logout dan ke login
        localStorage.removeItem('ipku_user_id');
        navigate('/login');
      });
  }, [userId, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('ipku_user_id');
    navigate('/');
  };

  if (!user) return <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center text-zinc-500">Memuat sesi...</div>;

  const initial = user.nama ? user.nama.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase();

  const navItems = [
    { path: '/app', label: 'Ringkasan', icon: ChartLineUp },
    { path: '/input', label: 'Riwayat Nilai', icon: Plus },
    { path: '/simulation', label: 'Simulasi & Strategi', icon: Target },
    { path: '/profile', label: 'Profil Saya', icon: User },
  ];

  return (
    <div className="min-h-screen flex bg-white dark:bg-zinc-950">
      
      {/* CMS Sidebar */}
      <aside className="w-64 border-r border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 flex flex-col justify-between hidden md:flex shrink-0 h-screen sticky top-0">
        <div>
          <div className="p-6 pb-8 border-b border-zinc-200 dark:border-zinc-800">
            <Link to="/" className="flex items-center gap-2 mb-8 text-zinc-900 dark:text-white">
              <ShieldCheck weight="fill" className="text-brand-600" size={24} />
              <span className="font-bold tracking-tight text-xl">IPKu</span>
            </Link>
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-sm bg-brand-600 text-white flex items-center justify-center font-bold text-lg">
                {initial}
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-zinc-900 dark:text-white truncate max-w-[140px]">{user.nama || 'Mahasiswa'}</span>
                <span className="text-xs text-zinc-500 truncate max-w-[140px]">{user.program_studi || user.email}</span>
              </div>
            </div>
          </div>
          
          <nav className="p-4 flex flex-col gap-1">
            {navItems.map(item => {
              const active = location.pathname === item.path;
              return (
                <Link 
                  key={item.path} 
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm font-medium transition-colors ${active ? 'bg-zinc-200 dark:bg-zinc-800 text-zinc-950 dark:text-white' : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900'}`}
                >
                  <item.icon size={20} weight={active ? "fill" : "regular"} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
        
        <div className="p-4 border-t border-zinc-200 dark:border-zinc-800">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-red-600 dark:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-sm transition-colors"
          >
            <SignOut size={20} />
            Keluar
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 overflow-y-auto">
        {/* Mobile Header (Fallback) */}
        <div className="md:hidden flex items-center justify-between p-4 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
          <Link to="/" className="flex items-center gap-2 text-zinc-900 dark:text-white">
            <ShieldCheck weight="fill" className="text-brand-600" size={20} />
            <span className="font-bold tracking-tight">IPKu</span>
          </Link>
          <div className="flex gap-2">
            <Link to="/app" className="p-2 text-zinc-600"><ChartLineUp size={24} /></Link>
            <Link to="/input" className="p-2 text-zinc-600"><Plus size={24} /></Link>
            <Link to="/profile" className="p-2 text-zinc-600"><User size={24} /></Link>
          </div>
        </div>
        
        <div className="p-4 md:p-8 lg:p-12">
          {children}
        </div>
      </main>
      
    </div>
  );
}
