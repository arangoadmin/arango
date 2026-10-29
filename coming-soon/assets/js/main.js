/**
 * ARANGO - PÁGINA PROVISÓRIA / EM CONSTRUÇÃO
 * Slideshow Engine & Precision Countdown
 */

(function () {
  'use strict';

  // =========================================================================
  // 1. SLIDESHOW CONFIGURATION & ENGINE
  // =========================================================================
  const slides = [
    {
      id: 'slide-0',
      caption: 'Construção de viaduto em consola ao entardecer'
    },
    {
      id: 'slide-1',
      caption: 'Hospital Central e Universitário da Madeira'
    },
    {
      id: 'slide-2',
      caption: 'Execução de viaduto e montagem com gruas'
    },
    {
      id: 'slide-3',
      caption: 'Armaduras de fundação montadas por ferrageiros'
    },
    {
      id: 'slide-4',
      caption: 'Poço de fundação circular com malha de varão'
    },
    {
      id: 'slide-5',
      caption: 'Pilar de viaduto e embocadura de túnel na encosta'
    }
  ];

  let currentSlide = 0;
  const slideDurationMs = 5500;
  let slideTimer = null;

  const captionElement = document.getElementById('slide-caption');
  const indicatorButtons = document.querySelectorAll('.indicator-bar');

  function goToSlide(index) {
    const prevSlideEl = document.getElementById(slides[currentSlide].id);
    if (prevSlideEl) {
      prevSlideEl.classList.remove('active');
    }

    currentSlide = (index + slides.length) % slides.length;

    const nextSlideEl = document.getElementById(slides[currentSlide].id);
    if (nextSlideEl) {
      nextSlideEl.classList.add('active');
    }

    if (captionElement) {
      captionElement.textContent = slides[currentSlide].caption;
    }

    indicatorButtons.forEach((btn, idx) => {
      if (idx === currentSlide) {
        btn.classList.add('active');
        btn.setAttribute('aria-current', 'true');
      } else {
        btn.classList.remove('active');
        btn.removeAttribute('aria-current');
      }
    });

    // Reset rotation timer
    clearInterval(slideTimer);
    slideTimer = setInterval(nextSlide, slideDurationMs);
  }

  function nextSlide() {
    goToSlide(currentSlide + 1);
  }

  // Bind indicators
  indicatorButtons.forEach((btn, idx) => {
    btn.addEventListener('click', () => goToSlide(idx));
  });

  // Start rotation
  slideTimer = setInterval(nextSlide, slideDurationMs);


  // =========================================================================
  // 2. PRECISION COUNTDOWN ENGINE
  // =========================================================================
  // Launch moment: 2027-02-25 00:00:00 UTC (WET/Madeira timezone)
  const TARGET_UTC_MS = Date.UTC(2027, 1, 25, 0, 0, 0);

  let serverClockOffsetMs = 0;

  const elDays = document.getElementById('cd-days');
  const elHours = document.getElementById('cd-hours');
  const elMinutes = document.getElementById('cd-minutes');
  const elSeconds = document.getElementById('cd-seconds');
  const elStatusPill = document.getElementById('countdown-status-text');

  // Synchronize client clock with server HTTP Date header to prevent drift
  async function syncServerTime() {
    try {
      const t0 = performance.now();
      const res = await fetch(window.location.href, { method: 'HEAD', cache: 'no-store' });
      const t1 = performance.now();
      const headerDate = res.headers.get('date');

      if (headerDate) {
        const serverTime = new Date(headerDate).getTime();
        const roundTripHalf = (t1 - t0) / 2;
        serverClockOffsetMs = (serverTime + roundTripHalf) - Date.now();
      }
    } catch (err) {
      // Offline fallback: rely on local system time
      serverClockOffsetMs = 0;
    }
  }

  function getAccurateNow() {
    return Date.now() + serverClockOffsetMs;
  }

  function formatPad(num) {
    return String(num).padStart(2, '0');
  }

  function renderCountdown() {
    const diff = TARGET_UTC_MS - getAccurateNow();

    if (diff <= 0) {
      if (elDays) elDays.textContent = '00';
      if (elHours) elHours.textContent = '00';
      if (elMinutes) elMinutes.textContent = '00';
      if (elSeconds) elSeconds.textContent = '00';
      if (elStatusPill) elStatusPill.textContent = 'Website oficial disponível';
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    if (elDays) elDays.textContent = days;
    if (elHours) elHours.textContent = formatPad(hours);
    if (elMinutes) elMinutes.textContent = formatPad(minutes);
    if (elSeconds) elSeconds.textContent = formatPad(seconds);
  }

  // Initial draw and 1s heartbeat
  renderCountdown();
  setInterval(renderCountdown, 1000);

  // Instant re-render when user switches back to tab or unlocks phone
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
      renderCountdown();
    }
  });

  // Attempt server synchronization
  syncServerTime();

})();
