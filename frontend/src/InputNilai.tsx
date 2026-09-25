import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, FloppyDisk, Trash, Calculator } from '@phosphor-icons/react';
import { motion } from 'motion/react';
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
  const navigate = useNavigate();
  const userId = localStorage.getItem('ipku_user_id');
  const [namaSemester, setNamaSemester] = useState('');
  const [courses, setCourses] = useState<Course[]>([
    { id: crypto.randomUUID(), name: '', sks: 3, grade: 'A', kelompok_mk: 'reguler' }
  ]);
  const [isSaving, setIsSaving] = useState(false);

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
      
      const res = await fetch('http://localhost:3001/api/history/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, nama_semester: namaSemester, courses: payload })
      });
      if (res.ok) {
        navigate('/app');
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
          <h1 className="text-3xl font-bold tracking-tight text-zinc-950 dark:text-white">Input Riwayat Semester</h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-2 max-w-[60ch]">
            Tambahkan nilai mata kuliah untuk satu semester secara lengkap untuk menghitung proyeksi akademik.
          </p>
        </header>

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
      </div>
    </Layout>
  );
}
