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

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function triggerThunderBurst() {
  const thunder = document.getElementById('th');
  if (!thunder) {
    return;
  }

  const burstCount = getRandomInt(1, 3);
  const burstGap = 80 + Math.random() * 70;

  for (let index = 0; index < burstCount; index += 1) {
    window.setTimeout(() => {
      thunder.classList.remove('thunder-active');
      void thunder.offsetWidth;
      thunder.classList.add('thunder-active');

      const hero = document.querySelector('.hero');
      hero?.classList.remove('thunder-flash');
      void hero?.offsetWidth;
      hero?.classList.add('thunder-flash');
    }, index * burstGap);
  }
}

function startThunderLoop() {
  const thunder = document.getElementById('th');
  if (!thunder) {
    return;
  }

  triggerThunderBurst();

  const playLoop = () => {
    triggerThunderBurst();
    window.setTimeout(playLoop, 15000);
  };

  window.setTimeout(playLoop, 15000);
}

document.addEventListener('DOMContentLoaded', () => {
  startIntroAnimation();
  startThunderLoop();
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
