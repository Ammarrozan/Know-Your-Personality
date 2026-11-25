// GuideScreen.jsx - panduan penggunaan media untuk guru. Domain Dev 2.
import { LEARNING_OBJECTIVES } from '../data/learning.js';

export default function GuideScreen({ totalAp = 9, onBack }) {
  return (
    <main className="app menu-screen">
      <section className="panel page page--wide" aria-labelledby="guide-title">
        <h1 className="page__title" id="guide-title">
          Panduan Guru
        </h1>

        <div className="tutorial">
          <div className="tutorial__col">
            <h2 className="page__heading">Tujuan pembelajaran</h2>
            <p className="muted">Setelah bermain dan berdiskusi, siswa dapat:</p>
            <ul className="list">
              {LEARNING_OBJECTIVES.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>

            <h2 className="page__heading">Persiapan</h2>
            <ul className="list">
              <li>
                Sasaran: siswa SMA/SMK, misalnya dalam layanan Bimbingan dan Konseling atau kegiatan
                pengenalan diri.
              </li>
              <li>
                Perangkat: laptop/PC dengan peramban Chrome, Edge, atau Firefox. HP/tablet juga bisa
                dipakai dengan analog dan tombol Aksi di layar.
              </li>
              <li>Perkiraan waktu: 15–20 menit bermain dan 15–20 menit diskusi.</li>
            </ul>
          </div>

          <div className="tutorial__col">
            <h2 className="page__heading">Langkah di kelas</h2>
            <ol className="steps">
              <li>Jelaskan bahwa game ini refleksi diri, bukan tes, dan tidak ada jawaban benar atau salah.</li>
              <li>Minta siswa membuka menu Cara Bermain, lalu bermain sampai {totalAp} AP habis.</li>
              <li>Siswa mencatat hasil dan satu situasi yang paling mewakili dirinya.</li>
              <li>Diskusikan dalam kelompok kecil: apa yang dirasakan, dan mitos mana yang pernah dipercaya.</li>
              <li>Tutup dengan refleksi: kecenderungan bisa berubah menurut situasi, dan setiap tipe punya kekuatan.</li>
            </ol>

            <h2 className="page__heading">Etika penggunaan</h2>
            <p className="muted">
              Hasil bersifat pribadi; siswa boleh tidak membagikannya. Hindari melabeli atau
              membandingkan siswa berdasarkan hasil, dan jangan memakainya sebagai dasar keputusan
              atau diagnosis.
            </p>
          </div>
        </div>

        <div className="panel__actions panel__actions--end">
          <button type="button" className="btn" onClick={onBack}>
            Kembali
          </button>
        </div>
      </section>
    </main>
  );
}
