// TouchControls.jsx - tombol arah + tombol Aksi untuk HP/tablet. Domain Dev 2.
// Engine Dev 1 hanya membaca keyboard, jadi tombol ini mengirim event keyboard tiruan
// (KeyW/A/S/D dan Space) ke window. Input.js tidak perlu diubah.
// Hanya tampil di perangkat sentuh (lihat CSS: @media (hover: none) and (pointer: coarse)).
import { useEffect, useRef } from 'react';

const DIRS = [
  { code: 'KeyW', key: 'w', label: 'Atas', cls: 'up', path: 'M6 15l6-6 6 6' },
  { code: 'KeyA', key: 'a', label: 'Kiri', cls: 'left', path: 'M15 6l-6 6 6 6' },
  { code: 'KeyS', key: 's', label: 'Bawah', cls: 'down', path: 'M6 9l6 6 6-6' },
  { code: 'KeyD', key: 'd', label: 'Kanan', cls: 'right', path: 'M9 6l6 6-6 6' },
];

function sendKey(type, code, key) {
  window.dispatchEvent(new KeyboardEvent(type, { code, key, bubbles: true, cancelable: true }));
}

export default function TouchControls({ hidden = false }) {
  const pressed = useRef(new Set());

  // Lepas semua arah saat kontrol disembunyikan (dialog terbuka) atau komponen dilepas,
  // supaya pemain tidak terus berjalan sendiri.
  useEffect(() => {
    const held = pressed.current;
    const releaseAll = () => {
      held.forEach((code) => {
        const dir = DIRS.find((d) => d.code === code);
        if (dir) sendKey('keyup', dir.code, dir.key);
      });
      held.clear();
    };
    if (hidden) releaseAll();
    return releaseAll;
  }, [hidden]);

  const press = (dir) => (e) => {
    e.preventDefault();
    e.currentTarget.setPointerCapture?.(e.pointerId);
    if (pressed.current.has(dir.code)) return;
    pressed.current.add(dir.code);
    sendKey('keydown', dir.code, dir.key);
  };

  const release = (dir) => (e) => {
    e.preventDefault();
    if (!pressed.current.has(dir.code)) return;
    pressed.current.delete(dir.code);
    sendKey('keyup', dir.code, dir.key);
  };

  const action = (e) => {
    e.preventDefault();
    sendKey('keydown', 'Space', ' ');
    sendKey('keyup', 'Space', ' ');
  };

  return (
    <div className={hidden ? 'touch touch--hidden' : 'touch'} aria-hidden={hidden}>
      <div className="touch__pad" role="group" aria-label="Tombol arah">
        {DIRS.map((dir) => (
          <button
            key={dir.code}
            type="button"
            className={`touch__btn touch__btn--${dir.cls}`}
            aria-label={dir.label}
            tabIndex={-1}
            data-sfx="off"
            onPointerDown={press(dir)}
            onPointerUp={release(dir)}
            onPointerCancel={release(dir)}
            onLostPointerCapture={release(dir)}
            onContextMenu={(e) => e.preventDefault()}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path d={dir.path} fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        ))}
      </div>
      <button
        type="button"
        className="touch__action"
        aria-label="Aksi (sama dengan Spasi)"
        tabIndex={-1}
        data-sfx="off"
        onPointerDown={action}
        onContextMenu={(e) => e.preventDefault()}
      >
        Aksi
      </button>
    </div>
  );
}
