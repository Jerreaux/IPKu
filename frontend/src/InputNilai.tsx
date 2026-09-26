import { useState, useEffect } from 'react';
import { Plus, FloppyDisk, Trash, Calculator, CaretDown, CaretUp, ListChecks } from '@phosphor-icons/react';
import { motion, AnimatePresence } from 'motion/react';
import Layout from './Layout';

const GRADE_MAPPING = {
  "A": 4.0, "AB": 3.5, "B": 3.0, "BC": 2.5,
  "C": 2.0, "D": 1.0, "E": 0.0, "BL": 0.0
};

interface Course {
  id: string;
  name: string;
  sks: number;
  grade: string;
  kelompok_mk: string;
}

export default function InputNilai() {
  const userId = localStorage.getItem('ipku_user_id');
  const [activeTab, setActiveTab] = useState<'input' | 'riwayat'>('input');

  // State for Input
  const [namaSemester, setNamaSemester] = useState('');
  const [courses, setCourses] = useState<Course[]>([
    { id: crypto.randomUUID(), name: '', sks: 3, grade: 'A', kelompok_mk: 'reguler' }
  ]);
  const [isSaving, setIsSaving] = useState(false);

  // State for History
  const [historyData, setHistoryData] = useState<any[]>([]);
  const [expandedSemester, setExpandedSemester] = useState<string | null>(null);

  useEffect(() => {
    if (activeTab === 'riwayat') {
      fetchHistory();
    }
  }, [activeTab]);

  const fetchHistory = async () => {
    if (!userId) return;
    try {
      const res = await fetch(`http://${window.location.hostname}:3001/api/history/${userId}`);
      if (res.ok) {
        const data = await res.json();
        setHistoryData(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const addCourse = () => {
    setCourses([...courses, { id: crypto.randomUUID(), name: '', sks: 3, grade: 'A', kelompok_mk: 'reguler' }]);
  };

  const removeCourse = (id: string) => {
    if (courses.length > 1) {
      setCourses(courses.filter(c => c.id !== id));
    }
  };

  const updateCourse = (id: string, field: keyof Course, value: string | number) => {
    setCourses(courses.map(c => c.id === id ? { ...c, [field]: value } : c));
  };

  const handleSave = async () => {
    if (!namaSemester) return alert("Pilih semester terlebih dahulu!");
    setIsSaving(true);
    try {
      const payload = courses.map(c => ({
        nama_mk: c.name,
        sks: Number(c.sks),
        huruf_mutu: c.grade,
        kelompok_mk: c.kelompok_mk
      }));

      const res = await fetch(`http://${window.location.hostname}:3001/api/history/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, nama_semester: namaSemester, courses: payload })
      });
      if (res.ok) {
        alert("Riwayat berhasil disimpan!");
        setNamaSemester('');
        setCourses([{ id: crypto.randomUUID(), name: '', sks: 3, grade: 'A', kelompok_mk: 'reguler' }]);
        setActiveTab('riwayat'); // Auto switch to history tab
      } else {
        alert("Gagal menyimpan");
      }
    } catch (e) {
      alert("Gagal menghubungi server backend.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Layout>
      <div className="w-full max-w-5xl flex flex-col gap-8">

        <header className="border-b border-zinc-200 dark:border-zinc-800 pb-6">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-950 dark:text-white">Riwayat Nilai</h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-2 max-w-[60ch]">
            Tambahkan nilai mata kuliah baru atau lihat rekam jejak akademik Anda secara keseluruhan.
          </p>
        </header>

        {/* Tabs */}
        <div className="flex items-center gap-4 border-b border-zinc-200 dark:border-zinc-800">
          <button
            onClick={() => setActiveTab('input')}
            className={`pb-3 text-sm font-semibold tracking-wide uppercase transition-colors relative ${activeTab === 'input' ? 'text-brand-600' : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300'}`}
          >
            Input Semester Baru
            {activeTab === 'input' && (
              <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-600" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('riwayat')}
            className={`pb-3 text-sm font-semibold tracking-wide uppercase transition-colors relative ${activeTab === 'riwayat' ? 'text-brand-600' : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300'}`}
          >
            Riwayat Tersimpan
            {activeTab === 'riwayat' && (
              <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-600" />
            )}
          </button>
        </div>

        {activeTab === 'input' && (
          <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 md:p-8 rounded-sm shadow-sm flex flex-col gap-8">

            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold uppercase tracking-widest text-zinc-500">Pilih Semester</label>
              <select
                value={namaSemester}
                onChange={e => setNamaSemester(e.target.value)}
                className="w-full md:w-1/2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-sm px-4 py-3 outline-none focus:border-brand-500 transition-colors"
              >
                <option value="">-- Pilih --</option>
                <option value="Semester 1">Semester 1</option>
                <option value="Semester 2">Semester 2</option>
                <option value="Semester 3">Semester 3</option>
                <option value="Semester 4">Semester 4</option>
                <option value="Semester 5">Semester 5</option>
                <option value="Semester 6">Semester 6</option>
                <option value="Semester 7">Semester 7</option>
                <option value="Semester 8">Semester 8</option>
                <option value="Semester Pendek">Semester Pendek</option>
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <div className="hidden md:grid grid-cols-[1fr_80px_100px_100px_50px] gap-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider px-2 border-b border-zinc-200 dark:border-zinc-800 pb-3">
                <div>Mata Kuliah</div>
                <div>SKS</div>
                <div>Tipe MK</div>
                <div>Huruf Mutu</div>
                <div></div>
              </div>

              <div className="flex flex-col gap-3 mt-3">
                {courses.map((course) => (
                  <motion.div
                    key={course.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="grid grid-cols-1 md:grid-cols-[1fr_80px_100px_100px_50px] gap-3 md:gap-4 items-center bg-zinc-50 dark:bg-zinc-950 p-4 md:p-0 rounded-sm md:bg-transparent"
                  >
                    <input
                      type="text"
                      placeholder="Nama Mata Kuliah"
                      value={course.name}
                      onChange={(e) => updateCourse(course.id, 'name', e.target.value)}
                      className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-sm px-3 py-2.5 text-sm focus:outline-none focus:border-brand-500"
                    />

                    <input
                      type="number" min="1" max="6"
                      value={course.sks}
                      onChange={(e) => updateCourse(course.id, 'sks', e.target.value)}
                      className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-sm px-3 py-2.5 text-sm focus:outline-none focus:border-brand-500"
                    />

                    <select
                      value={course.kelompok_mk}
                      onChange={(e) => updateCourse(course.id, 'kelompok_mk', e.target.value)}
                      className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-sm px-3 py-2.5 text-sm focus:outline-none focus:border-brand-500"
                    >
                      <option value="reguler">Reguler</option>
                      <option value="CCC">CCC</option>
                      <option value="EC">EC</option>
                    </select>

                    <select
                      value={course.grade}
                      onChange={(e) => updateCourse(course.id, 'grade', e.target.value)}
                      className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-sm px-3 py-2.5 text-sm focus:outline-none focus:border-brand-500 font-medium"
                    >
                      {Object.keys(GRADE_MAPPING).map(g => (
                        <option key={g} value={g}>{g}</option>
                      ))}
                    </select>

                    <button
                      onClick={() => removeCourse(course.id)}
                      disabled={courses.length === 1}
                      className="w-full md:w-auto p-2.5 flex items-center justify-center text-zinc-400 hover:text-red-500 rounded-sm disabled:opacity-50 border border-transparent md:border-zinc-200 md:dark:border-zinc-800 md:hover:border-red-500 transition-colors bg-white dark:bg-zinc-900"
                    >
                      <Trash weight="bold" />
                    </button>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-between gap-4 mt-4 border-t border-zinc-200 dark:border-zinc-800 pt-6">
              <button
                onClick={addCourse}
                className="w-full md:w-auto flex items-center justify-center gap-2 px-5 py-2.5 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-sm font-medium rounded-sm transition-colors"
              >
                <Plus weight="bold" /> Tambah Mata Kuliah
              </button>

              <button
                onClick={handleSave}
                disabled={isSaving}
                className="w-full md:w-auto flex items-center justify-center gap-2 px-8 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-sm font-medium text-sm transition-colors disabled:opacity-70"
              >
                {isSaving ? <Calculator className="animate-spin" /> : <FloppyDisk weight="fill" />}
                Simpan Riwayat
              </button>
            </div>

          </div>
        )}

        {activeTab === 'riwayat' && (
          <div className="flex flex-col gap-4">
            {historyData.length === 0 ? (
              <div className="p-12 text-center border border-zinc-200 dark:border-zinc-800 border-dashed text-zinc-500 bg-zinc-50 dark:bg-zinc-900/50 rounded-sm">
                <ListChecks size={48} className="mx-auto mb-4 opacity-50" />
                <p>Belum ada riwayat nilai yang disimpan.</p>
              </div>
            ) : (
              historyData.map((sem) => {
                const isExpanded = expandedSemester === sem.id;
                const totalSks = sem.courses.reduce((acc: number, c: any) => acc + c.sks, 0);

                let totalMutu = 0;
                sem.courses.forEach((c: any) => {
                  if (c.huruf_mutu !== 'BL') {
                    totalMutu += c.sks * (GRADE_MAPPING[c.huruf_mutu as keyof typeof GRADE_MAPPING] || 0);
                  }
                });
                const ips = totalSks > 0 ? (totalMutu / totalSks).toFixed(2) : '0.00';

                return (
                  <div key={sem.id} className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-sm overflow-hidden shadow-sm">
                    <button
                      onClick={() => setExpandedSemester(isExpanded ? null : sem.id)}
                      className="w-full flex items-center justify-between p-5 md:p-6 bg-zinc-50 dark:bg-zinc-950 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors focus:outline-none"
                    >
                      <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-6 text-left">
                        <span className="font-bold text-zinc-900 dark:text-white text-lg">{sem.nama_semester}</span>
                        <div className="flex items-center gap-4 text-sm text-zinc-500 dark:text-zinc-400">
                          <span>{totalSks} SKS</span>
                          <span className="w-1 h-1 rounded-full bg-zinc-300 dark:bg-zinc-700"></span>
                          <span className="font-semibold text-brand-600 dark:text-brand-400">IPS: {ips}</span>
                        </div>
                      </div>
                      <div className="text-zinc-400">
                        {isExpanded ? <CaretUp size={20} /> : <CaretDown size={20} />}
                      </div>
                    </button>

                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="border-t border-zinc-200 dark:border-zinc-800"
                        >
                          <div className="p-5 md:p-6 bg-white dark:bg-zinc-900 overflow-x-auto">
                            <table className="w-full text-left text-sm whitespace-nowrap">
                              <thead className="text-xs uppercase tracking-wider text-zinc-500 border-b border-zinc-200 dark:border-zinc-800">
                                <tr>
                                  <th className="pb-3 px-4 font-semibold">Mata Kuliah</th>
                                  <th className="pb-3 px-4 font-semibold">SKS</th>
                                  <th className="pb-3 px-4 font-semibold">Tipe</th>
                                  <th className="pb-3 px-4 font-semibold text-right">Nilai</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/50">
                                {sem.courses.map((c: any) => (
                                  <tr key={c.id}>
                                    <td className="py-3 px-4 text-zinc-900 dark:text-white font-medium">{c.nama_mk || '(Tanpa Nama)'}</td>
                                    <td className="py-3 px-4 text-zinc-600 dark:text-zinc-400">{c.sks}</td>
                                    <td className="py-3 px-4 text-zinc-600 dark:text-zinc-400 capitalize">{c.kelompok_mk}</td>
                                    <td className="py-3 px-4 text-right font-bold text-zinc-900 dark:text-white">{c.huruf_mutu}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })
            )}
          </div>
        )}

      </div>
    </Layout>
  );
}
