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
