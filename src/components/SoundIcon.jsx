// SoundIcon.jsx - ikon speaker SVG (tanpa emoji agar tampil sama di semua perangkat). Domain Dev 2.

export default function SoundIcon({ muted = false }) {
  return (
    <svg viewBox="0 0 24 24" width="1em" height="1em" aria-hidden="true" focusable="false">
      <path d="M3 9v6h4l5 4V5L7 9H3z" fill="currentColor" />
      {muted ? (
        <path
          d="M16 9.5l5 5M21 9.5l-5 5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      ) : (
        <path
          d="M15.5 8.5a5 5 0 010 7M18.2 5.8a8.8 8.8 0 010 12.4"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      )}
    </svg>
  );
}
