// ExitConfirm.jsx - konfirmasi keluar ke Home saat sedang bermain. Domain Dev 2.
// Letakkan di dalam .stage (position: relative). Esc atau tombol Batal = lanjut bermain.
import { useEffect, useRef } from 'react';

export default function ExitConfirm({ onCancel, onConfirm }) {
  const cancelRef = useRef(null);

  // Fokus ke Batal: Enter yang tidak disengaja tidak langsung menghapus progres.
  useEffect(() => {
    cancelRef.current?.focus();
  }, []);

  return (
    <div className="overlay">
      <div className="panel confirm" role="alertdialog" aria-modal="true" aria-labelledby="confirm-title" aria-describedby="confirm-desc">
        <h2 className="confirm__title" id="confirm-title">
          Keluar ke Home?
        </h2>
        <p className="muted" id="confirm-desc">
          Jawaban yang sudah kamu pilih di permainan ini akan hilang.
        </p>
        <div className="panel__actions panel__actions--end">
          <button type="button" className="btn btn--ghost" ref={cancelRef} onClick={onCancel}>
            Batal
          </button>
          <button type="button" className="btn" onClick={onConfirm}>
            Keluar
          </button>
        </div>
      </div>
    </div>
  );
}
