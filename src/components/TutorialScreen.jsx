// TutorialScreen.jsx - cara bermain: tujuan, langkah, dan kontrol. Domain Dev 2.

export default function TutorialScreen({ totalAp = 9, onBack, onPlay }) {
  return (
    <main className="app menu-screen">
      <section className="panel page page--wide" aria-labelledby="tutorial-title">
        <h1 className="page__title" id="tutorial-title">
          Cara Bermain
        </h1>

        <div className="tutorial">
          <div className="tutorial__col">
            <h2 className="page__heading">Langkah</h2>
            <ol className="steps">
              <li>
                Jelajahi sekolah. Ada 20 titik interaksi: objek, ruangan, serta teman, kakak kelas,
                dan guru yang berjalan di halaman.
              </li>
              <li>
                Dekati titik bertanda &quot;!&quot; lalu tekan <kbd>Spasi</kbd> untuk memulai sebuah
                situasi.
              </li>
              <li>
                Masuk gedung lewat pintunya. Kantin, Perpustakaan, Ruang Kelas, dan Lab Komputer
                masing-masing punya 3 titik.
              </li>
              <li>
                Pilih satu jawaban. Tiap situasi memakai 1 AP, dan kamu punya {totalAp} AP, jadi
                hanya {totalAp} dari 20 situasi yang bisa kamu jawab. Pilih yang paling menarik
                bagimu.
              </li>
              <li>Setelah AP habis, kamu akan melihat hasilnya.</li>
            </ol>
          </div>

          <div className="tutorial__col">
            <h2 className="page__heading">Tujuan</h2>
            <p className="muted">
              Jalani satu hari di sekolah. Di setiap tempat dan percakapan, kamu memilih apa yang
              akan kamu lakukan, dan pilihanmu menunjukkan kecenderungan sosialmu: Introvert,
              Ekstrovert, atau Ambivert.
            </p>

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
                <span>Berinteraksi dengan titik bertanda &quot;!&quot;</span>
              </li>
              <li>
                <span className="keys">
                  <kbd>Klik</kbd>
                  <span className="keys__or">atau</span>
                  <kbd>1</kbd>
                  <kbd>2</kbd>
                  <kbd>3</kbd>
                </span>
                <span>Memilih jawaban</span>
              </li>
            </ul>
          </div>
        </div>

        <p className="page__note">
          Tidak ada jawaban yang lebih baik dari yang lain. Jawablah sesuai dirimu.
        </p>

        <div className="panel__actions panel__actions--end">
          <button type="button" className="btn btn--ghost" onClick={onBack}>
            Kembali
          </button>
          <button type="button" className="btn" onClick={onPlay}>
            Main
          </button>
        </div>
      </section>
    </main>
  );
}
