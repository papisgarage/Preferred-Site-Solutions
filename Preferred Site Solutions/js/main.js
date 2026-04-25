/* =========================================================
   PREFERRED SITE SOLUTIONS — main.js
   ========================================================= */

(function () {
  'use strict';

  /* ---- NAVBAR SCROLL ---- */
  const navbar = document.getElementById('navbar');

  const handleScroll = () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  /* ---- MOBILE NAV ---- */
  const hamburger = document.getElementById('hamburger');
  const navMenu   = document.getElementById('nav-menu');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('open');
    document.body.style.overflow = navMenu.classList.contains('open') ? 'hidden' : '';
  });

  navMenu.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  /* ---- HERO ZOOM TRIGGER ---- */
  const hero = document.querySelector('.hero');
  if (hero) {
    setTimeout(() => hero.classList.add('loaded'), 100);
  }

  /* ---- ACTIVE NAV ON SCROLL ---- */
  const sections = document.querySelectorAll('section[id], div[id]');
  const navLinks  = document.querySelectorAll('.nav-link');

  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  sections.forEach(s => sectionObserver.observe(s));

  /* ---- SCROLL ANIMATIONS ---- */
  const aosElements = document.querySelectorAll('[data-aos]');

  const aosObserver = new IntersectionObserver(entries => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, i * 80);
        aosObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  aosElements.forEach(el => aosObserver.observe(el));

  /* ---- COUNTER ANIMATION ---- */
  const counters = document.querySelectorAll('.stat-num[data-target]');

  const countObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        countObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => countObserver.observe(c));

  function animateCounter(el) {
    const target   = parseInt(el.dataset.target, 10);
    const duration = 1800;
    const step     = 16;
    const totalSteps = duration / step;
    let current = 0;

    const increment = () => {
      current += target / totalSteps;
      if (current >= target) {
        el.textContent = target;
        return;
      }
      el.textContent = Math.floor(current);
      setTimeout(increment, step);
    };

    increment();
  }

  /* ---- GALLERY LIGHTBOX ---- */
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox     = document.getElementById('lightbox');
  const lbImg        = document.getElementById('lightbox-img');
  const lbCaption    = document.getElementById('lightbox-caption');
  const lbClose      = document.getElementById('lightbox-close');
  const lbPrev       = document.getElementById('lightbox-prev');
  const lbNext       = document.getElementById('lightbox-next');

  let currentIndex = 0;
  const images = [];

  galleryItems.forEach((item, idx) => {
    const img     = item.querySelector('img');
    const caption = item.querySelector('.gallery-overlay span')?.textContent || '';
    images.push({ src: img.src, alt: img.alt, caption });

    item.addEventListener('click', () => openLightbox(idx));
  });

  function openLightbox(idx) {
    currentIndex = idx;
    updateLightbox();
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }

  function updateLightbox() {
    const { src, alt, caption } = images[currentIndex];
    lbImg.src           = src;
    lbImg.alt           = alt;
    lbCaption.textContent = caption;
  }

  function prevImage() {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    updateLightbox();
  }

  function nextImage() {
    currentIndex = (currentIndex + 1) % images.length;
    updateLightbox();
  }

  lbClose.addEventListener('click', closeLightbox);
  lbPrev.addEventListener('click', prevImage);
  lbNext.addEventListener('click', nextImage);

  lightbox.addEventListener('click', e => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', e => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape')      closeLightbox();
    if (e.key === 'ArrowLeft')   prevImage();
    if (e.key === 'ArrowRight')  nextImage();
  });

  /* ---- CONTACT FORM ---- */
  const form = document.getElementById('contact-form');

  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();

      const name  = form.querySelector('#name').value.trim();
      const phone = form.querySelector('#phone').value.trim();

      if (!name || !phone) {
        shakeForm(form);
        return;
      }

      const btn = form.querySelector('button[type="submit"]');
      btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
      btn.disabled = true;

      setTimeout(() => {
        form.innerHTML = `
          <div class="form-success" style="display:block">
            <i class="fas fa-check-circle"></i>
            <h3>Request Received!</h3>
            <p>Thanks, <strong>${name}</strong>! We'll be in touch shortly.</p>
            <p style="margin-top:1rem">Or call us now: <a href="tel:3053424952" style="color:var(--gold);font-weight:700">305-342-4952</a></p>
          </div>
        `;
      }, 1000);
    });
  }

  function shakeForm(el) {
    el.style.animation = 'shake 0.4s ease';
    setTimeout(() => el.style.animation = '', 400);
  }

  /* ---- SMOOTH SCROLL FOR ALL ANCHORS ---- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = navbar ? navbar.offsetHeight : 0;
      const top    = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* ---- TESTIMONIALS CAROUSEL ---- */
  const trackWrap = document.querySelector('.testimonials-track-wrap');
  const track     = document.getElementById('testimonials-track');
  const tPrev     = document.getElementById('t-prev');
  const tNext     = document.getElementById('t-next');
  const dotsWrap  = document.getElementById('t-dots');

  if (track && tPrev && tNext && trackWrap) {
    const cards    = Array.from(track.querySelectorAll('.testimonial-card'));
    const total    = cards.length;
    let current    = 0;
    let autoTimer  = null;

    // Force every card to exactly the wrapper's pixel width
    function setCardWidths() {
      const w = trackWrap.clientWidth;
      cards.forEach(c => { c.style.width = w + 'px'; });
    }

    function buildDots() {
      dotsWrap.innerHTML = '';
      for (let i = 0; i < total; i++) {
        const d = document.createElement('button');
        d.className = 't-dot' + (i === current ? ' active' : '');
        d.setAttribute('aria-label', `Review ${i + 1}`);
        d.addEventListener('click', () => goTo(i));
        dotsWrap.appendChild(d);
      }
    }

    function updateDots() {
      dotsWrap.querySelectorAll('.t-dot').forEach((d, i) => {
        d.classList.toggle('active', i === current);
      });
    }

    function goTo(idx) {
      current = ((idx % total) + total) % total;
      track.style.transform = `translateX(-${current * trackWrap.clientWidth}px)`;
      updateDots();
    }

    function next() { goTo(current + 1); }
    function prev() { goTo(current - 1); }

    function startAuto() {
      stopAuto();
      autoTimer = setInterval(next, 5500);
    }
    function stopAuto() {
      if (autoTimer) clearInterval(autoTimer);
    }

    tNext.addEventListener('click', () => { next(); startAuto(); });
    tPrev.addEventListener('click', () => { prev(); startAuto(); });

    track.addEventListener('mouseenter', stopAuto);
    track.addEventListener('mouseleave', startAuto);

    let touchStartX = 0;
    track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend', e => {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 40) { diff > 0 ? next() : prev(); startAuto(); }
    });

    window.addEventListener('resize', () => { setCardWidths(); goTo(current); });

    setCardWidths();
    buildDots();
    goTo(0);
    startAuto();
  }

  /* ---- INJECT SHAKE KEYFRAMES ---- */
  const style = document.createElement('style');
  style.textContent = `
    @keyframes shake {
      0%,100% { transform: translateX(0); }
      20%      { transform: translateX(-8px); }
      40%      { transform: translateX(8px); }
      60%      { transform: translateX(-6px); }
      80%      { transform: translateX(6px); }
    }
    .nav-link.active { color: var(--gold) !important; }
  `;
  document.head.appendChild(style);

})();
