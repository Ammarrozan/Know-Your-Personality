import GameCanvas from './game/GameCanvas.jsx';

// SEMENTARA: uji coba GameCanvas. Ditulis ulang pada Task 1.2.
export default function App() {
  return (
    <GameCanvas
      paused={false}
      activeZoneIds={['kantin_01', 'gerbang_01']}
      onTrigger={(id) => console.log('onTrigger:', id)}
    />
  );
}