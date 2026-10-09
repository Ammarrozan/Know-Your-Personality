// GameCanvas.jsx - pembungkus kanvas. Props: onTrigger, paused, activeZoneIds (SRS 3.3). Dev 1.
import { useEffect, useRef } from 'react';
import GameEngine from './GameEngine.js';

const W = 960, H = 640;

export default function GameCanvas({ onTrigger, paused = false, activeZoneIds = [] }) {
  const canvasRef = useRef(null);
  const engineRef = useRef(null);
  const triggerRef = useRef(onTrigger);
  triggerRef.current = onTrigger; // selalu memakai callback terbaru

  // buat engine sekali; cleanup menghentikan loop & listener (aman untuk StrictMode)
  useEffect(() => {
    const engine = new GameEngine(canvasRef.current, {
      onTrigger: (id) => triggerRef.current && triggerRef.current(id),
    });
    engineRef.current = engine;
    engine.start();
    return () => {
      engine.stop();
      engineRef.current = null;
    };
  }, []);

  useEffect(() => {
    engineRef.current && engineRef.current.setPaused(paused);
  }, [paused]);

  const zoneKey = activeZoneIds.join('|');
  useEffect(() => {
    engineRef.current && engineRef.current.setActiveZones(activeZoneIds);
  }, [zoneKey]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div
      style={{
        position: 'relative',
        width: 'min(100%, calc((100vh - 16px) * 1.5))', // rasio 3:2 tetap, muat di layar
        aspectRatio: `${W} / ${H}`,
        margin: '0 auto',
      }}
    >
      <canvas
        ref={canvasRef}
        width={W}
        height={H}
        style={{
          width: '100%',
          height: '100%',
          display: 'block',
          imageRendering: 'pixelated',
          background: '#1b2a1f',
          borderRadius: 8,
        }}
      />
    </div>
  );
}
