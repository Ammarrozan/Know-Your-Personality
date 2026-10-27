// =====================================================================
// GameCanvas.jsx — pembungkus kanvas untuk React
// Domain DEV 1 (feature/canvas-engine)
//
// Props (kontrak SRS 3.3):
//   onTrigger(scenarioId)   Canvas -> React
//   paused                  React  -> Canvas
//   activeZoneIds           React  -> Canvas
//   onSound(name)           Canvas -> React   ("door")
//   onSceneChange(sceneId)  Canvas -> React   (opsional)
//
// Engine dibuat sekali per mount. Callback disimpan di ref sehingga
// perubahan fungsi dari parent tidak membuat engine dibuat ulang, dan
// di StrictMode (mount -> unmount -> mount) engine pertama dihancurkan
// sebelum asetnya selesai dimuat, jadi callback tidak terpanggil ganda.
// =====================================================================
import { useEffect, useRef } from "react";
import GameEngine from "./GameEngine.js";

export default function GameCanvas({ onTrigger, paused = false, activeZoneIds = [], onSound, onSceneChange, debug }) {
  const canvasRef = useRef(null);
  const engineRef = useRef(null);
  const callbacksRef = useRef({});
  callbacksRef.current = { onTrigger, onSound, onSceneChange };

  const pausedRef = useRef(paused);
  pausedRef.current = paused;
  const zonesRef = useRef(activeZoneIds);
  zonesRef.current = activeZoneIds;

  useEffect(() => {
    const showDebug =
      debug ?? (typeof window !== "undefined" && new URLSearchParams(window.location.search).has("debug"));
    const engine = new GameEngine(
      canvasRef.current,
      {
        onTrigger: (id) => callbacksRef.current.onTrigger?.(id),
        onSound: (name) => callbacksRef.current.onSound?.(name),
        onSceneChange: (id) => callbacksRef.current.onSceneChange?.(id),
      },
      { debug: showDebug }
    );
    engine.setPaused(pausedRef.current);
    engine.setActiveZoneIds(zonesRef.current);
    engine.start();
    engineRef.current = engine;
    if (import.meta.env?.DEV) window.__kypEngine = engine; // hanya mode dev: untuk QA/debug di console
    return () => {
      engine.destroy();
      if (engineRef.current === engine) engineRef.current = null;
    };
  }, [debug]);

  useEffect(() => {
    engineRef.current?.setPaused(paused);
  }, [paused]);

  useEffect(() => {
    engineRef.current?.setActiveZoneIds(activeZoneIds);
  }, [activeZoneIds]);

  return (
    <canvas
      ref={canvasRef}
      className="game-canvas"
      width={960}
      height={640}
      tabIndex={0}
      aria-label="Area permainan: gerak dengan W A S D atau panah, interaksi dengan Spasi"
    />
  );
}
