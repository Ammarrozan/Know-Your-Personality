// AboutScreen.jsx - tentang game dan kredit audio. Domain Dev 2.
import { AUDIO_CREDIT } from '../audio/AudioManager.js';
import { DEVELOPERS, INSTITUTION } from '../data/learning.js';

export default function AboutScreen({ onBack }) {
  return (
    <main className="app menu-screen">
      <section className="panel page page--wide" aria-labelledby="about-title">
        <h1 className="page__title" id="about-title">
          Tentang
        </h1>

        <div className="tutorial">
          <div className="tutorial__col">
            <p>
              &quot;Know Your Personality?&quot; adalah game edukasi untuk membantu siswa SMA/SMK
              mengenali kecenderungan kepribadian sosial: Introvert, Ekstrovert, dan Ambivert.
            </p>

            <h2 className="page__heading">Penting diketahui</h2>
            <p className="muted">
              Hasil permainan adalah refleksi ringan dari pilihanmu di dalam game, bukan tes
              psikologi tervalidasi dan tidak untuk diagnosis. Tidak ada tipe yang lebih baik dari
              yang lain, dan kecenderungan seseorang bisa berubah menurut situasi dan waktu.
            </p>

            <h2 className="page__heading">Pengembang</h2>
            <p className="muted">
              {DEVELOPERS.join(' dan ')}
              <br />
              {INSTITUTION}
            </p>
          </div>

          <div className="tutorial__col">
            <h2 className="page__heading">Kredit</h2>
            <ul className="credits">
              {AUDIO_CREDIT.map((line) => (
                <li key={line}>{line}</li>
              ))}
              <li>
                Font judul Lilita One (Juan Montoreano) dan font teks Nunito (The Nunito Project
                Authors), berlisensi SIL Open Font License 1.1.
              </li>
              <li>Ilustrasi latar Home dibuat dengan bantuan AI generatif (Google Gemini).</li>
              <li>
                Peta sekolah, interior gedung, dan sprite karakter dibuat oleh tim pengembang dengan
                kode (Python + Pillow).
              </li>
            </ul>
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
