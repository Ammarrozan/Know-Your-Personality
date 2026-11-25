// StartScreen.jsx - Home Screen bergaya game: Main, Cara Bermain, Panduan Guru, Pengaturan, Tentang. Domain Dev 2.
import { DEVELOPERS, INSTITUTION } from '../data/learning.js';

export default function StartScreen({ onPlay, onTutorial, onGuide, onSettings, onAbout }) {
  return (
    <main className="app menu-screen">
      <section className="home">
        <p className="home__eyebrow">Game edukasi untuk siswa SMA/SMK</p>

        <h1 className="home__title" aria-label="Know Your Personality?">
          <span className="title__small" data-text="Know Your" aria-hidden="true">
            Know Your
          </span>
          <span className="title__big" data-text="Personality?" aria-hidden="true">
            Personality?
          </span>
        </h1>

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
          <button type="button" className="menu__item" onClick={onGuide}>
            Panduan Guru
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

        <footer className="home__credit">
          Dikembangkan oleh {DEVELOPERS.join(' & ')}
          <br />
          {INSTITUTION}
        </footer>
      </section>
    </main>
  );
}
