// SettingsScreen.jsx - pengaturan audio: bisukan semua, volume musik, volume efek suara. Domain Dev 2.
// Pengaturan tidak disimpan permanen (SRS 2.4): kembali ke bawaan saat halaman dimuat ulang.
import audio from '../audio/AudioManager.js';
import useAudioState from '../audio/useAudioState.js';

export default function SettingsScreen({ onBack }) {
  const { muted, musicVolume, sfxVolume } = useAudioState();

  return (
    <main className="app menu-screen">
      <section className="panel page" aria-labelledby="settings-title">
        <h1 className="page__title" id="settings-title">
          Pengaturan
        </h1>

        <div className="setting">
          <label className="setting__row" htmlFor="setting-mute">
            <span className="setting__label">Bisukan semua suara</span>
            <input
              id="setting-mute"
              type="checkbox"
              className="setting__check"
              checked={muted}
              onChange={(e) => audio.setMuted(e.target.checked)}
            />
          </label>
        </div>

        <div className="setting">
          <label className="setting__row" htmlFor="setting-music">
            <span className="setting__label">Musik latar</span>
            <span className="setting__value">{Math.round(musicVolume * 100)}%</span>
          </label>
          <input
            id="setting-music"
            type="range"
            className="setting__range"
            min="0"
            max="100"
            step="5"
            value={Math.round(musicVolume * 100)}
            onChange={(e) => audio.setMusicVolume(Number(e.target.value) / 100)}
          />
        </div>

        <div className="setting">
          <label className="setting__row" htmlFor="setting-sfx">
            <span className="setting__label">Efek suara</span>
            <span className="setting__value">{Math.round(sfxVolume * 100)}%</span>
          </label>
          <input
            id="setting-sfx"
            type="range"
            className="setting__range"
            min="0"
            max="100"
            step="5"
            value={Math.round(sfxVolume * 100)}
            onChange={(e) => audio.setSfxVolume(Number(e.target.value) / 100)}
            onPointerUp={() => audio.playSfx('complete')}
            onKeyUp={() => audio.playSfx('complete')}
          />
        </div>

        <p className="page__note">
          Pengaturan berlaku selama halaman ini terbuka. Kamu juga bisa membisukan suara kapan saja
          lewat tombol speaker di dalam permainan.
        </p>

        <div className="panel__actions">
          <button type="button" className="btn" onClick={onBack}>
            Kembali
          </button>
        </div>
      </section>
    </main>
  );
}
