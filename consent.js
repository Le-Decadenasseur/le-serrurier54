/* Le Serrurier 54 — bandeau de consentement + Google Analytics 4
   À inclure sur CHAQUE page : <script src="/consent.js" defer></script>
   GA4 ne se charge qu'après un clic sur « Accepter ». */
(function () {
  var GA_ID = 'G-JNXT3T16XE';
  var KEY = 'cookie-consent';

  function getChoice() {
    try { return localStorage.getItem(KEY); } catch (e) { return null; }
  }
  function setChoice(v) {
    try { localStorage.setItem(KEY, v); } catch (e) {}
  }

  function loadGA() {
    if (window.__gaLoaded) return;
    window.__gaLoaded = true;
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', GA_ID, { anonymize_ip: true });
  }

  // Conversion : clic sur un numéro de téléphone (si GA4 est actif)
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href^="tel:"]');
    if (a && window.gtag) {
      window.gtag('event', 'phone_call', { page_path: location.pathname });
    }
  });

  function injectStyles() {
    var css = '#cookie-banner{position:fixed;left:0;right:0;bottom:0;z-index:1000;background:#1a2e4a;color:#fff;' +
      'padding:16px 20px;font:0.92rem/1.5 Arial,sans-serif;box-shadow:0 -4px 20px rgba(0,0,0,.25)}' +
      '#cookie-banner .cb-inner{max-width:900px;margin:0 auto;display:flex;gap:16px;align-items:center;flex-wrap:wrap}' +
      '#cookie-banner p{flex:1 1 320px;margin:0}' +
      '#cookie-banner a{color:#c9a84c}' +
      '#cookie-banner .cb-btns{display:flex;gap:10px}' +
      '#cookie-banner button{font:700 0.9rem Arial,sans-serif;padding:10px 22px;border-radius:24px;border:2px solid #fff;' +
      'background:transparent;color:#fff;cursor:pointer}' +
      '#cookie-banner button:focus-visible{outline:3px solid #c9a84c;outline-offset:2px}' +
      '#cookie-banner button.cb-accept{background:#fff;color:#1a2e4a}';
    var st = document.createElement('style');
    st.textContent = css;
    document.head.appendChild(st);
  }

  function showBanner() {
    if (document.getElementById('cookie-banner')) return;
    var b = document.createElement('div');
    b.id = 'cookie-banner';
    b.setAttribute('role', 'dialog');
    b.setAttribute('aria-label', 'Choix sur les cookies');
    b.innerHTML =
      '<div class="cb-inner">' +
      '<p>Ce site utilise Google Analytics pour mesurer sa fréquentation. Vous pouvez accepter ou refuser ces cookies. ' +
      '<a href="/mentions-legales.html#cookies">En savoir plus</a></p>' +
      '<div class="cb-btns">' +
      '<button type="button" class="cb-refuse">Refuser</button>' +
      '<button type="button" class="cb-accept">Accepter</button>' +
      '</div></div>';
    document.body.appendChild(b);
    b.querySelector('.cb-accept').addEventListener('click', function () {
      setChoice('accepted'); loadGA(); b.remove();
    });
    b.querySelector('.cb-refuse').addEventListener('click', function () {
      setChoice('refused'); b.remove();
    });
  }

  function init() {
    injectStyles();
    var c = getChoice();
    if (c === 'accepted') loadGA();
    else if (c !== 'refused') showBanner();

    // Lien « Gérer les cookies » (footer) : rouvre le bandeau
    document.addEventListener('click', function (e) {
      var l = e.target.closest && e.target.closest('#cookie-settings');
      if (l) { e.preventDefault(); showBanner(); }
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
