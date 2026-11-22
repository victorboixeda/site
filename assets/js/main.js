/* Mode sombre.
 * Sans choix enregistré, le site suit le réglage du système. Le bouton enregistre un choix (localStorage),
 * relu dans le <head> de chaque page avant l'affichage : même thème sur toutes les pages, sans flash.
 * Les autres onglets ouverts se mettent à jour aussi (événement storage). */
(function () {
  var root = document.documentElement;
  var media = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;
  var buttons = document.querySelectorAll('[data-theme-toggle]');

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
      if (l) l.textContent = dark ? 'Mode clair' : 'Mode sombre';
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
    l.textContent = n;
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
    f.title = b.dataset.title || 'Vidéo';
    f.allow = 'encrypted-media; picture-in-picture';
    f.allowFullscreen = true;
    b.replaceWith(f);
    f.focus();
  });
});
