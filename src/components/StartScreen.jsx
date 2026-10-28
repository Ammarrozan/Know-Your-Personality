// StartScreen.jsx - layar judul, tombol "Mulai", dan instruksi kontrol. Domain Dev 2.

export default function StartScreen({ onStart }) {
  return (
    <main className="app">
      <section className="panel start">
        <h1 className="start__title">Know Your Personality?</h1>
        <p className="start__lead">
          Jalani satu hari di kampus. Kamu punya 9 Action Points, dan setiap situasi yang kamu
          selesaikan memakai 1 poin. Pilihanmu di tiap situasi menunjukkan kecenderungan
          sosialmu.
        </p>

        <h2 className="start__heading">Kontrol</h2>
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
            <span>Berjalan di peta kampus</span>
          </li>
          <li>
            <span className="keys">
              <kbd>Spasi</kbd>
            </span>
            <span>Berinteraksi saat berada di zona bertanda &quot;!&quot;</span>
          </li>
          <li>
            <span className="keys">
              <kbd>Klik</kbd>
            </span>
            <span>Memilih jawaban pada dialog</span>
          </li>
        </ul>

        <div className="start__actions">
          <button type="button" className="btn" onClick={onStart}>
            Mulai
          </button>
        </div>

        <p className="start__note">
          Game ini adalah refleksi diri yang ringan, bukan tes psikologi dan tidak untuk
          diagnosis.
        </p>
      </section>
    </main>
  );
}
