import { useState, useEffect } from 'react';
import { Target, Lightbulb, WarningCircle, CaretRight, Plus, Trash } from '@phosphor-icons/react';
import Layout from './Layout';

export default function Simulation() {
  const [activeTab, setActiveTab] = useState<'predictive' | 'retrospective'>('predictive');
  const userId = localStorage.getItem('ipku_user_id');

  // Predictive state
  const [plannedCourses, setPlannedCourses] = useState<{nama_mk: string, sks: number}[]>([]);
  const [predictiveResult, setPredictiveResult] = useState<any>(null);
  const [isPredicting, setIsPredicting] = useState(false);

  // Retrospective state
  const [retroResult, setRetroResult] = useState<any>(null);
  const [isLoadingRetro, setIsLoadingRetro] = useState(false);

  // Fetch Retrospective on tab switch
  useEffect(() => {
    if (activeTab === 'retrospective' && !retroResult) {
      setIsLoadingRetro(true);
      fetch(`http://localhost:3001/api/simulation/retrospective/${userId}`)
        .then(res => res.json())
        .then(d => {
          setRetroResult(d);
          setIsLoadingRetro(false);
        })
        .catch(() => setIsLoadingRetro(false));
    }
  }, [activeTab, userId, retroResult]);

  const addPlannedCourse = () => {
    setPlannedCourses([...plannedCourses, { nama_mk: '', sks: 3 }]);
  };

  const updatePlannedCourse = (index: number, field: string, value: string | number) => {
    const newCourses = [...plannedCourses];
    newCourses[index] = { ...newCourses[index], [field]: value };
    setPlannedCourses(newCourses);
  };

  const removePlannedCourse = (index: number) => {
    const newCourses = [...plannedCourses];
    newCourses.splice(index, 1);
    setPlannedCourses(newCourses);
  };

  const handlePredict = async () => {
    const validCourses = plannedCourses.filter(c => c.nama_mk.trim() !== '' && c.sks > 0);
    if (validCourses.length === 0) return alert("Tambahkan minimal 1 mata kuliah valid.");
    
    setIsPredicting(true);
    try {
      const res = await fetch(`http://localhost:3001/api/simulation/predictive/${userId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plannedCourses: validCourses })
      });
      const data = await res.json();
      setPredictiveResult(data);
    } catch (e) {
      alert("Gagal melakukan simulasi");
    } finally {
      setIsPredicting(false);
    }
  };

  return (
    <Layout>
      <div className="w-full max-w-5xl flex flex-col gap-8">
        
        <header className="border-b border-zinc-200 dark:border-zinc-800 pb-6">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-950 dark:text-white flex items-center gap-3">
            <Target className="text-brand-600" /> Simulasi & Strategi
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-2 max-w-[70ch]">
            Analisis dampak mata kuliah terhadap IPK. Gunakan kalkulasi metrik beban berbasis algoritma untuk mengambil keputusan pengambilan/pengulangan mata kuliah.
          </p>
        </header>

        <div className="flex bg-zinc-200/50 dark:bg-zinc-900/50 p-1 rounded-sm border border-zinc-200 dark:border-zinc-800 self-start">
          <button 
            onClick={() => setActiveTab('predictive')}
            className={`px-6 py-2 text-sm font-semibold uppercase tracking-wider rounded-sm transition-all ${activeTab === 'predictive' ? 'bg-white dark:bg-zinc-800 text-brand-600 shadow-sm' : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'}`}
          >
            Rencana Semester Depan
          </button>
          <button 
            onClick={() => setActiveTab('retrospective')}
            className={`px-6 py-2 text-sm font-semibold uppercase tracking-wider rounded-sm transition-all ${activeTab === 'retrospective' ? 'bg-white dark:bg-zinc-800 text-brand-600 shadow-sm' : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'}`}
          >
            Refleksi & Cost-Benefit
          </button>
        </div>

        {activeTab === 'predictive' && (
          <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-sm p-6 flex flex-col gap-4">
              <div className="flex items-center gap-2 text-zinc-900 dark:text-white font-bold pb-4 border-b border-zinc-200 dark:border-zinc-800">
                <Lightbulb size={20} className="text-amber-500" />
                Daftar Rencana Mata Kuliah
              </div>
              
              <div className="flex flex-col gap-3">
                {plannedCourses.map((c, i) => (
                  <div key={i} className="flex gap-4 items-center">
                    <input 
                      type="text" 
                      placeholder="Nama Mata Kuliah"
                      value={c.nama_mk}
                      onChange={e => updatePlannedCourse(i, 'nama_mk', e.target.value)}
                      className="flex-1 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-sm px-4 py-2 outline-none focus:border-brand-500"
                    />
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-zinc-500">SKS</span>
                      <input 
                        type="number" 
                        min="1" max="6"
                        value={c.sks}
                        onChange={e => updatePlannedCourse(i, 'sks', parseInt(e.target.value) || 0)}
                        className="w-16 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-sm px-2 py-2 outline-none text-center focus:border-brand-500"
                      />
                    </div>
                    <button onClick={() => removePlannedCourse(i)} className="text-zinc-400 hover:text-red-500 p-2">
                      <Trash size={20} />
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-4 pt-2">
                <button 
                  onClick={addPlannedCourse}
                  className="flex items-center gap-2 text-sm font-semibold text-zinc-600 hover:text-brand-600 dark:text-zinc-400 dark:hover:text-brand-400 px-4 py-2 bg-zinc-100 dark:bg-zinc-800 rounded-sm"
                >
                  <Plus weight="bold" /> Tambah Mata Kuliah
                </button>
                <button 
                  onClick={handlePredict}
                  disabled={isPredicting || plannedCourses.length === 0}
                  className="ml-auto bg-brand-600 hover:bg-brand-700 text-white font-medium px-6 py-2 rounded-sm disabled:opacity-50"
                >
                  {isPredicting ? 'Menganalisis...' : 'Analisis Dampak'}
                </button>
              </div>
            </div>

            {predictiveResult && (
              <div className="flex flex-col gap-4 mt-4">
                <h2 className="text-xl font-bold text-zinc-950 dark:text-white">Hasil Analisis Sensitivitas IPK</h2>
                <p className="text-sm text-zinc-500 mb-2">Peringkat mata kuliah berdasarkan bobot pengaruh potensial (Spread antara Mutu A vs C) relatif terhadap posisi Anda sekarang ({predictiveResult.currentSks} SKS, IPK {predictiveResult.currentIpk.toFixed(2)}).</p>
                
                <div className="grid grid-cols-1 gap-3">
                  {predictiveResult.impact.map((res: any, i: number) => (
                    <div key={i} className={`p-4 border rounded-sm flex items-center justify-between ${res.impact > 0.1 ? 'border-amber-500/50 bg-amber-50/50 dark:bg-amber-950/20' : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900'}`}>
                      <div className="flex flex-col">
                        <span className="font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                          {res.impact > 0.1 && <WarningCircle weight="fill" className="text-amber-500" />}
                          {res.nama_mk} <span className="text-xs font-normal text-zinc-500 px-2 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded-sm">{res.sks} SKS</span>
                        </span>
                        <span className="text-xs text-zinc-500 mt-1">Skenario A: IPK menjadi <strong className="text-green-600">{res.ipkBest.toFixed(2)}</strong> | Skenario C: IPK turun ke <strong className="text-red-600">{res.ipkWorst.toFixed(2)}</strong></span>
                      </div>
                      <div className="text-right">
                        <div className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-1">Dampak (Spread)</div>
                        <div className={`text-xl font-bold tracking-tighter ${res.impact > 0.1 ? 'text-amber-600 dark:text-amber-500' : 'text-brand-600 dark:text-brand-400'}`}>± {res.impact.toFixed(3)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'retrospective' && (
          <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {isLoadingRetro ? (
              <div className="p-12 text-center text-zinc-500">Mengkalkulasi Cost-Benefit...</div>
            ) : retroResult?.impact?.length > 0 ? (
              <>
                <p className="text-zinc-600 dark:text-zinc-400">
                  Berikut adalah daftar mata kuliah dengan nilai C/D/E dari masa lalu Anda. Tabel ini mengurutkan mata kuliah mana yang paling menguntungkan (mendongkrak IPK) jika Anda memutuskan untuk mengulangnya (dengan asumsi Anda mendapat nilai A).
                </p>
                
                <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-sm overflow-hidden">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-zinc-50 dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400">
                      <tr>
                        <th className="px-6 py-4 font-semibold uppercase tracking-wider text-xs">Mata Kuliah</th>
                        <th className="px-6 py-4 font-semibold uppercase tracking-wider text-xs">Nilai Saat Ini</th>
                        <th className="px-6 py-4 font-semibold uppercase tracking-wider text-xs">Potensi IPK (Jika A)</th>
                        <th className="px-6 py-4 font-semibold uppercase tracking-wider text-xs text-right">Kenaikan (Δ)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/50">
                      {retroResult.impact.map((res: any, i: number) => (
                        <tr key={i} className="hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors">
                          <td className="px-6 py-4 font-bold text-zinc-900 dark:text-white">
                            {res.nama_mk} <span className="ml-2 text-xs font-normal text-zinc-500 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded-sm">{res.sks} SKS</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`font-bold ${res.huruf_mutu === 'E' ? 'text-red-600' : res.huruf_mutu === 'D' ? 'text-amber-600' : 'text-zinc-600'}`}>
                              {res.huruf_mutu}
                            </span>
                          </td>
                          <td className="px-6 py-4 font-medium text-zinc-700 dark:text-zinc-300">
                            {retroResult.currentIpk.toFixed(2)} <CaretRight className="inline mx-1" /> <strong className="text-green-600">{res.newIpk.toFixed(2)}</strong>
                          </td>
                          <td className="px-6 py-4 text-right font-bold text-brand-600 dark:text-brand-400">
                            +{res.impact.toFixed(3)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            ) : (
              <div className="p-12 text-center border border-zinc-200 dark:border-zinc-800 border-dashed text-zinc-500 bg-zinc-50 dark:bg-zinc-900/50 rounded-sm">
                Tidak ada data mata kuliah bernilai C, D, atau E di riwayat Anda. Rekor akademik yang sangat baik!
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}
