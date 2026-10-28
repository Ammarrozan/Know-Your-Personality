// App.jsx - root component & state manager, penghubung React-Canvas. Domain Dev 2.
import { useMemo, useState } from 'react';
import GameCanvas from './game/GameCanvas.jsx';
import { TI_IDS } from './game/mapData.js';
import HUD from './components/HUD.jsx';
import StartScreen from './components/StartScreen.jsx';
import TutorialScreen from './components/TutorialScreen.jsx';
import SettingsScreen from './components/SettingsScreen.jsx';
import AboutScreen from './components/AboutScreen.jsx';
import DialogueBox from './components/DialogueBox.jsx';
import ResultScreen from './components/ResultScreen.jsx';
import useAudioState from './audio/useAudioState.js';
import audio from './audio/AudioManager.js';
import { scenarios } from './data/scenarios.js';

const TOTAL_AP = 9; // jatah menjawab per permainan; pemain memilih sendiri 9 dari 20 TI

const SCENARIO_IDS = new Set(scenarios.map((s) => s.id));
// Hanya TI yang punya skenario yang boleh aktif. Ini mencegah game macet bila ada ID yang
// ada di peta (mapData.js) tetapi belum ada di scenarios.js.
const PLAYABLE_IDS = TI_IDS.filter((id) => SCENARIO_IDS.has(id));

if (import.meta.env?.DEV) {
  const noScenario = TI_IDS.filter((id) => !SCENARIO_IDS.has(id));
  const noZone = [...SCENARIO_IDS].filter((id) => !TI_IDS.includes(id));
  if (noScenario.length) console.warn('[KYP] TI di peta tanpa skenario:', noScenario);
  if (noZone.length) console.warn('[KYP] Skenario tanpa TI di peta:', noZone);
  if (PLAYABLE_IDS.length < TOTAL_AP) console.warn('[KYP] TI yang bisa dimainkan kurang dari jatah AP');
}

export default function App() {
  // home | tutorial | settings | about | playing | result
  const [screen, setScreen] = useState('home');
  const [ap, setAp] = useState(TOTAL_AP);
  const [score, setScore] = useState({ I: 0, E: 0, A: 0 });
  const [completedScenarios, setCompletedScenarios] = useState([]);
  const [activeScenarioId, setActiveScenarioId] = useState(null);
  const [paused, setPaused] = useState(false);
  const { muted } = useAudioState();

  // Zona aktif = semua TI yang punya skenario dikurangi yang sudah dijawab (SRS 3.3)
  const activeZoneIds = useMemo(
    () => PLAYABLE_IDS.filter((id) => !completedScenarios.includes(id)),
    [completedScenarios],
  );

  const resetGame = () => {
    setAp(TOTAL_AP);
    setScore({ I: 0, E: 0, A: 0 });
    setCompletedScenarios([]);
    setActiveScenarioId(null);
    setPaused(false);
  };

  const startGame = () => {
    resetGame();
    setScreen('playing');
  };

  const goHome = () => {
    resetGame();
    setScreen('home');
  };

  // Klik pertama pemain membuka audio (kebijakan peramban) dan memulai musik latar.
  // Semua tombol berbunyi "klik", kecuali yang ditandai data-sfx="off".
  const handleClickCapture = (e) => {
    audio.startBgm();
    audio.unlock();
    const button = e.target instanceof Element ? e.target.closest('button') : null;
    if (button && button.dataset.sfx !== 'off') audio.playSfx('click');
  };

  // Dipanggil Canvas sekali saat Spasi ditekan di zona aktif.
  // Wajib set paused = true di handler yang sama (kontrak SRS 3.3).
  const handleTrigger = (id) => {
    if (paused || completedScenarios.includes(id) || !SCENARIO_IDS.has(id)) return; // pengaman
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
    if (nextAp === 0) {
      audio.playSfx('result');
      setScreen('result'); // Canvas di-unmount
    } else {
      audio.playSfx('complete');
      setPaused(false);
    }
  };

  let content;
  if (screen === 'home') {
    content = (
      <StartScreen
        onPlay={startGame}
        onTutorial={() => setScreen('tutorial')}
        onSettings={() => setScreen('settings')}
        onAbout={() => setScreen('about')}
      />
    );
  } else if (screen === 'tutorial') {
    content = <TutorialScreen totalAp={TOTAL_AP} onBack={() => setScreen('home')} onPlay={startGame} />;
  } else if (screen === 'settings') {
    content = <SettingsScreen onBack={() => setScreen('home')} />;
  } else if (screen === 'about') {
    content = <AboutScreen onBack={() => setScreen('home')} />;
  } else if (screen === 'result') {
    content = <ResultScreen score={score} total={TOTAL_AP} onRestart={startGame} onHome={goHome} />;
  } else {
    content = (
      <div className="app">
        <div className="stage">
          <GameCanvas
            paused={paused}
            activeZoneIds={activeZoneIds}
            onTrigger={handleTrigger}
            onSound={(name) => audio.playSfx(name)}
          />
          <HUD ap={ap} total={TOTAL_AP} muted={muted} onToggleMute={() => audio.toggleMuted()} />
          {activeScenarioId && (
            <DialogueBox key={activeScenarioId} scenarioId={activeScenarioId} onSelect={handleOptionSelect} />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="root" onClickCapture={handleClickCapture}>
      {content}
    </div>
  );
}
