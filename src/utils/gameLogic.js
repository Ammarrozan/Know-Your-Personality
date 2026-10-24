// gameLogic.js - fungsi murni: pemilihan skenario, pengacakan, dan penentuan hasil. Domain Dev 2.
// `rng` bisa diganti (default Math.random) agar mudah diuji.

// Fisher-Yates. Mengembalikan array baru, array asli tidak diubah.
export function shuffle(array, rng = Math.random) {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

// Memilih `count` skenario berbeda secara acak dari `all` (REQ-F11).
export function pickScenarios(all, count = 9, rng = Math.random) {
  return shuffle(all, rng).slice(0, count);
}

// Aturan hasil SRS REQ-F09: Introvert jika I > E dan I > A; Ekstrovert jika E > I dan E > A;
// selain itu (A tertinggi, atau ada seri di skor tertinggi termasuk I = E) Ambivert.
export function getResult(score) {
  const { I, E, A } = score;
  if (I > E && I > A) return 'Introvert';
  if (E > I && E > A) return 'Ekstrovert';
  return 'Ambivert';
}

// Kalimat penjelas untuk hasil Ambivert: A tertinggi sendiri, atau skor tertinggi seri.
// Mengembalikan '' bila tidak berlaku (hasil bukan Ambivert).
export function getAmbivertReason(score) {
  const names = { I: 'Introvert', E: 'Ekstrovert', A: 'Ambivert' };
  const top = Math.max(score.I, score.E, score.A);
  const tied = ['I', 'E', 'A'].filter((key) => score[key] === top);
  if (tied.length === 1) {
    return tied[0] === 'A' ? 'Hasil ini muncul karena jawaban bertipe Ambivert paling banyak kamu pilih.' : '';
  }
  const list = tied.length === 2 ? tied.map((k) => names[k]).join(' dan ') : 'Introvert, Ekstrovert, dan Ambivert';
  return `Hasil ini muncul karena skor tertinggimu seri antara ${list}, jadi kecenderunganmu tidak condong ke satu tipe saja.`;
}
