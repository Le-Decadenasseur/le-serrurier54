/* Le Serrurier 54 — animations légères : apparition au défilement + chiffres animés */
(function () {
  if (!('IntersectionObserver' in window)) return;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var root = document.documentElement;

  // 1. Apparition au défilement
  if (!reduce) {
    root.classList.add('js-reveal');
    var sel = '.intro, .carte, .guide, .etapes-liste li, .pastille, .service-card, .card, .ville-card, .avis-card, .faq-item, .section-title, .zone-item, .commune-item';
    var els = document.querySelectorAll(sel);
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    els.forEach(function (el, i) {
      el.classList.add('rv');
      el.style.transitionDelay = ((i % 3) * 0.08) + 's';
      io.observe(el);
    });
  }

  // 3. Blocs de texte : alternance de fond + encadré « En bref »
  document.querySelectorAll('.intro').forEach(function (s, i) {
    if (i % 2) s.classList.add('alt');
    s.querySelectorAll('p').forEach(function (p) {
      if (/^\s*En bref/i.test(p.textContent)) p.classList.add('enbref');
    });
  });

  // 4. « Lire la suite » : le texte reste dans la page (lu par Google), seul l'affichage est replié
  document.documentElement.classList.add('js-suite');
  document.querySelectorAll('.intro').forEach(function (sec) {
    var kids = Array.prototype.slice.call(sec.children);
    var firstP = kids.findIndex(function (k) { return k.tagName === 'P'; });
    if (firstP < 0) return;
    var h2 = sec.querySelector('h2');
    if (sec.querySelector('table, .cartes, .guides') || (h2 && /tarif|prix/i.test(h2.textContent))) return;
    var rest = kids.slice(firstP + 1).filter(function (k) { return !k.classList.contains('pastilles'); });
    var len = rest.reduce(function (n, k) { return n + k.textContent.length; }, 0);
    if (len < 220) return;
    var box = document.createElement('div'); box.className = 'suite';
    rest.forEach(function (k) { box.appendChild(k); });
    sec.appendChild(box);
    var b = document.createElement('button'); b.type = 'button'; b.className = 'lire-suite';
    b.setAttribute('aria-expanded', 'false'); b.textContent = 'Lire la suite ▾';
    b.addEventListener('click', function () {
      var o = sec.classList.toggle('ouvert');
      b.setAttribute('aria-expanded', o ? 'true' : 'false');
      b.textContent = o ? 'Réduire ▴' : 'Lire la suite ▾';
    });
    sec.appendChild(b);
  });

  // 2. Chiffres animés (24h, 7j, 61…) — le texte d'origine reste en place sans JS
  var nums = document.querySelectorAll('.stat-num');
  var io2 = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      io2.unobserve(e.target);
      var el = e.target, txt = el.textContent, m = txt.match(/^(\d+)(.*)$/);
      if (!m || +m[1] < 2 || reduce) return;
      var end = +m[1], suffix = m[2], t0 = null, dur = 1200;
      function step(t) {
        if (!t0) t0 = t;
        var p = Math.min((t - t0) / dur, 1), v = Math.round(end * (1 - Math.pow(1 - p, 3)));
        el.textContent = v + suffix;
        if (p < 1) requestAnimationFrame(step); else el.textContent = txt;
      }
      requestAnimationFrame(step);
    });
  }, { threshold: 0.6 });
  nums.forEach(function (n) { io2.observe(n); });
})();
