import { useEffect, useState, useMemo } from 'react';
import { WarningCircle, ChartLineUp, BookOpen, CheckCircle, XCircle, CalendarBlank, MapTrifold, MapPin } from '@phosphor-icons/react';
import Chatbot from './Chatbot';
import Layout from './Layout';

export default function Dashboard() {
  const [data, setData] = useState<any>(null);
  const [sksPerSemester, setSksPerSemester] = useState(20);
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

        {/* Graduation Checklist */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-sm overflow-hidden flex flex-col">
            <div className="p-6 border-b border-zinc-200 dark:border-zinc-800 flex items-center gap-2">
              <CheckCircle size={20} className="text-zinc-500" />
              <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-950 dark:text-white">Checklist Syarat Lulus</h3>
            </div>
            <div className="p-6 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Total SKS (≥ 144)</span>
                {data.total_sks_lulus >= 144 ? <CheckCircle weight="fill" className="text-green-500" size={20}/> : <XCircle weight="fill" className="text-red-500" size={20}/>}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">IPK (≥ 2.00)</span>
                {data.ipk >= 2.0 ? <CheckCircle weight="fill" className="text-green-500" size={20}/> : <XCircle weight="fill" className="text-red-500" size={20}/>}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Bebas Nilai E</span>
                {!data.has_e ? <CheckCircle weight="fill" className="text-green-500" size={20}/> : <XCircle weight="fill" className="text-red-500" size={20}/>}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Skor TOEFL (≥ 477)</span>
                {(data.skor_toefl && data.skor_toefl >= 477) ? <CheckCircle weight="fill" className="text-green-500" size={20}/> : <XCircle weight="fill" className="text-red-500" size={20}/>}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Tugas Akhir / Skripsi</span>
                {data.status_skripsi ? <CheckCircle weight="fill" className="text-green-500" size={20}/> : <XCircle weight="fill" className="text-red-500" size={20}/>}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">KKN-T Selesai</span>
                {data.status_kkn ? <CheckCircle weight="fill" className="text-green-500" size={20}/> : <XCircle weight="fill" className="text-red-500" size={20}/>}
              </div>
            </div>
          </div>

          <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-sm overflow-hidden flex flex-col">
            <div className="p-6 border-b border-zinc-200 dark:border-zinc-800 flex items-center gap-2">
              <CalendarBlank size={20} className="text-zinc-500" />
              <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-950 dark:text-white">Estimasi Wisuda</h3>
            </div>
            <div className="p-6 flex flex-col gap-6 flex-grow">
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold uppercase tracking-widest text-zinc-500">Asumsi Kecepatan Studi</label>
                  <span className="font-bold text-zinc-900 dark:text-white">{sksPerSemester} SKS / Semester</span>
                </div>
                <input 
                  type="range" 
                  min="10" 
                  max="24" 
                  value={sksPerSemester} 
                  onChange={(e) => setSksPerSemester(Number(e.target.value))}
                  className="w-full accent-brand-500"
                />
                <p className="text-xs text-zinc-500">
                  Estimasi ini mengasumsikan Anda mengambil rata-rata {sksPerSemester} SKS per semester (Ubah angka ini jika rencana Anda berbeda).
                </p>
              </div>

              <div className="mt-auto p-4 bg-brand-50 dark:bg-brand-950/20 border border-brand-200 dark:border-brand-900 rounded-sm flex flex-col gap-1 items-center justify-center text-center">
                {data.total_sks_lulus >= 144 ? (
                  <span className="text-brand-700 dark:text-brand-400 font-bold text-lg">Anda sudah memenuhi syarat SKS kelulusan!</span>
                ) : (
                  <>
                    <span className="text-xs font-semibold uppercase tracking-widest text-brand-600 dark:text-brand-500">Estimasi Sisa Waktu</span>
                    <span className="text-3xl font-bold text-brand-700 dark:text-brand-400">
                      {Math.ceil(Math.max(0, 144 - data.total_sks_lulus) / sksPerSemester)} Semester Lagi
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Visual Timeline / Roadmap */}
        <section className="mt-8 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-zinc-200 dark:border-zinc-800 flex items-center gap-2">
            <MapTrifold size={20} className="text-zinc-500" />
            <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-950 dark:text-white">Peta Jalan Studi (Maks 14 Semester)</h3>
          </div>
          <div className="p-6 overflow-x-auto pb-8">
            <div className="flex md:flex-row flex-col gap-6 md:gap-0 min-w-max md:items-center">
              {data.roadmap?.map((node: any, idx: number) => {
                const isCompleted = node.status === 'completed';
                const isCurrent = node.status === 'current';
                const isPlanned = node.status === 'planned';
                
                // Zona Merah (Drop out warning) for semesters > 8
                const isZoneMerah = node.semester_ke > 8;
                const isCritical = node.semester_ke >= 13;

                // Hitung estimasi SKS untuk node planned
                let displaySks = node.sks_kumulatif;
                if (isPlanned || isCurrent) {
                   const offset = node.semester_ke - (data.trend?.length || 0);
                   const estimatedSks = data.total_sks_lulus + (offset * sksPerSemester);
                   displaySks = estimatedSks;
                }

                return (
                  <div key={idx} className="flex md:flex-row flex-col items-start md:items-center relative group">
                    {/* Line connector (Desktop) */}
                    {idx < data.roadmap.length - 1 && (
                      <div className={`hidden md:block w-16 h-1 mx-2 rounded-full transition-colors ${isCompleted ? 'bg-brand-600' : isZoneMerah ? 'bg-red-200 dark:bg-red-900/50 border-t border-dashed border-red-500' : 'bg-zinc-200 dark:bg-zinc-800 border-t border-dashed border-zinc-400'}`} />
                    )}
                    
                    {/* Line connector (Mobile) */}
                    {idx < data.roadmap.length - 1 && (
                      <div className={`md:hidden w-1 h-8 ml-5 my-1 rounded-full transition-colors ${isCompleted ? 'bg-brand-600' : isZoneMerah ? 'bg-red-200 dark:bg-red-900/50 border-l border-dashed border-red-500' : 'bg-zinc-200 dark:bg-zinc-800 border-l border-dashed border-zinc-400'}`} />
                    )}

                    {/* Node */}
                    <div className="flex items-center md:flex-col gap-4 md:gap-2">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm z-10 shadow-sm border-2 transition-all ${
                        isCompleted ? 'bg-brand-600 border-brand-600 text-white' : 
                        isCurrent ? 'bg-white dark:bg-zinc-950 border-brand-500 text-brand-600 shadow-brand-500/20 ring-4 ring-brand-500/20' : 
                        isCritical ? 'bg-red-50 dark:bg-red-950 border-red-500 text-red-600' :
                        isZoneMerah ? 'bg-white dark:bg-zinc-900 border-red-300 dark:border-red-800 text-red-400' :
                        'bg-zinc-50 dark:bg-zinc-900 border-zinc-300 dark:border-zinc-700 text-zinc-400'
                      }`}>
                        {node.semester_ke}
                      </div>

                      {/* Tooltip / Info */}
                      <div className="flex flex-col md:items-center min-w-[100px]">
                        <span className={`text-xs font-bold uppercase tracking-wider ${
                          isCompleted ? 'text-zinc-900 dark:text-zinc-100' :
                          isCurrent ? 'text-brand-600 dark:text-brand-400' :
                          isCritical ? 'text-red-600 dark:text-red-500' :
                          isZoneMerah ? 'text-red-500 dark:text-red-400' :
                          'text-zinc-500'
                        }`}>
                          {isCurrent ? 'Saat Ini' : isZoneMerah ? 'Zona Merah' : `Sem ${node.semester_ke}`}
                        </span>
                        
                        {(isCompleted || isCurrent || isPlanned) && (
                          <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 flex flex-col md:items-center gap-0.5">
                            {displaySks !== null && (
                              <span className={displaySks >= 144 ? 'text-green-600 font-bold' : ''}>
                                {isPlanned ? '~' : ''}{displaySks} SKS
                              </span>
                            )}
                            {node.ipk_kumulatif !== null ? (
                              <span className="font-semibold text-zinc-700 dark:text-zinc-300">IPK {node.ipk_kumulatif.toFixed(2)}</span>
                            ) : (
                              <span className="opacity-50">—</span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* CMS Style Tabular Data */}
        <section className="mt-8">
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
