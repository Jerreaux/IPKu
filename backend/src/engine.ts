export function calculateIP(courses: { sks: number; grade_points: number }[]): number {
  if (courses.length === 0) return 0;
  
  let totalSks = 0;
  let totalMutu = 0;

  for (const c of courses) {
    totalSks += c.sks;
    totalMutu += c.sks * c.grade_points;
  }

  if (totalSks === 0) return 0;
  // Format to 2 decimal places exactly as IPB does
  return Math.round((totalMutu / totalSks) * 100) / 100;
}

export function determinePredicate(ipk: number, rules: any): string | null {
  for (const [predicate, cond] of Object.entries<any>(rules)) {
    if (ipk >= cond.min && ipk <= cond.max) {
      return predicate;
    }
  }
  return null;
}

export function calculateProgresKelulusan(courses: { sks: number; huruf_mutu: string }[]): { totalSksLulus: number; hasE: boolean } {
  let totalSksLulus = 0;
  let hasE = false;

  for (const c of courses) {
    if (c.huruf_mutu === 'E') {
      hasE = true;
    } else if (c.huruf_mutu !== 'BL') {
      totalSksLulus += c.sks;
    }
  }

  return { totalSksLulus, hasE };
}

// Menghitung batas maksimal semester untuk mengulang nilai E (4 semester setelahnya)
export function getBatasWaktuMengulang(semesterAwal: string): string {
  // Parsing sederhana untuk prototipe:
  // Asumsi format "Genap 2024" atau "Ganjil 2024"
  const parts = semesterAwal.split(' ');
  if (parts.length !== 2) return "4 semester lagi";

  const [tipe, tahunStr] = parts;
  let tahun = parseInt(tahunStr, 10);
  let nextTipe = tipe;

  // 4 semester = +2 tahun (Ganjil -> Ganjil, Genap -> Genap)
  tahun += 2;
  return `${tipe} ${tahun}`;
}

export function calculatePredictiveImpact(currentSks: number, currentMutu: number, plannedCourses: { nama_mk: string, sks: number }[]) {
  // A (4.0) vs C (2.0)
  const AM_BEST = 4.0;
  const AM_WORST = 2.0;

  const results = plannedCourses.map(mk => {
    // Potensi IPK jika A
    const ipkBest = (currentMutu + (mk.sks * AM_BEST)) / (currentSks + mk.sks);
    // Potensi IPK jika C
    const ipkWorst = (currentMutu + (mk.sks * AM_WORST)) / (currentSks + mk.sks);
    
    // Impact = IPK Best - IPK Worst
    const impact = ipkBest - ipkWorst;

    return {
      nama_mk: mk.nama_mk,
      sks: mk.sks,
      impact: Math.round(impact * 1000) / 1000, // 3 decimal places for precision
      ipkBest: Math.round(ipkBest * 100) / 100,
      ipkWorst: Math.round(ipkWorst * 100) / 100
    };
  });

  // Sort descending by impact
  return results.sort((a, b) => b.impact - a.impact);
}

export function calculateRetrospectiveImpact(pastCourses: { id: string, nama_mk: string, sks: number, huruf_mutu: string, grade_points: number }[], currentSks: number, currentMutu: number) {
  const AM_BEST = 4.0; // Asumsi jika diulang dapat A
  
  // Filter only C, D, E
  const targetCourses = pastCourses.filter(c => ['C', 'D', 'E'].includes(c.huruf_mutu));

  const results = targetCourses.map(mk => {
    // Rumus: Delta mutu = Mutu baru - Mutu lama
    // SKS total tidak berubah (karena mengulang, bukan ambil baru).
    const deltaMutu = (AM_BEST - mk.grade_points) * mk.sks;
    const newIpk = (currentMutu + deltaMutu) / currentSks;
    const oldIpk = currentMutu / currentSks;
    
    const impact = newIpk - oldIpk;

    return {
      id: mk.id,
      nama_mk: mk.nama_mk,
      sks: mk.sks,
      huruf_mutu: mk.huruf_mutu,
      impact: Math.round(impact * 1000) / 1000,
      newIpk: Math.round(newIpk * 100) / 100
    };
  });

  return results.sort((a, b) => b.impact - a.impact);
}
