'use strict';

/* ── LOADER ─────────────────────────────────────── */
(function initLoader() {
  const loader = document.getElementById('loader');
  window.addEventListener('load', () => {
    setTimeout(() => loader.classList.add('done'), 1900);
  });
})();

/* ── YEAR ────────────────────────────────────────── */
document.getElementById('year').textContent = new Date().getFullYear();

/* ── CANVAS PARTICLE BG ─────────────────────────── */
(function initCanvas() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, particles = [], raf;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  // Particle factory
  function Particle() {
    this.reset();
  }
  Particle.prototype.reset = function() {
    this.x    = Math.random() * W;
    this.y    = Math.random() * H;
    this.size = Math.random() * 1.4 + 0.3;
    this.vx   = (Math.random() - 0.5) * 0.35;
    this.vy   = (Math.random() - 0.5) * 0.35;
    this.alpha = Math.random() * 0.45 + 0.05;
    // Randomly cyan or violet
    this.hue  = Math.random() > 0.5 ? '0,200,255' : '123,47,255';
  };
  Particle.prototype.update = function() {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < -5) this.x = W + 5;
    if (this.x > W + 5) this.x = -5;
    if (this.y < -5) this.y = H + 5;
    if (this.y > H + 5) this.y = -5;
  };
  Particle.prototype.draw = function() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${this.hue},${this.alpha})`;
    ctx.fill();
  };

  // Create particles — fewer on small screens
  const COUNT = window.innerWidth < 640 ? 40 : 80;
  for (let i = 0; i < COUNT; i++) {
    particles.push(new Particle());
  }

  // Connect nearby particles with a faint line
  function drawConnections() {
    const MAX_DIST = 130;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MAX_DIST) {
          const alpha = (1 - dist / MAX_DIST) * 0.06;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(0,200,255,${alpha})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    drawConnections();
    particles.forEach(p => { p.update(); p.draw(); });
    raf = requestAnimationFrame(loop);
  }
  loop();

  // Pause when tab hidden for performance
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) cancelAnimationFrame(raf);
    else loop();
  });
})();

/* ── TICKER ──────────────────────────────────────── */
(function initTicker() {
  const el = document.getElementById('ticker');
  if (!el) return;

  const items = [
    'C Programming',
    'Python Basics',
    'Problem Solving',
    'Git & GitHub',
    'Cybersecurity Fundamentals',
    'AI Concepts',
    'Web Technologies',
    'Programming Fundamentals',
  ];

  let idx = 0;

  function typeText(text, cb) {
    el.textContent = '';
    let i = 0;
    const interval = setInterval(() => {
      el.textContent += text[i];
      i++;
      if (i >= text.length) { clearInterval(interval); setTimeout(cb, 1800); }
    }, 60);
  }

  function eraseText(cb) {
    const interval = setInterval(() => {
      el.textContent = el.textContent.slice(0, -1);
      if (el.textContent.length === 0) { clearInterval(interval); cb(); }
    }, 35);
  }

  function cycle() {
    typeText(items[idx], () => {
      eraseText(() => {
        idx = (idx + 1) % items.length;
        cycle();
      });
    });
  }

  // Start after loader finishes
  setTimeout(cycle, 2100);
})();

/* ── NAV SCROLL & ACTIVE ─────────────────────────── */
(function initNav() {
  const navbar  = document.getElementById('navbar');
  const links   = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  function onScroll() {
    // Scrolled class for shadow
    if (window.scrollY > 30) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Active link
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 120) {
        current = sec.getAttribute('id');
      }
    });
    links.forEach(a => {
      a.classList.remove('active');
      if (a.getAttribute('href') === '#' + current) a.classList.add('active');
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

/* ── MOBILE BURGER ───────────────────────────────── */
(function initBurger() {
  const burger = document.getElementById('burger');
  const menu   = document.getElementById('nav-links');
  if (!burger || !menu) return;

  burger.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    burger.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', open);
  });

  // Close on link click
  menu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      menu.classList.remove('open');
      burger.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
    });
  });

  // Close on outside tap
  document.addEventListener('click', e => {
    if (!burger.contains(e.target) && !menu.contains(e.target)) {
      menu.classList.remove('open');
      burger.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
    }
  });
})();

/* ── SCROLL REVEAL ───────────────────────────────── */
(function initReveal() {
  if (!('IntersectionObserver' in window)) {
    // Fallback: show all immediately
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
    return;
  }

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
})();

/* ── SMOOTH SCROLL ───────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', function(e) {
    const href = this.getAttribute('href');
    if (href.length < 2) return;
    const target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 68;
    window.scrollTo({ top: target.offsetTop - navH, behavior: 'smooth' });
  });
});

/* ── SUBTLE CURSOR GLOW (DESKTOP ONLY) ──────────── */
(function initCursorGlow() {
  if (window.matchMedia('(pointer: coarse)').matches) return; // skip touch devices

  const el = document.createElement('div');
  el.style.cssText = `
    position: fixed;
    width: 280px;
    height: 280px;
    border-radius: 50%;
    pointer-events: none;
    background: radial-gradient(circle, rgba(0,200,255,0.04) 0%, transparent 70%);
    transform: translate(-50%, -50%);
    z-index: 0;
    transition: opacity 0.3s ease;
  `;
  document.body.appendChild(el);

  document.addEventListener('mousemove', e => {
    el.style.left = e.clientX + 'px';
    el.style.top  = e.clientY + 'px';
  });
})();

/* ── GLITCH EFFECT ON HERO NAME HOVER ───────────── */
(function initHeroGlitch() {
  const name = document.querySelector('.hero-name');
  if (!name) return;

  name.addEventListener('mouseenter', () => {
    name.style.transition = 'none';
    name.style.textShadow = '2px 0 var(--cyan), -2px 0 #7b2fff';
    setTimeout(() => {
      name.style.textShadow = '';
      name.style.transition = '';
    }, 200);
  });
})();
