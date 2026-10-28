// TutorialScreen.jsx - cara bermain: tujuan, langkah, dan kontrol. Domain Dev 2.

export default function TutorialScreen({ totalAp = 9, onBack, onPlay }) {
  return (
    <main className="app menu-screen">
      <section className="panel page" aria-labelledby="tutorial-title">
        <h1 className="page__title" id="tutorial-title">
          Cara Bermain
        </h1>

        <h2 className="page__heading">Tujuan</h2>
        <p className="muted">
          Kamu menjalani satu hari di sekolah. Di berbagai tempat dan percakapan, kamu memilih apa
          yang akan kamu lakukan. Pilihanmu menunjukkan kecenderungan sosialmu: Introvert,
          Ekstrovert, atau Ambivert.
        </p>

        <h2 className="page__heading">Langkah</h2>
        <ol className="steps">
          <li>
            Jelajahi sekolah. Ada 20 titik interaksi: objek, ruangan, serta teman, kakak kelas, dan
            guru yang berjalan di halaman.
          </li>
          <li>
            Dekati titik yang bertanda &quot;!&quot; lalu tekan <kbd>Spasi</kbd> untuk memulai
            sebuah situasi.
          </li>
          <li>
            Masuk gedung lewat pintunya. Kantin, Perpustakaan, Ruang Kelas, dan Lab Komputer
            masing-masing punya 3 titik interaksi.
          </li>
          <li>
            Pilih satu jawaban dengan klik. Tiap situasi yang kamu selesaikan memakai 1 AP. Kamu
            punya {totalAp} AP, jadi hanya bisa menjawab {totalAp} dari 20 situasi. Pilih yang
            paling menarik bagimu.
          </li>
          <li>Setelah AP habis, kamu akan melihat hasilnya.</li>
        </ol>

        <h2 className="page__heading">Kontrol</h2>
        <ul className="controls">
          <li>
            <span className="keys">
              <kbd>W</kbd>
              <kbd>A</kbd>
              <kbd>S</kbd>
              <kbd>D</kbd>
              <span className="keys__or">atau</span>
              <kbd>↑</kbd>
              <kbd>←</kbd>
              <kbd>↓</kbd>
              <kbd>→</kbd>
            </span>
            <span>Berjalan</span>
          </li>
          <li>
            <span className="keys">
              <kbd>Spasi</kbd>
            </span>
            <span>Berinteraksi dengan titik yang bertanda &quot;!&quot;</span>
          </li>
          <li>
            <span className="keys">
              <kbd>Klik</kbd>
            </span>
            <span>Memilih jawaban pada dialog</span>
          </li>
        </ul>

        <p className="page__note">
          Tidak ada jawaban yang lebih baik dari yang lain. Jawablah sesuai dirimu.
        </p>

        <div className="panel__actions">
          <button type="button" className="btn" onClick={onPlay}>
            Main
          </button>
          <button type="button" className="btn btn--ghost" onClick={onBack}>
            Kembali
          </button>
        </div>
      </section>
    </main>
  );
}
