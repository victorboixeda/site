/* boixeda.com : comportements partagés (vanilla, sans dépendance) */
(function () {
  "use strict";

  /* 1. E-mail révélé au clic (jamais écrit en clair dans le HTML) */
  document.querySelectorAll("[data-revele]").forEach(function (bouton) {
    bouton.addEventListener("click", function () {
      var adresse = bouton.dataset.a + "@" + bouton.dataset.b;
      var lien = document.createElement("a");
      lien.href = "mailto:" + adresse;
      lien.textContent = adresse;
      lien.className = "lien-mail";
      bouton.replaceWith(lien);
      lien.focus();
    });
  });

  /* 2. Vidéo chargée au clic (YouTube sans cookies ou Vimeo) */
  document.querySelectorAll(".video[data-embed]").forEach(function (bloc) {
    var bouton = bloc.querySelector(".video-bouton");
    if (!bouton) return;
    bouton.addEventListener("click", function () {
      var src = bloc.dataset.embed;
      if (!/^https:\/\//.test(src)) return; /* placeholder : rien ne se charge */
      var iframe = document.createElement("iframe");
      iframe.src = src;
      iframe.title = bloc.dataset.titre || "Vidéo";
      iframe.allow = "fullscreen; picture-in-picture";
      iframe.allowFullscreen = true;
      bouton.replaceWith(iframe);
      iframe.focus();
    });
  });

  /* 3. Formulaire : honeypot + confirmation avant envoi */
  document.querySelectorAll("form[data-confirme]").forEach(function (form) {
    var dialogue = document.getElementById(form.dataset.confirme);
    form.addEventListener("submit", function (e) {
      var piege = form.querySelector(".piege input");
      if (piege && piege.value) { e.preventDefault(); return; } /* robot */
      if (form.dataset.ok === "1" || !dialogue || !dialogue.showModal) return;
      e.preventDefault();
      if (!form.reportValidity()) return;
      dialogue.showModal();
    });
    if (!dialogue) return;
    dialogue.querySelector("[data-oui]").addEventListener("click", function () {
      dialogue.close();
      form.dataset.ok = "1";
      form.requestSubmit();
    });
    dialogue.querySelector("[data-non]").addEventListener("click", function () {
      dialogue.close();
    });
  });
})();