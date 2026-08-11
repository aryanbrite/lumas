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

function initPaperPlaneTimeline() {
  const section = document.querySelector('.timeline-section');
  const plane = document.getElementById('timeline-plane');
  const cards = Array.from(document.querySelectorAll('.timeline-card'));

  if (!section || !plane || cards.length < 2) {
    return;
  }

  const planeImage = plane.querySelector('img');
  let ticking = false;

  const getCardCenter = (card) => {
    const rect = card.getBoundingClientRect();
    const trackRect = section.querySelector('.timeline-track').getBoundingClientRect();

    return {
      x: rect.left - trackRect.left + rect.width / 2,
      y: rect.top - trackRect.top + rect.height / 2,
    };
  };

  const getSmoothPointAndAngle = (points, progress) => {
    const clampedProgress = Math.max(0, Math.min(1, progress));
    const totalSegments = points.length - 1;
    const scaledProgress = clampedProgress * totalSegments;
    const segmentIndex = Math.min(Math.floor(scaledProgress), totalSegments - 1);
    const localProgress = scaledProgress - segmentIndex;

    const p0 = points[Math.max(0, segmentIndex - 1)];
    const p1 = points[segmentIndex];
    const p2 = points[Math.min(points.length - 1, segmentIndex + 1)];
    const p3 = points[Math.min(points.length - 1, segmentIndex + 2)];

    const x = 0.5 * (
      (2 * p1.x)
      + (-p0.x + p2.x) * localProgress
      + (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * (localProgress ** 2)
      + (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * (localProgress ** 3)
    );
    const y = 0.5 * (
      (2 * p1.y)
      + (-p0.y + p2.y) * localProgress
      + (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * (localProgress ** 2)
      + (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * (localProgress ** 3)
    );

    const derivativeX = 0.5 * (
      (-p0.x + p2.x)
      + 2 * (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * localProgress
      + 3 * (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * (localProgress ** 2)
    );
    const derivativeY = 0.5 * (
      (-p0.y + p2.y)
      + 2 * (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * localProgress
      + 3 * (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * (localProgress ** 2)
    );

    const angleDeg = (Math.atan2(derivativeY, derivativeX) * 180) / Math.PI;

    return { x, y, angleDeg };
  };

  const updatePlane = () => {
    const cardCenters = cards.map(getCardCenter);
    const sectionTop = section.getBoundingClientRect().top + window.scrollY;
    const sectionBottom = sectionTop + section.offsetHeight;
    const viewportHeight = window.innerHeight;
    const startScroll = sectionTop - viewportHeight * 0.35;
    const endScroll = sectionBottom - viewportHeight * 0.65;
    const scrollRange = endScroll - startScroll || 1;
    const progress = Math.min(1, Math.max(0, (window.scrollY - startScroll) / scrollRange));

    const easedProgress = 0.5 - 0.5 * Math.cos(progress * Math.PI);
    const point = getSmoothPointAndAngle(cardCenters, easedProgress);

    plane.style.left = `${point.x}px`;
    plane.style.top = `${point.y}px`;
    planeImage.style.transform = `rotate(${point.angleDeg}deg)`;
  };

  const scheduleUpdate = () => {
    if (ticking) {
      return;
    }

    ticking = true;
    window.requestAnimationFrame(() => {
      updatePlane();
      ticking = false;
    });
  };

  scheduleUpdate();
  window.addEventListener('scroll', scheduleUpdate, { passive: true });
  window.addEventListener('resize', scheduleUpdate);
}

document.addEventListener('DOMContentLoaded', () => {
  startIntroAnimation();
  startThunderLoop();
  initPaperPlaneTimeline();
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
