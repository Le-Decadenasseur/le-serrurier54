/* Le Serrurier 54 — animations légères : apparition au défilement + chiffres animés */
(function () {
  if (!('IntersectionObserver' in window)) return;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var root = document.documentElement;

  // 1. Apparition au défilement
  if (!reduce) {
    root.classList.add('js-reveal');
    var sel = '.service-card, .card, .ville-card, .avis-card, .faq-item, .section-title, .zone-item, .commune-item';
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
