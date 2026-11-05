// AboutScreen.jsx - tentang game dan kredit audio. Domain Dev 2.
import { AUDIO_CREDIT } from '../audio/AudioManager.js';

export default function AboutScreen({ onBack }) {
  return (
    <main className="app menu-screen">
      <section className="panel page page--narrow" aria-labelledby="about-title">
        <h1 className="page__title" id="about-title">
          Tentang
        </h1>

        <p>
          &quot;Know Your Personality?&quot; adalah game edukasi untuk membantu siswa SMA/SMK
          mengenali kecenderungan kepribadian sosial: Introvert, Ekstrovert, dan Ambivert.
        </p>

        <h2 className="page__heading">Penting diketahui</h2>
        <p className="muted">
          Hasil permainan adalah refleksi ringan dari pilihanmu di dalam game, bukan tes psikologi
          tervalidasi dan tidak untuk diagnosis. Tidak ada tipe yang lebih baik dari yang lain, dan
          kecenderungan seseorang bisa berubah menurut situasi dan waktu.
        </p>

        <h2 className="page__heading">Kredit</h2>
        <ul className="credits">
          <li>{AUDIO_CREDIT}</li>
          <li>
            Font judul Lilita One (Juan Montoreano) dan font teks Nunito (The Nunito Project
            Authors), berlisensi SIL Open Font License 1.1.
          </li>
          <li>Ilustrasi latar dibuat dengan bantuan AI generatif.</li>
        </ul>

        <div className="panel__actions panel__actions--end">
          <button type="button" className="btn" onClick={onBack}>
            Kembali
          </button>
        </div>
      </section>
    </main>
  );
}
