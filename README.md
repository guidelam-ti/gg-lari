# Éclats et Saveurs — site vitrine

Site statique (HTML5, CSS3, JavaScript natif) présentant les trois pôles d'Éclats
et Saveurs : cuisine, aide à domicile, décoration et événements.

Aucune étape de build, aucune dépendance à installer. Les fichiers du dépôt
*sont* le site : il peut être ouvert en local, déposé sur n'importe quel
hébergement statique, ou déployé par le pipeline GitHub Actions fourni.

## Contenu du dépôt

```
index.html                    Accueil
cuisine.html                  Packs de marmites, cuisine chez le client, courses + cuisine
aide-a-domicile.html          Publics visés, forfaits 3 h / 5 h / 7 h, services proposés
decoration-evenements.html    Forfaits Essentiel / Élégance / Signature, acompte de 30 %
contact.html                  Formulaire de contact et de réservation
assets/style.css              Design system complet (tokens de couleur, typographie, composants)
assets/main.js                Menu mobile, validation et envoi du formulaire
assets/favicon.svg            Favicon (losange or sur indigo, reprise du motif de frise)
assets/img/                   Dossier prévu pour les photos (vide pour l'instant)
.nojekyll                     Désactive Jekyll côté GitHub Pages
.github/workflows/deploy.yml  Vérification puis déploiement sur GitHub Pages
```

## Consulter le site en local

```bash
python3 -m http.server 8000
# puis ouvrir http://localhost:8000
```

Un simple double-clic sur `index.html` fonctionne aussi, mais un serveur local
reproduit plus fidèlement le comportement en ligne.

## Déploiement sur GitHub Pages

Le workflow `.github/workflows/deploy.yml` se déclenche à chaque push sur `main`
ou sur `claude/static-site-github-pages-0hpvzy`, et peut aussi être lancé à la
main depuis l'onglet **Actions** (bouton « Run workflow »).

Il exécute deux tâches :

1. **Vérifier** — présence des 5 pages et de leurs ressources, syntaxe du
   JavaScript, et contrôle que tous les liens et ressources internes existent et
   sont bien en chemin *relatif*.
2. **Déployer** — assemble le site dans `_site/` (en excluant `.git`, `.github`
   et ce README), puis publie via `actions/deploy-pages`.

### Deux réglages à faire une seule fois

Ces deux réglages ne peuvent pas être faits depuis un workflow : le jeton
`GITHUB_TOKEN` n'a pas le droit de créer un site Pages (`Resource not
accessible by integration`). Le workflow le détecte et affiche la marche à
suivre plutôt que d'échouer sans explication.

1. **Source de publication.** Dans **Settings → Pages → Build and deployment →
   Source**, choisir **GitHub Actions**.

2. **Dépôt privé ou public.** GitHub Pages n'est disponible sur un dépôt
   **privé** qu'avec un plan payant (GitHub Pro, Team ou Enterprise). Ce dépôt
   est actuellement privé : en plan gratuit, il faut le passer en public
   (**Settings → General → Danger Zone → Change repository visibility**) pour
   que le déploiement aboutisse.

3. **Relancer le workflow.** Onglet **Actions** → « Déployer le site sur GitHub
   Pages » → **Run workflow**, en sélectionnant la branche.

Note : une poussée effectuée par une application GitHub ne déclenche pas
toujours les workflows sur `push`. En cas de doute, lancer le workflow à la
main depuis l'onglet Actions.

### Adresse du site

Le dépôt s'appelant `gg-lari`, le site sera servi depuis un sous-dossier :

```
https://guidelam-ti.github.io/gg-lari/
```

Tous les chemins du site sont **relatifs** (`assets/style.css`, et non
`/assets/style.css`) : le site fonctionne donc indifféremment à la racine d'un
domaine ou dans ce sous-dossier. Le workflow échoue volontairement si un chemin
absolu est introduit, pour éviter une régression silencieuse.

### Ajouter un domaine personnalisé plus tard

1. Créer un fichier `CNAME` à la racine contenant le domaine, par exemple
   `eclatsetsaveurs.com`.
2. Chez le registraire, créer un `CNAME` de `www` vers
   `guidelam-ti.github.io`, et pour le domaine nu quatre enregistrements `A`
   vers `185.199.108.153`, `185.199.109.153`, `185.199.110.153`,
   `185.199.111.153`.
3. Renseigner le domaine dans **Settings → Pages → Custom domain** et cocher
   **Enforce HTTPS**.

Aucune modification du code n'est nécessaire, les chemins étant déjà relatifs.

## Brancher le formulaire de contact

Le formulaire fonctionne dès maintenant, sans configuration : faute d'endpoint,
il ouvre le logiciel de messagerie du visiteur avec une demande déjà rédigée
(repli `mailto`). Pour recevoir les demandes de façon centralisée, brancher
**Formspree** :

1. Créer un formulaire sur [formspree.io](https://formspree.io) et copier son
   endpoint (de la forme `https://formspree.io/f/xxxxxxxx`).
2. Ouvrir `assets/main.js` et renseigner les deux constantes en haut du fichier :

```js
var FORM_ENDPOINT = "https://formspree.io/f/xxxxxxxx";
var CONTACT_EMAIL = "bonjour@votre-domaine.com";
```

`CONTACT_EMAIL` sert au repli `mailto` et aux messages d'erreur ; il doit
correspondre à l'adresse affichée dans `contact.html` et dans le pied de page.

L'envoi se fait en AJAX : la page ne se recharge pas, et un message de
confirmation ou d'erreur s'affiche sous le bouton.

## Informations encore manquantes

Chaque emplacement concerné est balisé par un commentaire `<!-- TODO: ... -->`
dans le code. Pour les retrouver tous :

```bash
grep -rn "TODO" --include="*.html" --include="*.js" .
```

| À fournir | Où le renseigner |
|---|---|
| Téléphone de contact | pied de page des 5 pages, bloc « Coordonnées » de `contact.html` |
| Email de réception des réservations | mêmes emplacements, plus `CONTACT_EMAIL` dans `assets/main.js` |
| Ville / région desservie | pied de page des 5 pages, bloc « Coordonnées » |
| Liens Facebook / Instagram | pied de page des 5 pages, bloc « Coordonnées » |
| Horaires | pied de page des 5 pages |
| Délai de réponse habituel | `contact.html`, bloc « Coordonnées » (aucun délai n'est affiché pour ne rien promettre) |
| Logo image | remplacer le contenu du lien `.logo` dans les 5 pages par `<img src="assets/img/logo.svg" alt="Éclats et Saveurs">` |
| Photos des plats et des événements | déposer dans `assets/img/`, puis remplacer les commentaires `<!-- TODO: photo -->` de `cuisine.html` et `decoration-evenements.html` |
| Nom de la fondatrice à afficher | facultatif ; emplacement naturel dans le bloc « expérience » de `aide-a-domicile.html` |
| Endpoint Formspree | `FORM_ENDPOINT` dans `assets/main.js` |
| Domaine personnalisé | voir « Ajouter un domaine personnalisé » ci-dessus |

## Design system

Toutes les couleurs et toutes les tailles de texte sont des variables CSS
déclarées dans le bloc `:root` en tête de `assets/style.css`. Modifier une
valeur là met à jour tout le site.

| Rôle | Token | Valeur |
|---|---|---|
| Bandes de marque | `--indigo` | `#1B2A4A` |
| Pied de page | `--indigo-nuit` | `#12203A` |
| Fond principal | `--ivoire` | `#F7F1E6` |
| Texte principal | `--encre` | `#201C1C` |
| Filets, bordures, motif de frise | `--or` | `#C89B3C` |
| Prix et petits libellés sur fond clair | `--or-encre` | `#8A6415` |
| CTA principal « Réserver » | `--hibiscus` | `#A32638` |
| Accent du pôle Cuisine | `--feuille` | `#4C6B4F` |

Deux règles à connaître avant de toucher aux couleurs :

- **Le rouge hibiscus est réservé au CTA principal.** Le disperser ailleurs lui
  fait perdre son impact.
- **L'or `#C89B3C` ne doit jamais porter du texte sur fond ivoire** : le
  contraste n'y est que de 2,28:1, très en dessous du minimum WCAG AA de 4,5:1.
  C'est pour cela que `--or-encre` (`#8A6415`, 4,77:1) existe et sert aux prix.
  L'or reste en revanche parfaitement lisible sur fond indigo (5,56:1).

Contrastes mesurés sur les autres combinaisons utilisées : encre sur ivoire
15,0:1 ; ivoire sur indigo 12,7:1 ; hibiscus sur ivoire 6,5:1 ; ivoire sur
hibiscus 6,5:1 ; vert feuille sur ivoire 5,3:1 ; texte secondaire sur ivoire
7,0:1. Toutes passent le niveau AA.

Le bouton « Réserver » posé sur une bande indigo reçoit un filet or : hibiscus
sur indigo ne fait que 1,96:1, en dessous du minimum de 3:1 exigé pour le
contour d'un composant d'interface.

**Typographie.** `Fraunces` (serif variable, axes `opsz`, `SOFT` et `WONK`) pour
les titres, `Work Sans` pour le texte courant, toutes deux chargées depuis Google
Fonts avec une pile de repli système. Les prix utilisent
`font-variant-numeric: tabular-nums` pour rester alignés en colonne.

## Notes de maintenance

- **L'en-tête et le pied de page sont dupliqués dans les 5 pages**, le site
  n'ayant volontairement aucune étape de build. Ils sont encadrés par les
  commentaires `<!-- EN-TÊTE PARTAGÉ -->` et `<!-- PIED DE PAGE PARTAGÉ -->` :
  toute modification de la navigation doit être reportée dans les 5 fichiers.
- **Les tableaux de tarifs passent en liste empilée sous 560 px.** Chaque
  cellule porte un attribut `data-etiquette` qui reprend l'intitulé de sa
  colonne et s'affiche à sa gauche sur petit écran. Ajouter une ligne à un
  tableau implique de renseigner cet attribut.
- **Une seule animation par page**, l'apparition du héros au chargement, désactivée
  si le visiteur a demandé moins d'animations (`prefers-reduced-motion`).
- **Aucun tarif ne doit être inventé.** Tous ceux affichés proviennent du
  document fourni par la cliente.
