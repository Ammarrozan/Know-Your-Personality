// =====================================================================
// Camera.js — kamera mengikuti pemain, dibatasi ukuran scene (Task 2.1)
// Domain DEV 1 (feature/canvas-engine)
// =====================================================================

export default class Camera {
  constructor(viewWidth, viewHeight) {
    this.viewWidth = viewWidth;
    this.viewHeight = viewHeight;
    this.x = 0;
    this.y = 0;
    this.smoothing = 10; // makin besar makin cepat mengejar pemain
  }

  /** Posisi kamera ideal (pojok kiri atas) untuk target, sudah di-clamp. */
  targetFor(tx, ty, sceneWidth, sceneHeight) {
    return {
      x: Camera.clampAxis(tx - this.viewWidth / 2, sceneWidth, this.viewWidth),
      y: Camera.clampAxis(ty - this.viewHeight / 2, sceneHeight, this.viewHeight),
    };
  }

  /**
   * Scene lebih besar dari viewport: kamera dibatasi [0, size - view].
   * Scene lebih kecil: scene diletakkan di tengah (nilai negatif),
   * jadi area di luar scene tidak pernah menampilkan "dunia kosong".
   */
  static clampAxis(value, sceneSize, viewSize) {
    if (sceneSize <= viewSize) return -(viewSize - sceneSize) / 2;
    return Math.max(0, Math.min(value, sceneSize - viewSize));
  }

  follow(tx, ty, sceneWidth, sceneHeight, dt) {
    const t = this.targetFor(tx, ty, sceneWidth, sceneHeight);
    const k = 1 - Math.exp(-this.smoothing * dt);
    this.x += (t.x - this.x) * k;
    this.y += (t.y - this.y) * k;
    // jaga agar interpolasi tidak pernah melewati batas
    this.x = Camera.clampAxis(this.x, sceneWidth, this.viewWidth);
    this.y = Camera.clampAxis(this.y, sceneHeight, this.viewHeight);
  }

  snapTo(tx, ty, sceneWidth, sceneHeight) {
    const t = this.targetFor(tx, ty, sceneWidth, sceneHeight);
    this.x = t.x;
    this.y = t.y;
  }

  /** Posisi kamera dibulatkan agar pixel art tetap tajam. */
  get ix() {
    return Math.round(this.x);
  }

  get iy() {
    return Math.round(this.y);
  }

  /** Apakah rect dunia terlihat di viewport (untuk culling). */
  isVisible(x, y, w, h, margin = 32) {
    return (
      x + w > this.x - margin &&
      x < this.x + this.viewWidth + margin &&
      y + h > this.y - margin &&
      y < this.y + this.viewHeight + margin
    );
  }
}
