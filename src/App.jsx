// App.jsx - root component & state manager, penghubung React-Canvas. Domain Dev 2.
import { useState } from 'react';
import GameCanvas from './game/GameCanvas.jsx';
import HUD from './components/HUD.jsx';
import StartScreen from './components/StartScreen.jsx';
import DialogueBox from './components/DialogueBox.jsx';
import ResultScreen from './components/ResultScreen.jsx';
import { scenarios } from './data/scenarios.js';
import { pickScenarios } from './utils/gameLogic.js';

const TOTAL_AP = 9;

export default function App() {
  const [screen, setScreen] = useState('start'); // start | playing | result
  const [ap, setAp] = useState(TOTAL_AP);
  const [score, setScore] = useState({ I: 0, E: 0, A: 0 });
  const [selectedScenarioIds, setSelectedScenarioIds] = useState([]);
  const [completedScenarios, setCompletedScenarios] = useState([]);
  const [activeScenarioId, setActiveScenarioId] = useState(null);
  const [paused, setPaused] = useState(false);

  // Zona aktif = skenario terpilih dikurangi yang sudah selesai (SRS 3.3)
  const activeZoneIds = selectedScenarioIds.filter((id) => !completedScenarios.includes(id));

  const startGame = () => {
    setSelectedScenarioIds(pickScenarios(scenarios, TOTAL_AP).map((s) => s.id));
    setAp(TOTAL_AP);
    setScore({ I: 0, E: 0, A: 0 });
    setCompletedScenarios([]);
    setActiveScenarioId(null);
    setPaused(false);
    setScreen('playing');
  };

  // Dipanggil Canvas sekali saat Spasi ditekan di zona aktif.
  // Wajib set paused = true di handler yang sama (kontrak SRS 3.3).
  const handleTrigger = (id) => {
    if (paused || completedScenarios.includes(id)) return; // pengaman
    setActiveScenarioId(id);
    setPaused(true);
  };

  const handleOptionSelect = (type) => {
    if (!activeScenarioId) return;
    const nextAp = ap - 1;
    setScore((s) => ({ ...s, [type]: s[type] + 1 }));
    setCompletedScenarios((c) => [...c, activeScenarioId]);
    setActiveScenarioId(null);
    setAp(nextAp);
    if (nextAp === 0) setScreen('result'); // Canvas di-unmount
    else setPaused(false);
  };

  if (screen === 'start') return <StartScreen onStart={startGame} />;
  if (screen === 'result') return <ResultScreen score={score} onRestart={startGame} />;

  return (
    <div className="app">
      <div className="stage">
        <GameCanvas paused={paused} activeZoneIds={activeZoneIds} onTrigger={handleTrigger} />
        <HUD ap={ap} total={TOTAL_AP} />
        {activeScenarioId && (
          <DialogueBox key={activeScenarioId} scenarioId={activeScenarioId} onSelect={handleOptionSelect} />
        )}
      </div>
    </div>
  );
}
