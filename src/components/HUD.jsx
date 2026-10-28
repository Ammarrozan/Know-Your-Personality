// HUD.jsx - indikator sisa Action Points (AP) dan tombol suara di area game. Domain Dev 2.
// Harus diletakkan di dalam kontainer position: relative (.stage di App.jsx).

export default function HUD({ ap, total = 9, muted = false, onToggleMute }) {
  return (
    <>
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

      {/* tabIndex -1 + mousedown dicegah: tombol tidak menyimpan fokus, sehingga Spasi
          (tombol interaksi game) tidak ikut "mengklik" tombol ini. */}
      <button
        type="button"
        className="sound-toggle"
        tabIndex={-1}
        aria-label={muted ? 'Nyalakan suara' : 'Bisukan suara'}
        aria-pressed={muted}
        onMouseDown={(e) => e.preventDefault()}
        onClick={onToggleMute}
      >
        <span aria-hidden="true">{muted ? '🔇' : '🔊'}</span>
      </button>
    </>
  );
}
