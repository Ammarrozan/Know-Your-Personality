// HUD.jsx - indikator sisa Action Points (AP), tombol suara, dan tombol keluar di area game. Domain Dev 2.
// Harus diletakkan di dalam kontainer position: relative (.stage di App.jsx).

import SoundIcon from './SoundIcon.jsx';

// Tombol HUD memakai tabIndex -1 + mousedown dicegah: tombol tidak menyimpan fokus, sehingga
// Spasi (tombol interaksi game) tidak ikut "mengklik" tombol ini.
const keepFocusOnGame = (e) => e.preventDefault();

export default function HUD({ ap, total = 9, muted = false, onToggleMute, onExit }) {
  return (
    <>
      <div className="hud-tools">
        <button
          type="button"
          className="hud-btn hud-btn--icon"
          tabIndex={-1}
          aria-label={muted ? 'Nyalakan suara' : 'Bisukan suara'}
          aria-pressed={muted}
          onMouseDown={keepFocusOnGame}
          onClick={onToggleMute}
        >
          <SoundIcon muted={muted} />
        </button>
        <button
          type="button"
          className="hud-btn"
          tabIndex={-1}
          aria-label="Keluar ke Home (Esc)"
          onMouseDown={keepFocusOnGame}
          onClick={onExit}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path
              d="M14 4h4a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-4M9 8l-4 4 4 4M5 12h11"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span>Keluar</span>
        </button>
      </div>

      <div className="hud" role="status" aria-label={`Sisa Action Points: ${ap} dari ${total}`}>
        <span className="hud__label">AP</span>
        <span className="hud__value">
          {ap}/{total}
        </span>
        <span className="hud__dots" aria-hidden="true">
          {Array.from({ length: total }, (_, i) => (
            <span key={i} className={i < ap ? 'hud__dot hud__dot--on' : 'hud__dot'} />
          ))}
        </span>
      </div>
    </>
  );
}
