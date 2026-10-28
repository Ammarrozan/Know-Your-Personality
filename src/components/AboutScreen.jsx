// AboutScreen.jsx - tentang game dan kredit audio. Domain Dev 2.
import { AUDIO_CREDIT } from '../audio/AudioManager.js';

export default function AboutScreen({ onBack }) {
  return (
    <main className="app menu-screen">
      <section className="panel page" aria-labelledby="about-title">
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

        <h2 className="page__heading">Kredit audio</h2>
        <p className="muted">{AUDIO_CREDIT}</p>

        <div className="panel__actions">
          <button type="button" className="btn" onClick={onBack}>
            Kembali
          </button>
        </div>
      </section>
    </main>
  );
}
