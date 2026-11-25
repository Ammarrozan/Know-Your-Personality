// DialogueBox.jsx - modal narasi + 3 opsi (urutan diacak, tanpa label tipe). Domain Dev 2.
// Opsi dipilih dengan klik atau tombol angka 1-3; Spasi tidak memilih apa pun (SRS 5.2).
// Letakkan di dalam .stage (position: relative).
import { useEffect, useRef, useState } from 'react';
import { scenarios } from '../data/scenarios.js';
import { shuffle } from '../utils/gameLogic.js';

export default function DialogueBox({ scenarioId, onSelect }) {
  const scenario = scenarios.find((s) => s.id === scenarioId);
  // Urutan diacak sekali setiap dialog dibuka (komponen di-mount ulang per dialog lewat key di App).
  const [options] = useState(() => (scenario ? shuffle(scenario.options) : []));
  const boxRef = useRef(null);
  const onSelectRef = useRef(onSelect);

  useEffect(() => {
    onSelectRef.current = onSelect;
  });

  useEffect(() => {
    boxRef.current?.focus();
  }, []);

  // Pintasan keyboard 1-3 (urutan tampilan, bukan tipe jawaban)
  useEffect(() => {
    const onKey = (e) => {
      if (e.repeat || e.ctrlKey || e.metaKey || e.altKey) return;
      const index = Number(e.key) - 1;
      if (Number.isInteger(index) && index >= 0 && index < options.length) {
        e.preventDefault();
        onSelectRef.current(options[index].type);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [options]);

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
        <div className="dialogue__body">
          <p className="dialogue__narrative">{scenario.narrative}</p>
          <p className="dialogue__question">Apa yang kamu lakukan?</p>
          <div className="choices">
            {options.map((option, i) => (
              <button
                key={option.text}
                type="button"
                className="choice"
                data-sfx="off" /* suara "selesai" diputar oleh App.jsx, bukan suara klik biasa */
                onClick={() => onSelect(option.type)}
              >
                <span className="choice__key" aria-hidden="true">
                  {i + 1}
                </span>
                <span className="choice__text">{option.text}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
