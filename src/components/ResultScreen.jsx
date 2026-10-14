// ResultScreen.jsx - skor, tipe dominan, teks edukasi, dan tombol Main Ulang. Domain Dev 2.
import { getResult, getAmbivertReason } from '../utils/gameLogic.js';
import { resultContent } from '../data/results.js';

const MAX_SCORE = 9; // jumlah skenario per permainan = skala batang 0-9
const TYPES = [
  { key: 'I', label: 'Introvert' },
  { key: 'E', label: 'Ekstrovert' },
  { key: 'A', label: 'Ambivert' },
];

export default function ResultScreen({ score, onRestart }) {
  const result = getResult(score);
  const content = resultContent[result];
  const top = Math.max(score.I, score.E, score.A);
  // Ambivert muncul untuk "A tertinggi" maupun "seri"; kalimat ini menjelaskan sebabnya
  const reason = result === 'Ambivert' ? getAmbivertReason(score) : '';

  return (
    <main className="app">
      <section className="panel result" aria-labelledby="result-type">
        <p className="muted">Kecenderungan dari pilihanmu di {MAX_SCORE} situasi</p>
        <h1 className="result__type" id="result-type">
          {result}
        </h1>
        {reason && <p className="result__reason">{reason}</p>}

        <ul className="bars" aria-label="Skor akhir">
          {TYPES.map(({ key, label }) => (
            <li key={key} className="bar">
              <span className="bar__label">{label}</span>
              <span className="bar__track" aria-hidden="true">
                <span
                  className={score[key] === top ? 'bar__fill bar__fill--top' : 'bar__fill'}
                  style={{ width: `${(score[key] / MAX_SCORE) * 100}%` }}
                />
              </span>
              <span className="bar__value" aria-label={`${score[key]} dari ${MAX_SCORE}`}>
                {score[key]}
              </span>
            </li>
          ))}
        </ul>

        <h2 className="result__heading">Kekuatan</h2>
        <p>{content.strengths}</p>

        <h2 className="result__heading">Mitos dan faktanya</h2>
        <p>
          <strong>Mitos:</strong> {content.myth} <strong>Faktanya:</strong> {content.fact}
        </p>

        <p className="result__note">
          Hasil ini adalah refleksi ringan dari pilihanmu di dalam game, bukan tes psikologi
          tervalidasi dan tidak untuk diagnosis. Tidak ada tipe yang lebih baik dari yang lain, dan
          kecenderungan seseorang bisa berubah menurut situasi dan waktu.
        </p>

        <div className="panel__actions">
          <button type="button" className="btn" onClick={onRestart}>
            Main Ulang
          </button>
        </div>
      </section>
    </main>
  );
}
