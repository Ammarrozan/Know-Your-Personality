// HUD.jsx - indikator sisa Action Points (AP) di pojok area game. Domain Dev 2.
// Harus diletakkan di dalam kontainer position: relative (.stage di App.jsx).

export default function HUD({ ap, total = 9 }) {
  return (
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
  );
}
