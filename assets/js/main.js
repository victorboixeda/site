/* Mode sombre.
 * Sans choix enregistré, le site suit le réglage du système. Le bouton enregistre un choix (localStorage),
 * relu dans le <head> de chaque page avant l'affichage : même thème sur toutes les pages, sans flash.
 * Les autres onglets ouverts se mettent à jour aussi (événement storage). */
(function () {
  var root = document.documentElement;
  var media = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;
  var buttons = document.querySelectorAll('[data-theme-toggle]');
  var en = root.lang === 'en'; /* libellés du bouton selon la langue de la page */
  var L = en ? { light: 'Light mode', dark: 'Dark mode' } : { light: 'Mode clair', dark: 'Mode sombre' };

  function isDark() {
    var t = root.getAttribute('data-theme');
    if (t) return t === 'dark';
    return !!(media && media.matches);
  }
  function sync() {
    var dark = isDark();
    buttons.forEach(function (b) {
      b.setAttribute('data-dark', dark ? 'true' : 'false');
      var l = b.querySelector('.theme-l');
      if (l) l.textContent = dark ? L.light : L.dark;
    });
  }
  function apply(t) {
    if (t === 'dark' || t === 'light') root.setAttribute('data-theme', t);
    else root.removeAttribute('data-theme');
    sync();
  }

  buttons.forEach(function (b) {
    b.hidden = false; /* le bouton n'apparaît que si le script tourne */
    b.addEventListener('click', function () {
      var next = isDark() ? 'light' : 'dark';
      apply(next);
      try { localStorage.setItem('theme', next); } catch (e) {}
    });
  });
  if (media) {
    var onChange = function () { sync(); };
    if (media.addEventListener) media.addEventListener('change', onChange);
    else if (media.addListener) media.addListener(onChange);
  }
  window.addEventListener('storage', function (e) {
    if (e.key === 'theme') apply(e.newValue);
  });
  sync();
})();

/* Clics rapides entre deux pages : pendant le fondu, un clic peut tomber sur la page entière
 * et le navigateur la sélectionne en bleu clair (le flash). On bloque seulement cette sélection,
 * jamais le clic : la sélection normale d'un texte reste possible partout. */
document.addEventListener('selectstart', function (e) {
  if (e.target === document.documentElement || document.activeViewTransition) e.preventDefault();
});

/* Apparition au défilement : une seule fois par page (pas de replay en remontant / redescendant).
 * Les images déjà visibles au chargement ne sont jamais cachées : elles s'affichent tout de suite. */
(function () {
  if (!('IntersectionObserver' in window)) return;
  if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      var el = e.target;
      io.unobserve(el);
      el.classList.add('is-in');
      el.addEventListener('transitionend', function done(ev) {
        if (ev.target !== el || ev.propertyName !== 'opacity') return;
        el.removeEventListener('transitionend', done);
        el.classList.remove('reveal', 'is-in');
      });
    });
  }, { rootMargin: '0px 0px -10% 0px' });
  document.querySelectorAll('.frame, .next-card').forEach(function (el) {
    if (el.getBoundingClientRect().top < window.innerHeight) return; /* déjà à l'écran */
    el.classList.add('reveal');
    io.observe(el);
  });
})();

/* Révéler l'e-mail : l'adresse n'existe pas en clair dans le HTML. */
document.querySelectorAll('[data-reveal]').forEach(function (b) {
  b.addEventListener('click', function () {
    var a = b.dataset.u + '@' + b.dataset.d;
    var l = document.createElement('a');
    l.href = 'mailto:' + a;
    l.textContent = a;
    b.replaceWith(l);
    l.focus();
  });
});
/* Révéler le téléphone : même principe, le numéro est assemblé au clic. */
document.querySelectorAll('[data-reveal-tel]').forEach(function (b) {
  b.addEventListener('click', function () {
    var n = b.dataset.a + ' ' + b.dataset.b;
    var l = document.createElement('a');
    l.href = 'tel:+33' + n.replace(/\s/g, '').slice(1);
    /* en anglais : format international (+33 6 …) */
    l.textContent = document.documentElement.lang === 'en' ? '+33 ' + n.slice(1) : n;
    b.replaceWith(l);
    l.focus();
  });
});
/* Vidéo chargée au clic : aucun contenu tiers avant. data-src = URL d'embed sans cookies (youtube-nocookie.com ou Vimeo dnt=1). */
document.querySelectorAll('[data-video]').forEach(function (b) {
  b.addEventListener('click', function () {
    if (!b.dataset.src) return;
    var f = document.createElement('iframe');
    f.src = b.dataset.src;
    f.title = b.dataset.title || (document.documentElement.lang === 'en' ? 'Video' : 'Vidéo');
    f.allow = 'autoplay; encrypted-media; picture-in-picture'; /* autoplay : la vidéo démarre dès ce premier clic */
    f.allowFullscreen = true;
    b.replaceWith(f);
    f.focus();
  });
});
