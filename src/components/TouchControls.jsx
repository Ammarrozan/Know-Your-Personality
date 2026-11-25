// TouchControls.jsx - analog (joystick) + tombol Aksi untuk HP/tablet. Domain Dev 2.
// Engine Dev 1 hanya membaca keyboard, jadi analog ini menerjemahkan arah geser menjadi event
// keyboard tiruan (KeyW/A/S/D, termasuk diagonal) dan tombol Aksi menjadi Space.
// Input.js tidak perlu diubah. Kecepatan jalan tetap (170 px/detik dari engine); analog
// menentukan arah 8 penjuru, bukan kecepatan.
// Hanya tampil di perangkat sentuh (lihat CSS: @media (hover: none) and (pointer: coarse)).
import { useEffect, useRef } from 'react';

const KEYS = {
  up: { code: 'KeyW', key: 'w' },
  left: { code: 'KeyA', key: 'a' },
  down: { code: 'KeyS', key: 's' },
  right: { code: 'KeyD', key: 'd' },
};
const DEADZONE = 0.28; // bagian dari jari-jari: di bawah ini dianggap diam
const AXIS = 0.38; // komponen minimum (≈ cos 67,5°) supaya sumbu ikut aktif → 8 arah

function sendKey(type, dir) {
  const { code, key } = KEYS[dir];
  window.dispatchEvent(new KeyboardEvent(type, { code, key, bubbles: true, cancelable: true }));
}

export default function TouchControls({ hidden = false }) {
  const held = useRef(new Set());
  const baseRef = useRef(null);
  const knobRef = useRef(null);
  const pointerRef = useRef(null);

  const setDirs = (next) => {
    const cur = held.current;
    cur.forEach((d) => {
      if (!next.has(d)) sendKey('keyup', d);
    });
    next.forEach((d) => {
      if (!cur.has(d)) sendKey('keydown', d);
    });
    held.current = next;
  };

  const resetKnob = () => {
    if (knobRef.current) knobRef.current.style.transform = 'translate(-50%, -50%)';
  };

  // Lepas semua arah saat kontrol disembunyikan (dialog terbuka) atau komponen dilepas,
  // supaya pemain tidak terus berjalan sendiri.
  useEffect(() => {
    const releaseAll = () => {
      held.current.forEach((d) => sendKey('keyup', d));
      held.current = new Set();
      pointerRef.current = null;
      if (knobRef.current) knobRef.current.style.transform = 'translate(-50%, -50%)';
    };
    if (hidden) releaseAll();
    return releaseAll;
  }, [hidden]);

  const move = (e) => {
    const base = baseRef.current;
    if (!base) return;
    const rect = base.getBoundingClientRect();
    const radius = rect.width / 2;
    let dx = e.clientX - (rect.left + radius);
    let dy = e.clientY - (rect.top + radius);
    const len = Math.hypot(dx, dy);
    if (len > radius) {
      dx = (dx / len) * radius;
      dy = (dy / len) * radius;
    }
    if (knobRef.current) {
      knobRef.current.style.transform = `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px))`;
    }
    const next = new Set();
    if (len >= radius * DEADZONE) {
      const nx = dx / Math.max(len, 1);
      const ny = dy / Math.max(len, 1);
      if (nx > AXIS) next.add('right');
      if (nx < -AXIS) next.add('left');
      if (ny > AXIS) next.add('down');
      if (ny < -AXIS) next.add('up');
    }
    setDirs(next);
  };

  const onDown = (e) => {
    e.preventDefault();
    if (pointerRef.current !== null) return;
    pointerRef.current = e.pointerId;
    try {
      e.currentTarget.setPointerCapture(e.pointerId); // jari tetap terbaca walau keluar lingkaran
    } catch {
      /* sebagian peramban menolak capture; analog tetap jalan selama jari di dalam lingkaran */
    }
    move(e);
  };

  const onMove = (e) => {
    if (e.pointerId !== pointerRef.current) return;
    e.preventDefault();
    move(e);
  };

  const onUp = (e) => {
    if (e.pointerId !== pointerRef.current) return;
    pointerRef.current = null;
    setDirs(new Set());
    resetKnob();
  };

  const action = (e) => {
    e.preventDefault();
    window.dispatchEvent(new KeyboardEvent('keydown', { code: 'Space', key: ' ', bubbles: true, cancelable: true }));
    window.dispatchEvent(new KeyboardEvent('keyup', { code: 'Space', key: ' ', bubbles: true, cancelable: true }));
  };

  return (
    <div className={hidden ? 'touch touch--hidden' : 'touch'} aria-hidden={hidden}>
      <div
        ref={baseRef}
        className="joystick"
        role="application"
        aria-label="Analog: geser untuk berjalan"
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
        onLostPointerCapture={onUp}
        onContextMenu={(e) => e.preventDefault()}
      >
        <span ref={knobRef} className="joystick__knob" />
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
