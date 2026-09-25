import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, Calculator, ChartLineUp, ShieldCheck, User, SignOut } from "@phosphor-icons/react";
import { Link } from "react-router-dom";
import { useState, useRef, useEffect } from "react";

export default function App() {
  const reduce = useReducedMotion();
  const isLoggedIn = !!localStorage.getItem('ipku_user_id');

  return (
    <div className="min-h-[100dvh] w-full flex flex-col items-center overflow-x-hidden selection:bg-brand-500/30 bg-zinc-50 dark:bg-zinc-950">
      <Navbar isLoggedIn={isLoggedIn} />

      <main className="w-full flex flex-col items-center">
        <HeroSection reduce={reduce} isLoggedIn={isLoggedIn} />
        <LogoWall />
        <FeatureBento reduce={reduce} />
        <CtaSection reduce={reduce} isLoggedIn={isLoggedIn} />
      </main>

      <Footer />
    </div>
  );
}

function Navbar({ isLoggedIn }: { isLoggedIn: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('ipku_user_id');
    window.location.reload(); // Hard refresh to update state
  };

  return (
    <nav className="w-full h-20 max-w-[1400px] px-6 md:px-12 mx-auto flex items-center justify-between z-50">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 flex items-center justify-center font-bold tracking-tight">
          IPB
        </div>
        <span className="font-semibold tracking-tight text-lg">IPKu</span>
      </div>

      <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors">
        <a href="#fitur">Fitur</a>
      </div>

      <div className="flex items-center gap-4">
        {isLoggedIn ? (
          <div className="flex items-center gap-3 relative" ref={dropdownRef}>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="w-10 h-10 rounded-full bg-brand-600 text-white flex items-center justify-center font-bold hover:opacity-90 transition-opacity focus:outline-none"
            >
              A
            </button>

            {isOpen && (
              <div className="absolute top-12 right-0 mt-2 w-56 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-2 z-50 shadow-xl">
                <div className="p-3">
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-1">Masuk sebagai</p>
                  <p className="font-semibold text-zinc-900 dark:text-white mb-2">Arjuna</p>
                  <span className="inline-block px-2 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-medium">
                    Mahasiswa
                  </span>
                </div>

                <div className="h-px bg-zinc-100 dark:bg-zinc-800 my-1 mx-2" />

                <Link to="/app" className="flex items-center gap-3 px-3 py-2 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors text-zinc-700 dark:text-zinc-300">
                  <User size={18} />
                  <span className="font-medium text-sm">Profil Saya</span>
                </Link>

                <div className="h-px bg-zinc-100 dark:bg-zinc-800 my-1 mx-2" />

                <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors text-red-500">
                  <SignOut size={18} />
                  <span className="font-medium text-sm">Keluar</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            <Link to="/login" className="text-sm font-semibold text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors">
              Masuk
            </Link>
            <Link to="/login" className="text-sm font-semibold bg-brand-600 text-white px-5 py-2.5 hover:bg-brand-700 transition-colors">
              Daftar
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

function HeroSection({ reduce, isLoggedIn }: { reduce: boolean | null, isLoggedIn: boolean }) {
  const targetRoute = isLoggedIn ? "/app" : "/login";

  return (
    <section className="w-full max-w-[1400px] mx-auto px-6 md:px-12 pt-20 md:pt-32 pb-16 flex flex-col items-center text-center">
      <motion.div
        className="flex flex-col items-center gap-8 max-w-4xl"
        initial={reduce ? false : { opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >

        <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] font-bold tracking-tighter leading-[1.05] text-zinc-950 dark:text-white">
          Navigasi target kelulusan Anda tanpa <span className="text-brand-600">tebakan.</span>
        </h1>

        <p className="text-zinc-500 dark:text-zinc-400 text-lg md:text-xl max-w-[50ch] leading-relaxed">
          Kalkulator akademik IPB yang dirancang ulang. Hitung proyeksi nilai, pahami aturan pengulangan, dan capai 144 SKS dengan presisi.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <Link to={targetRoute} className="flex items-center gap-2 bg-zinc-950 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-zinc-950 px-8 py-4 font-medium transition-colors">
            {isLoggedIn ? "Ke Dashboard" : "Mulai Pemantauan"}
            <ArrowRight weight="bold" />
          </Link>
          <a href="#fitur" className="flex items-center gap-2 bg-transparent hover:bg-zinc-100 dark:hover:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white px-8 py-4 font-medium transition-colors">
            Lihat Fitur
          </a>
        </div>
      </motion.div>


    </section>
  );
}

function LogoWall() {
  const logos = ["FAPERTA", "FKH", "FPIK", "FAPET", "FAHUTAN", "FATETA", "FMIPA", "FEM", "FEMA", "SB", "SSMI"];

  return (
    <section className="w-full border-y border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 py-16 overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex flex-col items-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-8">Dirancang untuk mahasiswa</p>
        <div className="flex flex-wrap justify-center gap-8 md:gap-12 max-w-5xl opacity-60">
          {logos.map((logo) => (
            <div key={logo} className="text-xl md:text-2xl font-bold tracking-tighter flex items-center gap-2 text-zinc-900 dark:text-white">
              <ShieldCheck weight="fill" className="text-brand-600/50" />
              {logo}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureBento({ reduce }: { reduce: boolean | null }) {
  return (
    <section id="fitur" className="w-full max-w-[1400px] mx-auto px-6 md:px-12 py-24 md:py-32 flex flex-col gap-12">
      <div className="flex flex-col gap-4">
        <h2 className="text-4xl md:text-5xl font-bold tracking-tighter leading-tight max-w-[20ch] text-zinc-950 dark:text-white">
          Satu instrumen untuk seluruh rencana studi Anda.
        </h2>
        <p className="text-zinc-500 text-lg max-w-[45ch]">
          Meninggalkan spreadsheet manual. IPKu mengotomatiskan riwayat nilai, mendeteksi hambatan kelulusan, dan menjaga Anda di jalur yang benar.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 grid-rows-[auto] md:grid-rows-2 gap-4">
        <motion.div
          className="md:col-span-2 md:row-span-2 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex flex-col relative overflow-hidden group"
          initial={reduce ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <img
            src="https://picsum.photos/seed/ipku-automation/800/800"
            alt="Feature background"
            className="absolute inset-0 w-full h-full object-cover grayscale opacity-20 group-hover:scale-105 group-hover:opacity-30 transition-all duration-700 mix-blend-overlay"
          />
          <div className="relative z-10 p-10 md:p-14 h-full flex flex-col">
            <div className="bg-brand-600 text-white p-3 w-fit mb-8 shadow-sm">
              <Calculator className="w-8 h-8" />
            </div>
            <h3 className="text-3xl font-bold mb-4 tracking-tighter text-zinc-900 dark:text-white">Otomatisasi Huruf Mutu</h3>
            <p className="text-zinc-600 dark:text-zinc-400 max-w-[35ch] text-lg">
              Sistem kami secara otomatis mendeteksi nilai E yang harus diulang dan menghitung bobot SKS riil untuk mengejar 144 SKS lulus tanpa salah hitung.
            </p>
          </div>
        </motion.div>

        <motion.div
          className="bg-brand-900 text-white border border-brand-800 p-10 flex flex-col justify-between"
          initial={reduce ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          <ChartLineUp className="w-8 h-8 text-brand-400 mb-8" />
          <div>
            <h3 className="text-2xl font-bold mb-3 tracking-tighter">Proyeksi Target</h3>
            <p className="text-brand-200/80">
              Lihat proyeksi kelulusan dan target IPK semester depan secara instan.
            </p>
          </div>
        </motion.div>

        <motion.div
          className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-10 flex flex-col justify-between"
          initial={reduce ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <div className="text-4xl font-bold tracking-tighter text-zinc-900 dark:text-white mb-8">Penyimpanan Terpadu.</div>
          <p className="text-zinc-500">
            Seluruh riwayat akademik tersimpan aman. Lintas perangkat, tanpa perlu unggah ulang KRS setiap semester.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

function CtaSection({ reduce, isLoggedIn }: { reduce: boolean | null, isLoggedIn: boolean }) {
  const targetRoute = isLoggedIn ? "/app" : "/login";

  return (
    <section className="w-full border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
      <motion.div
        className="w-full max-w-[1400px] mx-auto px-6 md:px-12 py-32 flex flex-col items-center text-center gap-8"
        initial={reduce ? false : { opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <h2 className="text-5xl md:text-6xl font-bold tracking-tighter text-zinc-900 dark:text-white">
          Siap memetakan studi Anda?
        </h2>

        <Link to={targetRoute} className="bg-brand-600 hover:bg-brand-700 text-white px-10 py-5 font-medium text-lg mt-4 transition-colors">
          {isLoggedIn ? "Buka Dashboard" : "Mulai Pemantauan Riwayat"}
        </Link>
      </motion.div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="w-full border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 py-12 text-zinc-500 text-sm flex flex-col gap-4 items-center px-6 text-center">
      <div className="font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 text-base">IPKu</div>
      <p>&copy; 2026. Alat simulasi akademik.</p>
      <p className="text-xs text-zinc-400 max-w-[60ch]">
        Sistem ini merupakan inisiatif independen. Hasil perhitungan bergantung pada input pengguna dan tetap tunduk pada Panduan Akademik Multistrata IPB University.
      </p>
    </footer>
  );
}
