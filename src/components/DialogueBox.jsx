// DialogueBox.jsx - modal narasi + 3 opsi (urutan diacak, tanpa label tipe). Domain Dev 2.
// Opsi dipilih hanya dengan klik (SRS 5.2). Letakkan di dalam .stage (position: relative).
import { useEffect, useRef, useState } from 'react';
import { scenarios } from '../data/scenarios.js';
import { shuffle } from '../utils/gameLogic.js';

export default function DialogueBox({ scenarioId, onSelect }) {
  const scenario = scenarios.find((s) => s.id === scenarioId);
  // Urutan diacak sekali setiap dialog dibuka (komponen di-mount ulang per dialog lewat key di App).
  const [options] = useState(() => (scenario ? shuffle(scenario.options) : []));
  const boxRef = useRef(null);

  useEffect(() => {
    boxRef.current?.focus();
  }, []);

  if (!scenario) {
    console.error(`DialogueBox: skenario "${scenarioId}" tidak ditemukan di scenarios.js`);
    return null;
  }

  return (
    <div className="overlay">
      <div
        className="panel dialogue"
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialogue-title"
        tabIndex={-1}
        ref={boxRef}
      >
        <h2 className="dialogue__place" id="dialogue-title">
          {scenario.title}
        </h2>
        <p className="dialogue__narrative">{scenario.narrative}</p>
        <p className="dialogue__question">Apa yang kamu lakukan?</p>
        <div className="choices">
          {options.map((option) => (
            <button
              key={option.text}
              type="button"
              className="choice"
              onClick={() => onSelect(option.type)}
            >
              {option.text}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
