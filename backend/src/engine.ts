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
