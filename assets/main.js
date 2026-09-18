/* ==========================================================================
   Éclats et Saveurs — interactions
   1. Menu mobile (hamburger)
   2. Formulaire de contact : validation, envoi Formspree, repli mailto
   ========================================================================== */

(function () {
  "use strict";

  /* ------------------------------------------------------------------------
     CONFIGURATION — les deux seules valeurs à renseigner pour mettre en ligne.
     Voir README.md, section « Brancher le formulaire de contact ».
     ------------------------------------------------------------------------ */

  /* Adresse de réception des réservations (Christelle Yamdjeu, fondatrice).
     Sert au repli mailto et aux messages d'erreur ; doit rester identique à
     l'adresse affichée dans contact.html et dans le pied de page. */
  var CONTACT_EMAIL = "laritaffou@gmail.com";

  /* Adresse à laquelle le formulaire est envoyé. FormSubmit est le service
     retenu : il ne demande aucune création de compte, l'adresse de réception
     est validée une seule fois par un courriel de confirmation.
     Trois autres valeurs sont possibles :
       - ""                            repli mailto : la demande s'ouvre
                                       pré-rédigée dans le logiciel de
                                       messagerie du visiteur ;
       - "https://formspree.io/f/xxx"  endpoint Formspree ;
       - "/"                           site déployé sur Netlify, Netlify Forms
                                       prend le relais grâce aux attributs du
                                       formulaire dans contact.html.
     Voir README, « Brancher le formulaire de contact ». */
  var FORM_ENDPOINT = "https://formsubmit.co/ajax/" + CONTACT_EMAIL;

  /* ======================================================================
     1. Menu mobile
     ====================================================================== */

  function initialiserMenu() {
    var bascule = document.querySelector("[data-bascule-menu]");
    var nav = document.querySelector("[data-nav]");
    if (!bascule || !nav) return;

    /* Doit rester aligné sur le seuil du bloc @media de assets/style.css :
       la navigation bureau complète ne tient pas sous 1024px. */
    var LARGEUR_BUREAU = window.matchMedia("(min-width: 1024px)");

    function ouvrir(estOuvert) {
      nav.hidden = !estOuvert;
      bascule.setAttribute("aria-expanded", String(estOuvert));
      bascule.setAttribute(
        "aria-label",
        estOuvert ? "Fermer le menu de navigation" : "Ouvrir le menu de navigation"
      );
    }

    /* Le menu est replié au chargement en mobile, et toujours déployé (et donc
       hors du contrôle de la bascule) dès 1024px. */
    function synchroniser() {
      if (LARGEUR_BUREAU.matches) {
        nav.hidden = false;
        bascule.setAttribute("aria-expanded", "false");
      } else {
        ouvrir(false);
      }
    }

    bascule.addEventListener("click", function () {
      ouvrir(bascule.getAttribute("aria-expanded") !== "true");
    });

    /* Échap ferme le menu et rend le focus à la bascule. */
    document.addEventListener("keydown", function (evenement) {
      if (evenement.key !== "Escape") return;
      if (LARGEUR_BUREAU.matches) return;
      if (bascule.getAttribute("aria-expanded") !== "true") return;
      ouvrir(false);
      bascule.focus();
    });

    /* Un lien touché au clavier hors du menu ouvert le referme. */
    document.addEventListener("focusin", function (evenement) {
      if (LARGEUR_BUREAU.matches) return;
      if (bascule.getAttribute("aria-expanded") !== "true") return;
      if (nav.contains(evenement.target) || bascule.contains(evenement.target)) return;
      ouvrir(false);
    });

    if (typeof LARGEUR_BUREAU.addEventListener === "function") {
      LARGEUR_BUREAU.addEventListener("change", synchroniser);
    } else if (typeof LARGEUR_BUREAU.addListener === "function") {
      LARGEUR_BUREAU.addListener(synchroniser);
    }

    synchroniser();
  }

  /* ======================================================================
     2. Formulaire de contact
     ====================================================================== */

  var REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  function messagesErreur(champ) {
    var valeur = (champ.value || "").trim();

    if (champ.required && !valeur) {
      return champ.tagName === "SELECT"
        ? "Merci de choisir un service."
        : "Ce champ est obligatoire.";
    }
    if (champ.type === "email" && valeur && !REGEX_EMAIL.test(valeur)) {
      return "Merci de saisir une adresse email valide, par exemple nom@exemple.com.";
    }
    return "";
  }

  function afficherErreur(champ, message) {
    var conteneur = champ.closest(".champ");
    if (!conteneur) return;

    var zone = conteneur.querySelector("[data-erreur]");
    conteneur.classList.toggle("champ--invalide", Boolean(message));
    champ.setAttribute("aria-invalid", message ? "true" : "false");
    if (zone) zone.textContent = message;
  }

  function validerFormulaire(formulaire) {
    var champs = formulaire.querySelectorAll(
      "input:not([name='bot-field']):not([type='hidden']), select, textarea"
    );
    var premierInvalide = null;

    Array.prototype.forEach.call(champs, function (champ) {
      var message = messagesErreur(champ);
      afficherErreur(champ, message);
      if (message && !premierInvalide) premierInvalide = champ;
    });

    if (premierInvalide) {
      premierInvalide.focus();
      return false;
    }
    return true;
  }

  function construireMailto(donnees) {
    var corps = [
      "Nom : " + donnees.nom,
      "Email : " + donnees.email,
      "Téléphone : " + (donnees.telephone || "non renseigné"),
      "Service souhaité : " + donnees.service,
      "Date souhaitée : " + (donnees.date || "non précisée"),
      "",
      "Message :",
      donnees.message
    ].join("\n");

    return (
      "mailto:" + CONTACT_EMAIL +
      "?subject=" + encodeURIComponent("Demande — " + donnees.service + " — " + donnees.nom) +
      "&body=" + encodeURIComponent(corps)
    );
  }

  function initialiserFormulaire() {
    var formulaire = document.querySelector("[data-formulaire-contact]");
    if (!formulaire) return;

    var zoneEtat = formulaire.querySelector("[data-etat]");
    var bouton = formulaire.querySelector("[data-envoyer]");
    var libelleBouton = bouton ? bouton.textContent : "";

    function annoncer(texte, estErreur) {
      if (!zoneEtat) return;
      zoneEtat.textContent = texte;
      zoneEtat.hidden = !texte;
      zoneEtat.classList.toggle("formulaire__message--erreur", Boolean(estErreur));
    }

    /* L'erreur d'un champ disparaît dès qu'il redevient valide. */
    formulaire.addEventListener("input", function (evenement) {
      var champ = evenement.target;
      if (!champ.closest || !champ.closest(".champ")) return;
      if (champ.getAttribute("aria-invalid") !== "true") return;
      if (!messagesErreur(champ)) afficherErreur(champ, "");
    });

    formulaire.addEventListener("submit", function (evenement) {
      evenement.preventDefault();
      annoncer("", false);

      if (!validerFormulaire(formulaire)) {
        annoncer("Le formulaire comporte des champs à corriger.", true);
        return;
      }

      var formData = new FormData(formulaire);
      var donnees = {
        nom: (formData.get("nom") || "").trim(),
        email: (formData.get("email") || "").trim(),
        telephone: (formData.get("telephone") || "").trim(),
        service: (formData.get("service") || "").trim(),
        date: (formData.get("date") || "").trim(),
        message: (formData.get("message") || "").trim()
      };

      /* Repli mailto : aucun endpoint configuré. */
      if (!FORM_ENDPOINT) {
        window.location.assign(construireMailto(donnees));
        annoncer(
          "Votre logiciel de messagerie s'ouvre avec la demande déjà rédigée — " +
          "il ne reste plus qu'à l'envoyer. Si rien ne s'ouvre, écrivez directement à " +
          CONTACT_EMAIL + ".",
          false
        );
        return;
      }

      if (bouton) {
        bouton.disabled = true;
        bouton.textContent = "Envoi en cours…";
      }

      /* Champs de configuration propres à FormSubmit. Ajoutés uniquement pour
         lui, afin de ne pas polluer les envois d'un autre service. Le champ
         « email » du formulaire sert automatiquement d'adresse de réponse. */
      if (/\/\/formsubmit\.co\//.test(FORM_ENDPOINT)) {
        formData.append("_subject", "Demande " + donnees.service + " — " + donnees.nom);
        formData.append("_template", "table");
        formData.append("_captcha", "false");
        /* Reprend le piège à robots sous le nom attendu par FormSubmit, puis
           retire les champs propres à Netlify : FormSubmit recopie tout ce
           qu'il reçoit dans le courriel, et « form-name » comme « bot-field »
           n'apporteraient rien à la lecture. */
        formData.append("_honey", formData.get("bot-field") || "");
        formData.delete("bot-field");
        formData.delete("form-name");
      }

      fetch(FORM_ENDPOINT, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: formData
      })
        .then(function (reponse) {
          /* FormSubmit répond 200 même quand l'adresse de réception n'a pas
             encore été confirmée : le corps de la réponse le signale. Se fier
             au seul code HTTP annoncerait un succès qui n'en est pas un. */
          return reponse
            .json()
            .catch(function () { return null; })
            .then(function (corps) {
              return { ok: reponse.ok, statut: reponse.status, corps: corps };
            });
        })
        .then(function (r) {
          var refuse = r.corps && String(r.corps.success) === "false";
          if (!r.ok || refuse) {
            /* Le détail technique va dans la console, pas sous les yeux du
               visiteur : les messages de ces services sont en anglais. */
            if (window.console && console.warn) {
              console.warn("Envoi du formulaire refusé :", r.statut, r.corps);
            }
            throw new Error("envoi refusé");
          }
          formulaire.reset();
          annoncer(
            "Merci " + donnees.nom + ", votre demande est bien partie. " +
            "Christelle vous répond personnellement sous 24 heures au maximum.",
            false
          );
        })
        .catch(function (erreur) {
          if (window.console && console.warn) console.warn(erreur);
          annoncer(
            "L'envoi n'a pas abouti. Réessayez dans un instant, ou écrivez " +
            "directement à " + CONTACT_EMAIL + " — votre demande sera traitée " +
            "de la même façon.",
            true
          );
        })
        .then(function () {
          if (bouton) {
            bouton.disabled = false;
            bouton.textContent = libelleBouton;
          }
        });
    });
  }

  /* ---------------------------------------------------------------------- */

  function demarrer() {
    initialiserMenu();
    initialiserFormulaire();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", demarrer);
  } else {
    demarrer();
  }
})();
