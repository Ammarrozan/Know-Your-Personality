// StartScreen.jsx - Home Screen bergaya game: Main, Cara Bermain, Pengaturan, Tentang. Domain Dev 2.

export default function StartScreen({ onPlay, onTutorial, onSettings, onAbout }) {
  return (
    <main className="app menu-screen">
      <section className="home">
        <p className="home__eyebrow">Game edukasi untuk siswa SMA/SMK</p>
        <h1 className="home__title">Know Your Personality?</h1>
        <p className="home__tagline">
          Jalani satu hari di sekolah dan temukan kecenderungan sosialmu.
        </p>

        <nav className="menu" aria-label="Menu utama">
          <button type="button" className="menu__item menu__item--primary" onClick={onPlay}>
            Main
          </button>
          <button type="button" className="menu__item" onClick={onTutorial}>
            Cara Bermain
          </button>
          <button type="button" className="menu__item" onClick={onSettings}>
            Pengaturan
          </button>
          <button type="button" className="menu__item" onClick={onAbout}>
            Tentang
          </button>
        </nav>

        <p className="home__note">
          Refleksi diri yang ringan, bukan tes psikologi dan tidak untuk diagnosis.
        </p>
      </section>
    </main>
  );
}
