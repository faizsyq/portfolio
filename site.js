/* ============================================================
   site.js — motion for Faiz Syauqi's portfolio
   GSAP + ScrollTrigger + Lenis (loaded from CDN).
   Everything degrades: no GSAP → static page (gallery still works),
   reduced motion → no smooth scroll, pinning or parallax; short fades only.
============================================================ */

(function () {
  'use strict';

  const root = document.documentElement;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const hasGsap = !!(window.gsap && window.ScrollTrigger);

  if (!hasGsap) root.classList.remove('motion');

  /* ============================================================
     Gallery lightbox (projects page). Works without GSAP.
  ============================================================ */
  let lenis = null;
  initLightbox();

  if (!hasGsap) return;

  gsap.registerPlugin(ScrollTrigger);

  /* ---------- smooth scroll ---------- */
  if (!reduce && window.Lenis) {
    lenis = new Lenis({ lerp: 0.1 });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  const header = document.querySelector('.site-header');
  const headerOffset = () => (header ? header.offsetHeight : 0);

  function resolveTarget(id) {
    let target = null;
    try { target = document.querySelector(id); } catch (e) { return null; }
    if (target && target.closest('.work__track') && root.classList.contains('is-horizontal')) {
      target = document.getElementById('work');
    }
    return target;
  }

  function scrollToTarget(target, immediate) {
    const offset = target.id === 'work' ? 0 : -headerOffset() - 16;
    if (lenis) lenis.scrollTo(target, { offset, duration: 1.4, immediate: !!immediate });
    else window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY + offset, behavior: 'auto' });
  }

  /* in-page anchors go through Lenis */
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (id.length < 2) return;
      const target = resolveTarget(id);
      if (!target) return;
      e.preventDefault();
      scrollToTarget(target);
      history.replaceState(null, '', id);
    });
  });

  /* ---------- header state ---------- */
  if (header) {
    ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: (self) => header.classList.toggle('is-scrolled', self.scroll() > 40),
    });
  }

  /* ---------- split display type into letters ---------- */
  document.querySelectorAll('.hero__name .word, [data-split] .word').forEach((word) => {
    const text = word.textContent.trim();
    word.textContent = '';
    for (const ch of text) {
      const s = document.createElement('span');
      s.className = 'ch';
      s.textContent = ch;
      word.appendChild(s);
    }
  });

  /* ============================================================
     Home hero
  ============================================================ */
  const hero = document.querySelector('.hero');
  const name = document.querySelector('.hero__name');

  // scale the name so it spans the full width (capped by viewport height)
  function fitName() {
    if (!name) return;
    name.style.fontSize = '';
    const base = parseFloat(getComputedStyle(name).fontSize);
    const words = [...name.querySelectorAll('.word')];
    const stacked = getComputedStyle(words[0]).display === 'block';
    const widthOf = (w) => [...w.children].reduce((s, c) => s + c.getBoundingClientRect().width, 0);
    let natural;
    if (stacked) {
      natural = Math.max(...words.map(widthOf));
    } else {
      const gap = parseFloat(getComputedStyle(words[1]).marginLeft) || 0;
      natural = words.reduce((s, w) => s + widthOf(w), 0) + gap;
    }
    if (!natural) return;
    let size = base * (name.clientWidth / natural) * 0.995;
    if (!stacked) size = Math.min(size, window.innerHeight * 0.34);
    name.style.fontSize = size + 'px';
  }

  function closeInBrackets(tl, corners, dx, dy, at) {
    const offsets = [[-dx, -dy], [dx, -dy], [-dx, dy], [dx, dy]];
    tl.fromTo(corners,
      { x: (i) => offsets[i][0], y: (i) => offsets[i][1], opacity: 0 },
      { x: 0, y: 0, opacity: 1, duration: 1.4, ease: 'expo.inOut', stagger: 0.03 }, at);
  }

  function heroIntro() {
    const chars = hero.querySelectorAll('.hero__name .ch');
    const portrait = hero.querySelector('.hero__portrait');
    const focus = hero.querySelector('.hero__focus');
    const corners = focus ? focus.querySelectorAll('i') : [];
    const intro = hero.querySelectorAll('.hero__intro > *, .hero__meta');

    if (reduce) {
      gsap.fromTo([portrait, ...intro, header], { opacity: 0 }, { opacity: 1, duration: 0.4, ease: 'none' });
      return;
    }

    const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });

    // 1. brackets close in from the frame edges onto the face
    tl.set(focus, { opacity: 1 });
    closeInBrackets(tl, corners, window.innerWidth * 0.35, window.innerHeight * 0.3, 0);

    // 2. portrait pulls into focus
    tl.fromTo(portrait,
      { opacity: 0, scale: 1.06, filter: 'blur(18px)', transformOrigin: '50% 100%' },
      { opacity: 1, scale: 1, filter: 'blur(0px)', duration: 1.7, ease: 'power3.out', clearProps: 'filter' }, 0.35);

    // 3. name rises letter by letter behind the head
    tl.fromTo(chars, { yPercent: 105, y: 0 }, { yPercent: 0, y: 0, duration: 1.3, stagger: 0.04 }, 0.55);

    // 4. supporting copy and header settle in
    tl.fromTo(intro, { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 1, stagger: 0.08 }, 1.05)
      .fromTo(header, { y: -16, opacity: 0 }, { y: 0, opacity: 1, duration: 1 }, 1.1);

    // 5. a small "focus confirmed" pulse on the brackets
    tl.to(corners, { scale: 0.86, duration: 0.18, ease: 'power2.in', yoyo: true, repeat: 1 }, '-=0.6');
  }

  function heroScroll() {
    if (reduce) return;
    const st = { trigger: hero, start: 'top top', end: 'bottom top', scrub: true };
    gsap.to('.hero__name', { yPercent: -40, ease: 'none', scrollTrigger: st });
    gsap.to('.hero__portrait img', { yPercent: 8, ease: 'none', scrollTrigger: { ...st } });
    // explicit from-values: these elements are also animated by the intro timeline
    gsap.fromTo('.hero__focus', { autoAlpha: 1 }, { autoAlpha: 0, ease: 'none', immediateRender: false, scrollTrigger: { ...st, end: '40% top' } });
    gsap.fromTo('.hero__intro', { y: 0, autoAlpha: 1 }, { y: -60, autoAlpha: 0, ease: 'none', immediateRender: false, scrollTrigger: { ...st, start: '20% top', end: '80% top' } });
  }

  /* ============================================================
     Inner page intro (biography, projects)
  ============================================================ */
  function pageIntro() {
    const chars = document.querySelectorAll('[data-split] .ch');
    const items = document.querySelectorAll('[data-intro]');
    const pulls = document.querySelectorAll('[data-focus-pull]');
    const corners = document.querySelectorAll('[data-close-in] i');

    if (reduce) {
      gsap.set(chars, { yPercent: 0 });
      gsap.fromTo([header, ...items, ...pulls], { opacity: 0 }, { opacity: 1, duration: 0.4, ease: 'none' });
      return;
    }

    const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
    if (header) tl.fromTo(header, { y: -16, opacity: 0 }, { y: 0, opacity: 1, duration: 1 }, 0);
    if (chars.length) tl.fromTo(chars, { yPercent: 105, y: 0 }, { yPercent: 0, y: 0, duration: 1.2, stagger: 0.035 }, 0.1);
    if (pulls.length) {
      tl.fromTo(pulls,
        { opacity: 0, scale: 1.04, filter: 'blur(14px)' },
        { opacity: 1, scale: 1, filter: 'blur(0px)', duration: 1.5, ease: 'power3.out', clearProps: 'filter,transform' }, 0.2);
    }
    if (items.length) tl.fromTo(items, { y: 28, opacity: 0 }, { y: 0, opacity: 1, duration: 1, stagger: 0.07, clearProps: 'transform' }, 0.45);
    if (corners.length) closeInBrackets(tl, corners, 70, 70, 0.3);
  }

  /* ---------- kick off once fonts are ready ---------- */
  let started = false;
  function start() {
    if (started) return;
    started = true;
    if (hero) {
      fitName();
      heroIntro();
      heroScroll();
    } else {
      pageIntro();
    }
    ScrollTrigger.refresh();

    // honour a hash in the URL (e.g. projects.html#dwaspa) after layout settles
    if (location.hash.length > 1) {
      const target = resolveTarget(location.hash);
      if (target) requestAnimationFrame(() => scrollToTarget(target, true));
    }
  }
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(start);
    setTimeout(start, 1500); // never hold the intro hostage to a slow font
  } else {
    start();
  }

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(fitName, 120);
  });

  /* ============================================================
     Scroll: reveals, horizontal work track, stacked cards
  ============================================================ */
  const track = document.querySelector('.work__track');
  const panels = track ? [...track.querySelectorAll('.panel')] : [];
  const bar = document.querySelector('.work__bar span');
  const count = document.querySelector('.work__count b');
  const projectCount = panels.filter((p) => !p.classList.contains('panel--more')).length;
  const stackCards = [...document.querySelectorAll('.stack-card')];

  const mm = gsap.matchMedia();

  mm.add(
    {
      // gsap only runs this when at least one condition matches, so "all" keeps it alive on phones
      base: 'all',
      wide: '(min-width: 1000px) and (min-height: 600px)',
      stackable: '(min-width: 900px) and (min-height: 640px)',
      reduced: '(prefers-reduced-motion: reduce)',
    },
    (ctx) => {
      const { wide, stackable, reduced } = ctx.conditions;
      const horizontal = wide && !reduced && track;

      if (horizontal) root.classList.add('is-horizontal');

      // generic reveals (work panels are handled separately in horizontal mode)
      const revealTargets = gsap.utils.toArray('[data-reveal]').filter((el) => !(horizontal && el.classList.contains('panel')));

      ScrollTrigger.batch(revealTargets, {
        start: 'top 88%',
        once: true,
        onEnter: (batch) => {
          if (reduced) {
            gsap.fromTo(batch, { opacity: 0 }, { opacity: 1, duration: 0.3, ease: 'none' });
          } else {
            gsap.fromTo(batch,
              { opacity: 0, y: 40 },
              { opacity: 1, y: 0, duration: 1.1, ease: 'expo.out', stagger: 0.08, clearProps: 'transform' });
          }
        },
      });

      if (!reduced) {
        // thin rules draw across
        gsap.utils.toArray('.sec-head__rule').forEach((rule) => {
          gsap.fromTo(rule, { scaleX: 0 }, {
            scaleX: 1, duration: 1.6, ease: 'expo.inOut',
            scrollTrigger: { trigger: rule, start: 'top 92%', once: true },
          });
        });

        // closing headline drifts in as you reach it
        if (document.querySelector('.contact__big')) {
          gsap.fromTo('.contact__big', { xPercent: -6 }, {
            xPercent: 0, ease: 'none',
            scrollTrigger: { trigger: '.contact', start: 'top bottom', end: 'center center', scrub: true },
          });
        }

        // page-head title drifts up a little as you leave it
        if (!hero && document.querySelector('.page-head [data-split]')) {
          gsap.to('.page-head [data-split]', {
            yPercent: -18, ease: 'none',
            scrollTrigger: { trigger: '.page-head', start: 'top top', end: 'bottom top', scrub: true },
          });
        }
      }

      /* --- home: pinned horizontal work track --- */
      if (horizontal) {
        const distance = () => track.scrollWidth - document.documentElement.clientWidth;

        const scroller = gsap.to(track, {
          x: () => -distance(),
          ease: 'none',
          scrollTrigger: {
            trigger: '.work',
            start: 'top top',
            end: () => '+=' + distance(),
            pin: true,
            scrub: 0.8,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              if (bar) bar.style.transform = 'scaleX(' + self.progress + ')';
              if (count) {
                const n = Math.min(projectCount, Math.round(self.progress * projectCount) + 1);
                count.textContent = String(n).padStart(2, '0');
              }
            },
          },
        });

        // panels slide in as the section arrives
        gsap.fromTo(panels, { opacity: 0, x: 120 }, {
          opacity: 1, x: 0, duration: 1.2, ease: 'expo.out', stagger: 0.08,
          scrollTrigger: { trigger: '.work', start: 'top 65%', once: true },
        });

        panels.forEach((panel) => {
          const plate = panel.querySelector('.plate');
          if (!plate) return;

          // focus pull: each light table sharpens as it reaches the middle
          gsap.fromTo(plate, { filter: 'blur(8px)', opacity: 0.5 }, {
            filter: 'blur(0px)', opacity: 1, ease: 'none',
            scrollTrigger: { trigger: panel, containerAnimation: scroller, start: 'left 100%', end: 'left 40%', scrub: true },
          });

          // screenshots drift a little against the card for depth
          gsap.fromTo(plate.querySelectorAll('img'), { xPercent: 4 }, {
            xPercent: -4, ease: 'none',
            scrollTrigger: { trigger: panel, containerAnimation: scroller, start: 'left right', end: 'right left', scrub: true },
          });
        });
      }

      /* --- projects: sticky stacked cards --- */
      if (stackCards.length && stackable && !reduced) {
        stackCards.forEach((card, i) => {
          const next = stackCards[i + 1];
          if (!next) return;
          const inner = card.querySelector('.stack-card__inner');
          const shade = card.querySelector('.stack-card__shade');
          const st = {
            trigger: next,
            start: 'top bottom',
            end: () => 'top ' + (headerOffset() + 40),
            scrub: true,
            invalidateOnRefresh: true,
          };
          // the card underneath recedes as the next one slides over it
          gsap.to(inner, { scale: 0.93, ease: 'none', scrollTrigger: st });
          if (shade) gsap.to(shade, { opacity: 0.55, ease: 'none', scrollTrigger: { ...st } });
        });

        // screenshots drift upward inside each card while it is on screen
        stackCards.forEach((card) => {
          const imgs = card.querySelectorAll('.plate img');
          gsap.fromTo(imgs, { yPercent: 5 }, {
            yPercent: -3, ease: 'none',
            scrollTrigger: { trigger: card, start: 'top bottom', end: 'top top', scrub: true },
          });
        });
      }

      return () => {
        root.classList.remove('is-horizontal');
        if (bar) bar.style.transform = '';
      };
    }
  );

  /* ---------- card tilt (desktop, pointer only) ---------- */
  if (finePointer && !reduce) {
    panels.forEach((panel) => {
      gsap.set(panel, { transformPerspective: 1200 });
      const rx = gsap.quickTo(panel, 'rotationX', { duration: 0.6, ease: 'power3.out' });
      const ry = gsap.quickTo(panel, 'rotationY', { duration: 0.6, ease: 'power3.out' });
      const MAX = 3;
      panel.addEventListener('pointermove', (e) => {
        const r = panel.getBoundingClientRect();
        ry(((e.clientX - r.left) / r.width - 0.5) * MAX * 2);
        rx(-((e.clientY - r.top) / r.height - 0.5) * MAX * 2);
      });
      panel.addEventListener('pointerleave', () => { rx(0); ry(0); });
    });
  }

  // recalc once images have settled
  window.addEventListener('load', () => ScrollTrigger.refresh());

  /* ============================================================
     Lightbox implementation
  ============================================================ */
  function initLightbox() {
    const lb = document.getElementById('lightbox');
    if (!lb) return;

    const panel = lb.querySelector('.lightbox__panel');
    const img = document.getElementById('lb-img');
    const titleEl = document.getElementById('lb-title');
    const descEl = document.getElementById('lb-desc');
    const tagsEl = document.getElementById('lb-tags');
    const thumbsEl = document.getElementById('lb-thumbs');
    const curEl = document.getElementById('lb-current');
    const totalEl = document.getElementById('lb-total');
    const closeBtn = lb.querySelector('.lightbox__close');
    const prevBtn = lb.querySelector('.lightbox__nav--prev');
    const nextBtn = lb.querySelector('.lightbox__nav--next');

    let images = [];
    let index = 0;
    let title = '';
    let opener = null;
    const animate = () => window.gsap && !reduce;

    function show(i) {
      index = (i + images.length) % images.length;
      const src = images[index];
      const swap = () => {
        img.src = src;
        img.alt = title + ', screen ' + (index + 1) + ' of ' + images.length;
      };
      if (animate()) {
        gsap.to(img, {
          opacity: 0, duration: 0.15, ease: 'power1.in',
          onComplete: () => { swap(); gsap.fromTo(img, { opacity: 0, scale: 0.98 }, { opacity: 1, scale: 1, duration: 0.4, ease: 'expo.out' }); },
        });
      } else {
        swap();
      }
      curEl.textContent = String(index + 1).padStart(2, '0');
      thumbsEl.querySelectorAll('button').forEach((b, n) => {
        const on = n === index;
        b.setAttribute('aria-current', on ? 'true' : 'false');
        if (on) b.scrollIntoView({ block: 'nearest', inline: 'nearest' });
      });
      // warm the next image
      const pre = new Image();
      pre.src = images[(index + 1) % images.length];
    }

    function open(btn) {
      opener = btn;
      title = btn.dataset.title || '';
      images = (btn.dataset.images || '').split(',').map((s) => encodeURI(s.trim())).filter(Boolean);
      if (!images.length) return;

      titleEl.textContent = title;
      descEl.textContent = btn.dataset.description || '';
      tagsEl.innerHTML = '';
      (btn.dataset.tags || '').split(',').map((t) => t.trim()).filter(Boolean).forEach((t) => {
        const li = document.createElement('li');
        li.textContent = t;
        tagsEl.appendChild(li);
      });
      totalEl.textContent = String(images.length).padStart(2, '0');

      thumbsEl.innerHTML = '';
      images.forEach((src, n) => {
        const b = document.createElement('button');
        b.type = 'button';
        b.setAttribute('aria-label', 'Show screen ' + (n + 1));
        const t = document.createElement('img');
        t.src = src;
        t.alt = '';
        t.loading = 'lazy';
        b.appendChild(t);
        b.addEventListener('click', () => show(n));
        thumbsEl.appendChild(b);
      });

      const multi = images.length > 1;
      prevBtn.hidden = !multi;
      nextBtn.hidden = !multi;

      lb.hidden = false;
      root.classList.add('lb-open');
      if (lenis) lenis.stop();
      index = 0;
      img.src = images[0];
      img.alt = title + ', screen 1 of ' + images.length;
      curEl.textContent = '01';
      thumbsEl.querySelectorAll('button').forEach((b, n) => b.setAttribute('aria-current', n === 0 ? 'true' : 'false'));

      if (animate()) {
        gsap.fromTo(lb, { opacity: 0 }, { opacity: 1, duration: 0.3, ease: 'none' });
        gsap.fromTo(panel, { y: 30, scale: 0.98 }, { y: 0, scale: 1, duration: 0.7, ease: 'expo.out' });
      }
      closeBtn.focus();
    }

    function close() {
      if (lb.hidden) return;
      let finished = false;
      const done = () => {
        if (finished) return;
        finished = true;
        lb.hidden = true;
        root.classList.remove('lb-open');
        if (lenis) lenis.start();
        img.removeAttribute('src');
        if (opener) opener.focus();
      };
      if (animate()) {
        gsap.to(panel, { y: 20, scale: 0.98, duration: 0.25, ease: 'power2.in' });
        gsap.to(lb, { opacity: 0, duration: 0.25, ease: 'none', onComplete: done });
        setTimeout(done, 450); // never leave the page locked if the tween is interrupted
      } else {
        done();
      }
    }

    document.querySelectorAll('[data-gallery]').forEach((btn) => {
      btn.addEventListener('click', () => open(btn));
    });
    closeBtn.addEventListener('click', close);
    prevBtn.addEventListener('click', () => show(index - 1));
    nextBtn.addEventListener('click', () => show(index + 1));
    lb.addEventListener('click', (e) => { if (e.target === lb) close(); });

    document.addEventListener('keydown', (e) => {
      if (lb.hidden) return;
      if (e.key === 'Escape') { e.preventDefault(); close(); }
      else if (e.key === 'ArrowRight' && images.length > 1) show(index + 1);
      else if (e.key === 'ArrowLeft' && images.length > 1) show(index - 1);
      else if (e.key === 'Tab') {
        // keep focus inside the dialog
        const f = [...lb.querySelectorAll('button:not([hidden])')];
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });

    // basic swipe on touch screens
    let x0 = null;
    img.parentElement.addEventListener('touchstart', (e) => { x0 = e.touches[0].clientX; }, { passive: true });
    img.parentElement.addEventListener('touchend', (e) => {
      if (x0 === null || images.length < 2) return;
      const dx = e.changedTouches[0].clientX - x0;
      if (Math.abs(dx) > 40) show(index + (dx < 0 ? 1 : -1));
      x0 = null;
    });
  }
})();
