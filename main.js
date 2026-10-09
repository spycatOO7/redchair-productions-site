/* Red Chair Productions — interactions */
(() => {
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  window.scrollTo(0, 0);
  const D = window.RC;
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const mq = (q) => window.matchMedia(q).matches;
  const reduced = mq('(prefers-reduced-motion: reduce)');
  const touch = mq('(hover: none), (pointer: coarse)');
  const isMobile = () => mq('(max-width: 760px)');
  const pad = (n) => String(n).padStart(2, '0');
  const C_PATH = 'M0 0H100V44H80V20H20V80H100V100H0Z';
  const slug = (s) => s.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-');

  /* ------------------------------------------------------------------ render */
  $('[data-create-track]').innerHTML = D.formats.map((f, i) =>
    `<div class="create__item" data-hover><span class="num">${pad(i + 1)}</span><span class="word">${f}</span></div>`).join('');

  const counts = Object.fromEntries(D.filters.map((f) => [f, f === 'All' ? D.projects.length : D.projects.filter((p) => p.tags.includes(f)).length]));
  $('[data-filters]').innerHTML = D.filters.map((f, i) =>
    `<button role="tab" aria-selected="${i === 0}" data-filter="${f}" data-hover>${f}<sup>${pad(counts[f])}</sup></button>`).join('');

  $('[data-work]').innerHTML = D.projects.map((p, i) => `
    <article class="card card--${p.size}" data-tags="${p.tags.join('|')}" data-index="${i}" tabindex="0" role="button" aria-label="Play ${p.title}" data-cursor="Play">
      <div class="card__media">
        <img src="${p.poster}" alt="" loading="${i < 2 ? 'eager' : 'lazy'}" decoding="async">
        <video muted loop playsinline preload="none" data-src="${p.video}"></video>
        <div class="card__mask"></div>
      </div>
      <div class="card__top mono"><span>${pad(i + 1)} / ${pad(D.projects.length)}</span>${p.placeholder ? '<span class="card__tag">Concept</span>' : ''}</div>
      <div class="card__info">
        <div><h3 class="card__title">${p.title}</h3><p class="card__cat mono"><b>■</b> ${p.category}</p></div>
        <span class="card__year mono">${p.year}</span>
      </div>
      <span class="card__bar"></span>
    </article>`).join('');

  $('[data-services]').innerHTML = D.services.map(([name, desc], i) => `
    <li class="svc${i === 0 ? ' is-open' : ''}">
      <button class="svc__btn" aria-expanded="${i === 0}" data-hover>
        <span class="svc__num">${pad(i + 1)}</span><span class="svc__name">${name}</span><span class="svc__icon"></span>
      </button>
      <div class="svc__body"><p>${desc}</p></div>
    </li>`).join('');

  $('[data-steps]').insertAdjacentHTML('beforeend', D.process.map(([n, d], i) =>
    `<li class="step"><span class="step__num">${pad(i + 1)}</span><h3 class="step__name">${n}</h3><p class="step__desc">${d}</p></li>`).join(''));

  $('[data-clients]').innerHTML = D.clients.map((c) => `
    <li class="client" data-hover>${c.logo
      ? `<img src="${c.logo}" alt="${c.name}" loading="lazy">`
      : `<span class="client__ph"><svg viewBox="0 0 100 100"><path d="${C_PATH}"/></svg>${c.name}</span>`}</li>`).join('');

  $('[data-social]').innerHTML = D.studio.social.map((s) => `<li><a href="${s.href}" target="_blank" rel="noopener" data-hover>${s.label}</a></li>`).join('');
  $$('[data-email]').forEach((a) => { a.href = `mailto:${D.studio.email}`; a.textContent = D.studio.email; });
  $('[data-email-subject]').href = `mailto:${D.studio.email}?subject=${encodeURIComponent('New project enquiry')}`;
  $('[data-year]').textContent = new Date().getFullYear();
  $('[data-reel-runtime]').textContent = D.reel.runtime;

  /* --------------------------------------------------------------- hero video */
  const heroVideo = $('[data-hero-video]');
  const mobileHero = isMobile();
  heroVideo.poster = mobileHero ? D.hero.posterMobile : D.hero.poster;
  heroVideo.src = mobileHero ? D.hero.videoMobile : D.hero.video;
  const tc = $('[data-timecode]');
  const fmtTC = (t) => {
    const f = Math.floor((t % 1) * 25);
    return `00:${pad(Math.floor(t / 60))}:${pad(Math.floor(t % 60))}:${pad(f)}`;
  };
  let tcRaf;
  const tickTC = () => { tc.textContent = fmtTC(heroVideo.currentTime || 0); tcRaf = requestAnimationFrame(tickTC); };

  /* ------------------------------------------------------- one video at a time */
  // Only the hero, the reel preview, or a single card ever plays at once.
  let activeCard = null;
  const loadVideo = (v) => { if (!v.src && v.dataset.src) { v.src = v.dataset.src; } };
  const playCard = (card) => {
    if (activeCard && activeCard !== card) stopCard(activeCard);
    const v = $('video', card);
    loadVideo(v);
    activeCard = card;
    const p = v.play();
    if (p) p.then(() => card === activeCard && card.classList.add('is-playing')).catch(() => {});
  };
  const stopCard = (card) => {
    const v = $('video', card);
    v.pause();
    card.classList.remove('is-playing');
    if (activeCard === card) activeCard = null;
  };

  const cards = $$('.card');
  if (!touch) {
    cards.forEach((c) => {
      c.addEventListener('mouseenter', () => playCard(c));
      c.addEventListener('mouseleave', () => stopCard(c));
    });
  } else {
    // Touch: autoplay the single card closest to the centre of the screen.
    const vis = new Map();
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => vis.set(e.target, e.intersectionRatio));
      let best = null, bestR = .6;
      vis.forEach((r, el) => { if (r > bestR && !el.classList.contains('is-hidden')) { best = el; bestR = r; } });
      if (best && best !== activeCard) playCard(best);
      if (!best && activeCard) stopCard(activeCard);
    }, { threshold: [0, .25, .6, .8, 1] });
    cards.forEach((c) => io.observe(c));
  }

  /* ------------------------------------------------------------------- player */
  const player = $('[data-player]');
  const pv = $('[data-player-video]');
  let lenis;
  const openPlayer = (src, title, poster) => {
    if (activeCard) stopCard(activeCard);
    heroVideo.pause();
    reelVideo.pause();
    pv.poster = poster || '';
    pv.src = src;
    pv.muted = false;
    $('[data-player-title]').textContent = title;
    player.classList.add('is-open');
    player.setAttribute('aria-hidden', 'false');
    lenis && lenis.stop();
    pv.play().catch(() => {});
    $('[data-player-close]').focus();
  };
  const closePlayer = () => {
    pv.pause();
    pv.removeAttribute('src'); pv.load();
    player.classList.remove('is-open');
    player.setAttribute('aria-hidden', 'true');
    lenis && lenis.start();
    resumeBackgroundVideo();
  };
  $('[data-player-close]').addEventListener('click', closePlayer);
  player.addEventListener('click', (e) => { if (e.target === player) closePlayer(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && player.classList.contains('is-open')) closePlayer(); });

  cards.forEach((c) => {
    const p = D.projects[+c.dataset.index];
    const open = () => openPlayer(p.full || p.video, `${p.title} — ${p.category}`, p.poster);
    c.addEventListener('click', open);
    c.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } });
  });

  const reelVideo = $('[data-reel-video]');
  reelVideo.poster = D.reel.poster;
  reelVideo.dataset.src = D.reel.video;
  $('[data-reel-frame]').addEventListener('click', () => openPlayer(D.reel.video, 'Red Chair Productions — Showreel', D.reel.poster));

  // Background videos pause when off-screen, so hero and reel never play together.
  const inView = new Map();
  const resumeBackgroundVideo = () => {
    if (player.classList.contains('is-open')) return;
    inView.get(heroVideo) ? heroVideo.play().catch(() => {}) : heroVideo.pause();
    if (inView.get(reelVideo)) { loadVideo(reelVideo); reelVideo.play().catch(() => {}); } else reelVideo.pause();
  };
  const bgIO = new IntersectionObserver((entries) => {
    entries.forEach((e) => inView.set(e.target, e.isIntersecting));
    resumeBackgroundVideo();
  }, { threshold: .15 });
  bgIO.observe(heroVideo); bgIO.observe(reelVideo);
  heroVideo.addEventListener('playing', () => { cancelAnimationFrame(tcRaf); tickTC(); });
  heroVideo.addEventListener('pause', () => cancelAnimationFrame(tcRaf));
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { heroVideo.pause(); reelVideo.pause(); } else resumeBackgroundVideo();
  });

  /* ----------------------------------------------------------------- services */
  $$('.svc__btn').forEach((b) => b.addEventListener('click', () => {
    const li = b.parentElement;
    const open = !li.classList.contains('is-open');
    $$('.svc').forEach((s) => { s.classList.remove('is-open'); $('.svc__btn', s).setAttribute('aria-expanded', 'false'); });
    if (open) { li.classList.add('is-open'); b.setAttribute('aria-expanded', 'true'); }
    setTimeout(() => window.ScrollTrigger && ScrollTrigger.refresh(), 650);
  }));

  /* --------------------------------------------------------------------- menu */
  const toggle = $('[data-menu-toggle]');
  const menu = $('#menu');
  const setMenu = (open) => {
    toggle.setAttribute('aria-expanded', open);
    $('.nav__toggle-label', toggle).textContent = open ? 'Close' : 'Menu';
    menu.classList.toggle('is-open', open);
    menu.setAttribute('aria-hidden', !open);
    open ? lenis && lenis.stop() : lenis && lenis.start();
    document.body.style.overflow = open ? 'hidden' : '';
  };
  toggle.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') !== 'true'));

  // Anchor links go through Lenis when it is running
  $$('a[href^="#"]').forEach((a) => a.addEventListener('click', (e) => {
    const id = a.getAttribute('href');
    if (id.length < 2 && id !== '#') return;
    if (id === '#') { e.preventDefault(); return; }
    const target = id === '#top' ? 0 : $(id);
    if (target === null) return;
    e.preventDefault();
    if (menu.classList.contains('is-open')) setMenu(false);
    if (lenis) lenis.scrollTo(target, { offset: 0, duration: 1.6 });
    else if (target === 0) window.scrollTo({ top: 0, behavior: 'smooth' });
    else target.scrollIntoView({ behavior: 'smooth' });
  }));

  /* ------------------------------------------------------------------- filter */
  const empty = $('[data-empty]');
  const applyFilter = (f) => {
    const state = window.Flip ? Flip.getState(cards) : null;
    let shown = 0;
    cards.forEach((c) => {
      const on = f === 'All' || c.dataset.tags.split('|').includes(f);
      c.classList.toggle('is-hidden', !on);
      if (on) shown++; else if (c === activeCard) stopCard(c);
    });
    empty.hidden = shown > 0;
    if (state && !reduced) {
      Flip.from(state, {
        duration: .8, ease: 'expo.out', absolute: true, nested: true, prune: true,
        onEnter: (els) => gsap.fromTo(els, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: .8, ease: 'expo.out', stagger: .05 }),
        onLeave: (els) => gsap.to(els, { opacity: 0, duration: .35 }),
        onComplete: () => ScrollTrigger.refresh(),
      });
    }
  };
  $$('[data-filter]').forEach((b) => b.addEventListener('click', () => {
    $$('[data-filter]').forEach((x) => x.setAttribute('aria-selected', x === b));
    applyFilter(b.dataset.filter);
  }));

  /* ----------------------------------------------------------- split headings */
  $$('[data-split] .line').forEach((l) => { l.innerHTML = `<span class="inner">${l.innerHTML}</span>`; });

  /* -------------------------------------------------------------------- nav */
  const nav = $('[data-nav]');
  let lastY = 0;
  const onScroll = (y) => {
    nav.classList.toggle('is-solid', y > 40);
    const menuOpen = menu.classList.contains('is-open');
    nav.classList.toggle('is-hidden', !menuOpen && y > 700 && y > lastY + 2);
    if (y < lastY - 2) nav.classList.remove('is-hidden');
    lastY = y;
  };

  /* =========================================================== no-GSAP fallback */
  const gsapOK = window.gsap && window.ScrollTrigger;
  const finishLoad = () => { document.body.classList.remove('is-loading'); };
  if (!gsapOK || reduced) {
    $('.loader').remove();
    finishLoad();
    window.addEventListener('scroll', () => onScroll(window.scrollY), { passive: true });
    resumeBackgroundVideo();
    if (gsapOK) gsap.set('.card__mask', { display: 'none' }); else $$('.card__mask').forEach((m) => m.remove());
    return;
  }

  /* =================================================================== motion */
  gsap.registerPlugin(ScrollTrigger, Flip);

  if (window.Lenis) {
    lenis = new Lenis({ duration: 1.15, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smoothWheel: true });
    lenis.on('scroll', (e) => { ScrollTrigger.update(); onScroll(e.scroll); });
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
    lenis.stop();
  } else {
    window.addEventListener('scroll', () => onScroll(window.scrollY), { passive: true });
  }

  // Loader → hero
  const loaderTC = $('.loader__tc');
  const counter = { f: 0 };
  const intro = gsap.timeline({ defaults: { ease: 'expo.out' } });
  intro
    .from('.loader__c', { scale: .4, opacity: 0, duration: .8 })
    .to(counter, { f: 48, duration: 1, ease: 'power2.inOut', onUpdate: () => {
      const f = Math.round(counter.f); loaderTC.textContent = `00:00:${pad(Math.floor(f / 25))}:${pad(f % 25)}`;
    } }, 0)
    .to('.loader__c', { scale: 28, duration: 1.1, ease: 'expo.in' }, .95)
    .to('.loader', { opacity: 0, duration: .4, ease: 'none', onComplete: () => { $('.loader').remove(); finishLoad(); lenis && lenis.start(); resumeBackgroundVideo(); } }, 1.85)
    .fromTo('.hero__video', { scale: 1.35 }, { scale: 1.12, duration: 2.2 }, 1.7)
    .from('.hero__title .inner', { yPercent: 110, duration: 1.3, stagger: .09 }, 1.9)
    .from('.hero [data-fade], .hero__frame, .hero__scroll', { opacity: 0, y: 20, duration: 1, stagger: .08 }, 2.2)
    .from('.nav', { opacity: 0, duration: 1, clearProps: 'opacity' }, 2.1);

  // Hero parallax on scroll
  gsap.to('.hero__media', { yPercent: 22, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
  gsap.to('.hero__content', { yPercent: -18, opacity: 0, ease: 'none', scrollTrigger: { trigger: '.hero', start: '30% top', end: 'bottom top', scrub: true } });

  // Heading reveals
  $$('[data-split]').forEach((el) => {
    if (el.closest('.hero')) return;
    gsap.from($$('.inner', el), { yPercent: 110, duration: 1.2, ease: 'expo.out', stagger: .08, scrollTrigger: { trigger: el, start: 'top 85%' } });
  });
  $$('[data-fade]').forEach((el) => {
    if (el.closest('.hero')) return;
    gsap.from(el, { opacity: 0, y: 30, duration: 1.1, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 88%' } });
  });
  $$('.eyebrow').forEach((el) => gsap.from(el, { opacity: 0, x: -16, duration: .9, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 90%' } }));

  // Red C draws in by mask
  gsap.fromTo('[data-cmark]', { clipPath: 'inset(0% 100% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.4, ease: 'expo.inOut', scrollTrigger: { trigger: '[data-cmark]', start: 'top 85%' } });

  // What we create
  const mm = gsap.matchMedia();
  const items = $$('.create__item');
  mm.add('(min-width: 761px)', () => {
    const track = $('[data-create-track]');
    const dist = () => track.scrollWidth - window.innerWidth;
    const setActive = () => {
      const mid = window.innerWidth * .42;
      let best = null, bd = Infinity;
      items.forEach((it) => { const r = it.getBoundingClientRect(); const d = Math.abs(r.left + r.width / 2 - mid); if (d < bd) { bd = d; best = it; } });
      items.forEach((it) => it.classList.toggle('is-active', it === best));
    };
    gsap.to(track, {
      x: () => -dist(), ease: 'none',
      scrollTrigger: {
        trigger: '[data-create]', pin: '.create__pin', start: 'top top', end: () => `+=${dist()}`, scrub: .6,
        invalidateOnRefresh: true, onUpdate: (st) => { gsap.set('[data-create-bar]', { scaleX: st.progress }); setActive(); },
      },
    });
    setActive();
  });
  mm.add('(max-width: 760px)', () => {
    items.forEach((it) => ScrollTrigger.create({ trigger: it, start: 'top 60%', end: 'bottom 40%', toggleClass: 'is-active' }));
  });

  // Work cards — masked reveal + gentle parallax
  cards.forEach((c) => {
    gsap.to($('.card__mask', c), { scaleY: 0, duration: 1.3, ease: 'expo.inOut', scrollTrigger: { trigger: c, start: 'top 88%' } });
    gsap.fromTo($('.card__media', c), { y: 40 }, { y: 0, duration: 1.4, ease: 'expo.out', scrollTrigger: { trigger: c, start: 'top 88%' } });
  });

  // Showreel — frame opens to full bleed
  mm.add('(min-width: 761px)', () => {
    gsap.fromTo('[data-reel-frame]', { clipPath: 'inset(14% 10% 14% 10%)' }, {
      clipPath: 'inset(0% 0% 0% 0%)', ease: 'none',
      scrollTrigger: { trigger: '.reel__stage', start: 'top 85%', end: 'top top', scrub: true },
    });
    gsap.fromTo('.reel__video', { scale: 1.2 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: '.reel__stage', start: 'top bottom', end: 'bottom top', scrub: true } });
  });
  mm.add('(max-width: 760px)', () => {
    gsap.fromTo('[data-reel-frame]', { clipPath: 'inset(6% 4% 6% 4%)' }, { clipPath: 'inset(0% 0% 0% 0%)', ease: 'none', scrollTrigger: { trigger: '.reel__stage', start: 'top 90%', end: 'top 25%', scrub: true } });
  });

  // Services rows
  gsap.from('.svc', { opacity: 0, y: 24, duration: .9, ease: 'expo.out', stagger: .04, scrollTrigger: { trigger: '.services__list', start: 'top 85%' } });

  // Process line
  const steps = $$('.step');
  mm.add('(min-width: 761px)', () => {
    gsap.to('[data-process-line]', { scaleX: 1, ease: 'none', scrollTrigger: {
      trigger: '[data-steps]', start: 'top 80%', end: 'bottom 45%', scrub: true,
      onUpdate: (st) => steps.forEach((s, i) => s.classList.toggle('is-lit', st.progress >= i / steps.length + .02)),
    } });
  });
  mm.add('(max-width: 760px)', () => {
    gsap.to('[data-process-line]', { scaleY: 1, ease: 'none', scrollTrigger: {
      trigger: '[data-steps]', start: 'top 70%', end: 'bottom 60%', scrub: true,
      onUpdate: (st) => steps.forEach((s, i) => s.classList.toggle('is-lit', st.progress >= i / steps.length + .02)),
    } });
  });
  gsap.from('.step', { opacity: 0, y: 30, duration: 1, ease: 'expo.out', stagger: .1, scrollTrigger: { trigger: '[data-steps]', start: 'top 82%' } });

  // Statement rows drift in opposite directions
  gsap.fromTo('[data-row="1"]', { xPercent: 0 }, { xPercent: -28, ease: 'none', scrollTrigger: { trigger: '[data-statement]', start: 'top bottom', end: 'bottom top', scrub: true } });
  gsap.fromTo('[data-row="2"]', { xPercent: -30 }, { xPercent: -4, ease: 'none', scrollTrigger: { trigger: '[data-statement]', start: 'top bottom', end: 'bottom top', scrub: true } });
  gsap.from('.statement__c', { rotate: -90, scale: 0, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: '[data-statement]', start: 'top 60%' } });

  // Clients
  gsap.from('.client', { opacity: 0, duration: 1, ease: 'power2.out', stagger: .06, scrollTrigger: { trigger: '[data-clients]', start: 'top 85%' } });

  // CTA glow breathes up as it enters
  gsap.fromTo('.cta__glow', { yPercent: 30, opacity: .2 }, { yPercent: -5, opacity: 1, ease: 'none', scrollTrigger: { trigger: '.cta', start: 'top bottom', end: 'bottom bottom', scrub: true } });
  gsap.from('.footer__word', { yPercent: 40, opacity: 0, ease: 'none', scrollTrigger: { trigger: '.footer', start: 'top bottom', end: 'bottom bottom', scrub: true } });

  // Active nav link
  ['work', 'services', 'about', 'contact'].forEach((id) => {
    const link = $(`.nav__links a[href="#${id}"]`);
    ScrollTrigger.create({ trigger: `#${id}`, start: 'top 50%', end: 'bottom 50%', onToggle: (st) => link.classList.toggle('is-active', st.isActive) });
  });

  /* ------------------------------------------------------------------ cursor */
  if (!touch) {
    const glow = $('.cursor-glow');
    const label = $('.cursor-label');
    const labelText = $('span', label);
    const gx = gsap.quickTo(glow, 'x', { duration: .9, ease: 'power3.out' });
    const gy = gsap.quickTo(glow, 'y', { duration: .9, ease: 'power3.out' });
    const lx = gsap.quickTo(label, 'x', { duration: .35, ease: 'power3.out' });
    const ly = gsap.quickTo(label, 'y', { duration: .35, ease: 'power3.out' });
    window.addEventListener('pointermove', (e) => {
      glow.classList.add('is-on');
      gx(e.clientX); gy(e.clientY); lx(e.clientX); ly(e.clientY);
    }, { passive: true });
    document.addEventListener('pointerleave', () => glow.classList.remove('is-on'));

    const hoverables = 'a, button, [data-hover], .card';
    document.addEventListener('pointerover', (e) => {
      const h = e.target.closest(hoverables);
      const lab = e.target.closest('[data-cursor]');
      glow.classList.toggle('is-hover', !!h);
      gsap.to(glow, { scale: h ? (lab ? 1.35 : 1.18) : 1, duration: .8, ease: 'expo.out' });
      if (lab && !lab.matches('.cta__btn')) {
        labelText.textContent = lab.dataset.cursor;
        gsap.to(label, { scale: 1, duration: .5, ease: 'expo.out' });
      } else gsap.to(label, { scale: 0, duration: .35, ease: 'expo.out' });
    });

    // Magnetic buttons
    $$('[data-magnetic]').forEach((el) => {
      const mx = gsap.quickTo(el, 'x', { duration: .6, ease: 'expo.out' });
      const my = gsap.quickTo(el, 'y', { duration: .6, ease: 'expo.out' });
      el.addEventListener('pointermove', (e) => {
        const r = el.getBoundingClientRect();
        const k = el.matches('.cta__btn') ? .12 : .28;
        mx((e.clientX - r.left - r.width / 2) * k);
        my((e.clientY - r.top - r.height / 2) * k);
        el.style.setProperty('--x', `${e.clientX - r.left}px`);
        el.style.setProperty('--y', `${e.clientY - r.top}px`);
      });
      el.addEventListener('pointerleave', () => { mx(0); my(0); });
    });
  }

  window.addEventListener('load', () => ScrollTrigger.refresh());
})();
