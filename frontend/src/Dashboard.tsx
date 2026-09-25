import { useEffect, useState } from 'react';
import { WarningCircle, ChartLineUp, BookOpen } from '@phosphor-icons/react';
import Chatbot from './Chatbot';
import Layout from './Layout';

export default function Dashboard() {
  const [data, setData] = useState<any>(null);
  const userId = localStorage.getItem('ipku_user_id');

  useEffect(() => {
    if (!userId) return;
    
    fetch(`http://localhost:3001/api/dashboard/summary/${userId}`)
      .then(res => res.json())
      .then(d => setData(d))
      .catch(console.error);
  }, [userId]);

  if (!data) return (
    <Layout>
      <div className="flex items-center justify-center h-full text-zinc-500 font-medium">Memuat data akademik...</div>
    </Layout>
  );

  return (
    <Layout>
      <div className="w-full max-w-5xl flex flex-col gap-8">
        
        <header className="border-b border-zinc-200 dark:border-zinc-800 pb-6">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-950 dark:text-white">Ringkasan Akademik</h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-2 max-w-[60ch]">
            Metrik utama dan peringatan status kelulusan. Data dihitung berdasarkan riwayat yang telah Anda masukkan.
          </p>
        </header>

        {data.warnings?.length > 0 && (
          <div className="bg-red-50 dark:bg-red-950/20 border-l-4 border-red-600 dark:border-red-500 p-4 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-red-700 dark:text-red-400 font-semibold text-sm uppercase tracking-wider">
              <WarningCircle weight="bold" size={18} />
              Tindakan Diperlukan: Nilai E Ditemukan
            </div>
            <ul className="text-sm text-red-800 dark:text-red-300 space-y-1 ml-6 list-disc">
              {data.warnings.map((w: any, i: number) => (
                <li key={i}>
                  <span className="font-semibold">{w.nama_mk}</span> (dari {w.semester_asal}) — wajib diulang sebelum batas 4 semester (Deadline: {w.batas_waktu}).
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Stark Geometric Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 flex flex-col justify-between rounded-sm">
            <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400 mb-6">
              <ChartLineUp size={20} />
              <h2 className="text-xs font-semibold uppercase tracking-widest">Indeks Prestasi Kumulatif</h2>
            </div>
            <div className="text-6xl font-bold text-zinc-950 dark:text-white tracking-tighter">
              {data.ipk?.toFixed(2) || "0.00"}
            </div>
          </div>

          <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 flex flex-col justify-between rounded-sm">
            <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400 mb-6">
              <BookOpen size={20} />
              <h2 className="text-xs font-semibold uppercase tracking-widest">SKS Diselesaikan</h2>
            </div>
            <div>
              <div className="flex items-baseline gap-2 mb-3">
                <span className="text-5xl font-bold tracking-tighter text-zinc-950 dark:text-white">{data.total_sks_lulus}</span>
                <span className="text-zinc-500 font-medium text-lg">/ 144 SKS</span>
              </div>
              <div className="w-full h-2 bg-zinc-100 dark:bg-zinc-800 rounded-none overflow-hidden">
                <div 
                  className="h-full bg-brand-600 transition-all duration-1000" 
                  style={{ width: `${Math.min(100, (data.total_sks_lulus / 144) * 100)}%` }} 
                />
              </div>
            </div>
          </div>
        </div>

        {/* CMS Style Tabular Data */}
        <section className="mt-4">
          <h3 className="text-lg font-bold mb-4 tracking-tight text-zinc-950 dark:text-white">Riwayat Per Semester</h3>
          {data.trend?.length === 0 ? (
            <div className="p-12 text-center border border-zinc-200 dark:border-zinc-800 border-dashed text-zinc-500 bg-zinc-50 dark:bg-zinc-900/50 rounded-sm">
              Belum ada data. Tambahkan nilai melalui menu Input Nilai.
            </div>
          ) : (
            <div className="overflow-x-auto border border-zinc-200 dark:border-zinc-800 rounded-sm">
              <table className="w-full text-left text-sm">
                <thead className="bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400">
                  <tr>
                    <th className="px-4 py-3 font-semibold uppercase tracking-wider text-xs">Semester</th>
                    <th className="px-4 py-3 font-semibold uppercase tracking-wider text-xs text-right">IPS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/50 bg-white dark:bg-zinc-950">
                  {data.trend?.map((t: any, i: number) => (
                    <tr key={i} className="hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors">
                      <td className="px-4 py-3 font-medium text-zinc-900 dark:text-zinc-100">{t.semester}</td>
                      <td className="px-4 py-3 text-right font-bold text-zinc-900 dark:text-white">{t.ip.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

      </div>
      <Chatbot />
    </Layout>
  );
}
