import { useEffect, useState } from 'react';
import { WarningCircle, CheckCircle, XCircle, CalendarBlank, MapTrifold, ArrowUpRight, ArrowDownRight, Lightbulb, TrendUp, ArrowRight } from '@phosphor-icons/react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import { Link } from 'react-router-dom';
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

  // Logic for IPS Terakhir
  const historyLen = data.trend?.length || 0;
  const lastIps = historyLen > 0 ? data.trend[historyLen - 1].ip : 0;
  let ipsDiff = 0;
  let ipsIndicator = null;

  if (historyLen > 1) {
    const prevIps = data.trend[historyLen - 2].ip;
    ipsDiff = lastIps - prevIps;
    if (ipsDiff > 0) ipsIndicator = 'up';
    else if (ipsDiff < 0) ipsIndicator = 'down';
  }

  return (
    <Layout>
      <div className="w-full max-w-6xl mx-auto flex flex-col gap-8 pb-12">

        <header className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-950 dark:text-white">Pusat Kendali Akademik</h1>
          <p className="text-zinc-500 dark:text-zinc-400">Pantau progres studi dan dapatkan rekomendasi berbasis data.</p>
        </header>

        {/* 1. Hero Stats (Baris Atas) */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

          {/* IPK Card */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-sm flex flex-col justify-between">
            <span className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-2">Indeks Prestasi Kumulatif</span>
            <div className="text-5xl font-bold tracking-tighter text-brand-600 dark:text-brand-400">
              {data.ipk.toFixed(2)}
            </div>
            <div className="mt-4 text-xs font-medium text-zinc-400">
              Skala 4.00
            </div>
          </div>

          {/* SKS Card */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-sm flex flex-col justify-between">
            <span className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-2">SKS Terselesaikan</span>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-bold tracking-tighter text-zinc-900 dark:text-white">{data.total_sks_lulus}</span>
              <span className="text-zinc-500 font-medium">/ 144</span>
            </div>
            <div className="mt-4 w-full h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-none overflow-hidden">
              <div
                className="h-full bg-brand-600"
                style={{ width: `${Math.min(100, (data.total_sks_lulus / 144) * 100)}%` }}
              />
            </div>
          </div>

          {/* IPS Terakhir Card */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-sm flex flex-col justify-between">
            <span className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-2">IPS Terakhir</span>
            <div className="flex items-center gap-3">
              <span className="text-5xl font-bold tracking-tighter text-zinc-900 dark:text-white">
                {lastIps.toFixed(2)}
              </span>
              {ipsIndicator === 'up' && (
                <div className="flex items-center text-green-600 bg-green-50 dark:bg-green-950/30 px-2 py-1 rounded-sm text-sm font-bold">
                  <ArrowUpRight weight="bold" /> +{Math.abs(ipsDiff).toFixed(2)}
                </div>
              )}
              {ipsIndicator === 'down' && (
                <div className="flex items-center text-red-600 bg-red-50 dark:bg-red-950/30 px-2 py-1 rounded-sm text-sm font-bold">
                  <ArrowDownRight weight="bold" /> -{Math.abs(ipsDiff).toFixed(2)}
                </div>
              )}
            </div>
            <div className="mt-4 text-xs font-medium text-zinc-400">
              {historyLen > 0 ? `Semester ${historyLen}` : 'Belum ada data'}
            </div>
          </div>

          {/* Warning Badge Card */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-sm flex flex-col justify-between">
            <span className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-2">Status Risiko</span>
            <div className="flex flex-col gap-2">
              {data.warnings?.length > 0 ? (
                <>
                  <div className="flex items-center gap-2 text-red-600 font-bold">
                    <WarningCircle size={24} weight="fill" />
                    <span className="text-2xl tracking-tight">{data.warnings.length} MK Kritis</span>
                  </div>
                  <Link to="/simulation" className="mt-auto text-xs font-semibold bg-red-50 dark:bg-red-950 text-red-600 px-3 py-2 text-center hover:bg-red-100 dark:hover:bg-red-900 transition-colors">
                    Lihat Tindakan
                  </Link>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-2 text-green-600 font-bold">
                    <CheckCircle size={24} weight="fill" />
                    <span className="text-2xl tracking-tight">Aman</span>
                  </div>
                  <div className="mt-auto text-xs font-medium text-zinc-400">
                    Tidak ada nilai E yang wajib diulang
                  </div>
                </>
              )}
            </div>
          </div>

        </section>

        {/* 2. Kartu Rekomendasi (Insights Banner) */}
        {data.insights && data.insights.length > 0 && (
          <section className="flex flex-col gap-3">
            {data.insights.map((insight: any, i: number) => (
              <div
                key={i}
                className={`p-4 border rounded-sm flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between ${insight.type === 'info' ? 'bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900/50 text-blue-900 dark:text-blue-100' :
                  insight.type === 'warning' ? 'bg-orange-50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-900/50 text-orange-900 dark:text-orange-100' :
                    'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-900/50 text-green-900 dark:text-green-100'
                  }`}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">
                    {insight.type === 'warning' ? <WarningCircle weight="fill" size={20} className="text-orange-500" /> : <Lightbulb weight="fill" size={20} className={insight.type === 'success' ? 'text-green-500' : 'text-blue-500'} />}
                  </div>
                  <p className="text-sm font-medium leading-relaxed">{insight.message}</p>
                </div>
                {insight.actionLabel && insight.actionLink && (
                  <Link
                    to={insight.actionLink}
                    className={`shrink-0 flex items-center gap-1.5 px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-sm transition-colors ${insight.type === 'warning' ? 'bg-orange-600 text-white hover:bg-orange-700' : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                  >
                    {insight.actionLabel}
                    <ArrowRight weight="bold" />
                  </Link>
                )}
              </div>
            ))}
          </section>
        )}

        {/* 3. Grafik Tren IP & Timeline (Grid Layout) */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Line Chart */}
          <div className="lg:col-span-2 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-sm overflow-hidden flex flex-col">
            <div className="p-6 border-b border-zinc-200 dark:border-zinc-800 flex items-center gap-2">
              <TrendUp size={20} className="text-zinc-500" />
              <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-950 dark:text-white">Tren Indeks Prestasi Semester</h3>
            </div>
            <div className="p-6 h-[300px] w-full">
              {data.trend && data.trend.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data.trend} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#3f3f46" opacity={0.2} />
                    <XAxis
                      dataKey="semester_ke"
                      tickFormatter={(val) => `Sem ${val}`}
                      tick={{ fill: '#71717a', fontSize: 12 }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      domain={[0, 4]}
                      tick={{ fill: '#71717a', fontSize: 12 }}
                      tickLine={false}
                      axisLine={false}
                      tickCount={5}
                    />
                    <RechartsTooltip
                      contentStyle={{ backgroundColor: '#18181b', border: 'none', borderRadius: '4px', color: '#fff', fontSize: '14px', fontWeight: 'bold' }}
                      itemStyle={{ color: '#fff' }}
                      labelFormatter={(label) => `Semester ${label}`}
                    />
                    <Line
                      type="monotone"
                      dataKey="ip"
                      name="IPS"
                      stroke="#0284c7" // brand-600
                      strokeWidth={3}
                      dot={{ r: 4, strokeWidth: 2, fill: '#fff' }}
                      activeDot={{ r: 6, fill: '#0284c7', stroke: '#fff', strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-zinc-500 border border-dashed border-zinc-300 dark:border-zinc-700">
                  Belum ada data untuk ditampilkan grafik.
                </div>
              )}
            </div>
          </div>

          {/* Visual Timeline (Vertical Mobile, Standard Desktop) */}
          <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-sm overflow-hidden flex flex-col">
            <div className="p-6 border-b border-zinc-200 dark:border-zinc-800 flex items-center gap-2">
              <MapTrifold size={20} className="text-zinc-500" />
              <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-950 dark:text-white">Peta Jalan Studi</h3>
            </div>
            <div className="p-6 overflow-y-auto max-h-[300px]">
              <div className="flex flex-col gap-0 relative">
                {data.roadmap?.map((node: any, idx: number) => {
                  const isCompleted = node.status === 'completed';
                  const isCurrent = node.status === 'current';
                  const isPlanned = node.status === 'planned';
                  const isZoneMerah = node.semester_ke > 8;
                  const isCritical = node.semester_ke >= 13;

                  let displaySks = node.sks_kumulatif;
                  if (isPlanned || isCurrent) {
                    const offset = node.semester_ke - (data.trend?.length || 0);
                    const estimatedSks = data.total_sks_lulus + (offset * sksPerSemester);
                    displaySks = estimatedSks;
                  }

                  return (
                    <div key={idx} className="flex flex-row items-stretch group min-h-[60px]">
                      {/* Timeline Line & Node */}
                      <div className="flex flex-col items-center mr-4 w-10">
                        <div className={`w-8 h-8 shrink-0 rounded-full flex items-center justify-center font-bold text-xs z-10 border-2 transition-all ${isCompleted ? 'bg-brand-600 border-brand-600 text-white' :
                          isCurrent ? 'bg-white dark:bg-zinc-950 border-brand-500 text-brand-600 shadow-brand-500/20 ring-4 ring-brand-500/20' :
                            isCritical ? 'bg-red-50 dark:bg-red-950 border-red-500 text-red-600' :
                              isZoneMerah ? 'bg-white dark:bg-zinc-900 border-red-300 dark:border-red-800 text-red-400' :
                                'bg-zinc-50 dark:bg-zinc-900 border-zinc-300 dark:border-zinc-700 text-zinc-400'
                          }`}>
                          {node.semester_ke}
                        </div>
                        {idx < data.roadmap.length - 1 && (
                          <div className={`w-1 grow my-1 rounded-full ${isCompleted ? 'bg-brand-600' :
                            isZoneMerah ? 'bg-red-200 dark:bg-red-900/50 border-l border-dashed border-red-500' :
                              'bg-zinc-200 dark:bg-zinc-800 border-l border-dashed border-zinc-400'
                            }`} />
                        )}
                      </div>

                      {/* Content */}
                      <div className="pb-4 pt-1 flex flex-col justify-start">
                        <span className={`text-xs font-bold uppercase tracking-wider ${isCompleted ? 'text-zinc-900 dark:text-zinc-100' :
                          isCurrent ? 'text-brand-600 dark:text-brand-400' :
                            isCritical ? 'text-red-600 dark:text-red-500' :
                              isZoneMerah ? 'text-red-500 dark:text-red-400' :
                                'text-zinc-500'
                          }`}>
                          {isCurrent ? 'Saat Ini' : isZoneMerah ? 'Zona Merah' : `Semester ${node.semester_ke}`}
                        </span>

                        {(isCompleted || isCurrent || isPlanned) && (
                          <div className="text-xs text-zinc-500 dark:text-zinc-400 flex items-center gap-2 mt-0.5">
                            {displaySks !== null && (
                              <span className={displaySks >= 144 ? 'text-green-600 font-bold' : ''}>
                                {isPlanned ? '~' : ''}{displaySks} SKS
                              </span>
                            )}
                            {node.ipk_kumulatif !== null && node.ipk_kumulatif > 0 && (
                              <>
                                <span className="w-1 h-1 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                                <span className="font-semibold text-zinc-700 dark:text-zinc-300">IPK {node.ipk_kumulatif.toFixed(2)}</span>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* 4. Checklist & Estimator */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-sm overflow-hidden flex flex-col">
            <div className="p-6 border-b border-zinc-200 dark:border-zinc-800 flex items-center gap-2">
              <CheckCircle size={20} className="text-zinc-500" />
              <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-950 dark:text-white">Checklist Syarat Lulus</h3>
            </div>
            <div className="p-6 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Total SKS (≥ 144)</span>
                {data.total_sks_lulus >= 144 ? <CheckCircle weight="fill" className="text-green-500" size={20} /> : <XCircle weight="fill" className="text-red-500" size={20} />}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">IPK (≥ 2.00)</span>
                {data.ipk >= 2.0 ? <CheckCircle weight="fill" className="text-green-500" size={20} /> : <XCircle weight="fill" className="text-red-500" size={20} />}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Bebas Nilai E</span>
                {!data.has_e ? <CheckCircle weight="fill" className="text-green-500" size={20} /> : <XCircle weight="fill" className="text-red-500" size={20} />}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Skor TOEFL (≥ 477)</span>
                {(data.skor_toefl && data.skor_toefl >= 477) ? <CheckCircle weight="fill" className="text-green-500" size={20} /> : <XCircle weight="fill" className="text-red-500" size={20} />}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Tugas Akhir / Skripsi</span>
                {data.status_skripsi ? <CheckCircle weight="fill" className="text-green-500" size={20} /> : <XCircle weight="fill" className="text-red-500" size={20} />}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">KKN-T Selesai</span>
                {data.status_kkn ? <CheckCircle weight="fill" className="text-green-500" size={20} /> : <XCircle weight="fill" className="text-red-500" size={20} />}
              </div>
            </div>
          </div>

          <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-sm overflow-hidden flex flex-col">
            <div className="p-6 border-b border-zinc-200 dark:border-zinc-800 flex items-center gap-2">
              <CalendarBlank size={20} className="text-zinc-500" />
              <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-950 dark:text-white">Estimasi Kelulusan</h3>
            </div>
            <div className="p-6 flex flex-col gap-6 flex-grow">
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold uppercase tracking-widest text-zinc-500">Asumsi Kecepatan Studi</label>
                  <span className="font-bold text-zinc-900 dark:text-white">{sksPerSemester} SKS / Sem</span>
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
                  Estimasi ini memengaruhi peta jalan (timeline) di atas.
                </p>
              </div>

              <div className="mt-auto p-4 bg-brand-50 dark:bg-brand-950/20 border border-brand-200 dark:border-brand-900 rounded-sm flex flex-col gap-1 items-center justify-center text-center">
                {data.total_sks_lulus >= 144 ? (
                  <span className="text-brand-700 dark:text-brand-400 font-bold text-lg">Anda sudah memenuhi syarat SKS!</span>
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

      </div>
      <Chatbot />
    </Layout>
  );
}
