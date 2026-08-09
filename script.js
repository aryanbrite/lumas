function startIntroAnimation() {
  const clouds = ['cloud1', 'cloud2', 'cloud3'].map((id) => document.getElementById(id));
  const lumas = document.getElementById('lumas');

  clouds.forEach((cloud) => {
    if (cloud) {
      cloud.style.animationPlayState = 'running';
    }
  });

  if (lumas) {
    lumas.classList.add('show');
  }
}

function toggleMusic() {
  const bgm = document.getElementById('bgm');
  const musicToggle = document.getElementById('musicToggle');

  if (!bgm || !musicToggle) {
    return;
  }

  if (bgm.paused) {
    bgm.play().catch(() => {
      // Ignore autoplay restrictions and let the user press again.
    });
    musicToggle.classList.add('is-playing');
    musicToggle.setAttribute('aria-pressed', 'true');
  } else {
    bgm.pause();
    musicToggle.classList.remove('is-playing');
    musicToggle.setAttribute('aria-pressed', 'false');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  startIntroAnimation();
  const bgm = document.getElementById('bgm');
  const musicToggle = document.getElementById('musicToggle');
  const clickSfx = document.getElementById('clickSfx');

  bgm?.pause();
  musicToggle?.addEventListener('click', toggleMusic);

  document.addEventListener('click', () => {
    if (clickSfx) {
      clickSfx.volume = 0.08;
      clickSfx.currentTime = 0;
      clickSfx.play().catch(() => {
        // Ignore autoplay restrictions for the sound effect.
      });
    }
  }, { capture: true });
});
