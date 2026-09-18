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
assets/img/logo.svg           Signe de la marque, associé au nom dans l'en-tête
assets/img/illustration-*.svg Illustrations de marque, en attente de vraies photos
.nojekyll                     Désactive Jekyll côté GitHub Pages

.github/workflows/
  deploy.yml                  Vérification, puis déploiement sur GitHub Pages
  deploy-netlify.yml          Déploiement sur Netlify (ignoré sans ses secrets)
  deploy-cloudflare.yml       Déploiement sur Cloudflare Pages (idem)
```

## Consulter le site en local

```bash
python3 -m http.server 8000
# puis ouvrir http://localhost:8000
```

Un simple double-clic sur `index.html` fonctionne aussi, mais un serveur local
reproduit plus fidèlement le comportement en ligne.

## Où héberger le site

**GitHub Pages a été retenu**, avec le dépôt rendu public. C'est l'option la
plus simple et elle ne coûte rien : le code d'un site vitrine n'a rien de
confidentiel. Le workflow `deploy.yml` s'en charge à chaque push sur `main`.

Deux workflows alternatifs restent dans le dépôt, en **lancement manuel
uniquement** (Actions → « Run workflow »), au cas où l'un devienne préférable :

| Hébergeur | Dépôt privé en gratuit | Formulaire inclus | Workflow |
|---|---|---|---|
| **GitHub Pages** (retenu) | non, dépôt public requis | non | `deploy.yml` |
| Netlify | oui | **oui**, Netlify Forms | `deploy-netlify.yml` |
| Cloudflare Pages | oui | non | `deploy-cloudflare.yml` |

L'argument en faveur de Netlify serait **Netlify Forms** : les demandes du
formulaire arriveraient par courriel sans aucun service tiers. `contact.html`
porte déjà les attributs nécessaires, inertes ailleurs. Cloudflare Pages
offrirait une bande passante illimitée et un réseau plus rapide, mais sans
gestion de formulaire.

Deux options volontairement écartées :

- **Vercel** — techniquement excellent, mais son offre gratuite (« Hobby ») est
  réservée aux projets **non commerciaux**. Éclats et Saveurs étant une
  entreprise, l'utiliser sur ce plan irait à l'encontre de ses conditions.
- **AWS S3 + CloudFront** — puissant et bon marché, mais sans offre gratuite
  permanente, et la configuration initiale est disproportionnée pour cinq pages.

### Si l'on passait à Netlify

1. Créer un site vide sur [netlify.com](https://www.netlify.com), relever le
   **Site ID** (Site configuration → Site details) et créer un jeton
   (User settings → Applications → Personal access tokens).
2. Ajouter les secrets `NETLIFY_AUTH_TOKEN` et `NETLIFY_SITE_ID` dans
   Settings → Secrets and variables → Actions.
3. Lancer `deploy-netlify.yml` depuis l'onglet Actions.
4. Activer la notification par courriel (Site configuration → Forms → Form
   notifications) et mettre `FORM_ENDPOINT = "/"` dans `assets/main.js`.

### Si l'on passait à Cloudflare Pages

Relever l'**Account ID** sur le tableau de bord, créer un jeton d'API avec la
permission **Cloudflare Pages — Edit**, ajouter les secrets
`CLOUDFLARE_API_TOKEN` et `CLOUDFLARE_ACCOUNT_ID`, puis lancer
`deploy-cloudflare.yml`. La variable `CLOUDFLARE_PROJECT_NAME` permet de changer
le nom du projet, qui vaut `eclats-et-saveurs` par défaut.

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

### Les deux réglages initiaux (déjà faits)

Ces deux réglages ont été effectués : le dépôt est public et Pages publie
depuis GitHub Actions. Ils sont conservés ici pour mémoire, car ils ne peuvent
pas être faits depuis un workflow — le jeton `GITHUB_TOKEN` n'a pas le droit de
créer un site Pages (`Resource not accessible by integration`). Le workflow le
détecte et affiche la marche à suivre plutôt que d'échouer sans explication.

1. **Source de publication.** Dans **Settings → Pages → Build and deployment →
   Source**, choisir **GitHub Actions**.

2. **Dépôt public.** GitHub Pages n'est disponible sur un dépôt privé qu'avec
   un plan payant. Le dépôt doit donc être public :
   **Settings → General → Danger Zone → Change repository visibility →
   Change to public**. L'historique git a été vérifié au préalable : il ne
   contient que les 19 fichiers du site, aucun jeton ni clé, et les adresses
   des commits sont déjà anonymisées.

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

## Le formulaire de contact

Le formulaire est branché sur **FormSubmit**, choisi parce qu'il ne demande
aucune création de compte : l'adresse de réception est validée une seule fois
par un courriel de confirmation. L'endpoint est construit dans
`assets/main.js` à partir de `CONTACT_EMAIL` :

```js
var CONTACT_EMAIL  = "laritaffou@gmail.com";
var FORM_ENDPOINT  = "https://formsubmit.co/ajax/" + CONTACT_EMAIL;
```

### Une activation à faire une seule fois

FormSubmit n'envoie son courriel de confirmation qu'**au premier envoi du
formulaire**. Il faut donc, dès la mise en ligne :

1. Ouvrir la page Contact du site publié et envoyer une demande de test.
2. Christelle reçoit un courriel de FormSubmit et clique sur le lien
   d'activation.
3. À partir de là, chaque demande arrive dans sa boîte.

**À faire avant de communiquer l'adresse du site.** Tant que l'activation n'a
pas eu lieu, le formulaire affiche un message d'échec invitant à écrire
directement à Christelle — le visiteur n'est donc jamais laissé sans solution,
mais sa demande n'arrive pas par le formulaire.

### Ce que reçoit Christelle

Le courriel est mis en forme en tableau (`_template: table`) et son objet
reprend le service et le nom du demandeur, par exemple
« Demande Décoration & Événements — Aminata Diallo ». L'adresse du visiteur
sert d'adresse de réponse : il suffit de répondre au courriel.

Les champs propres à Netlify (`form-name`, `bot-field`) sont retirés avant
l'envoi, FormSubmit recopiant dans le courriel tout ce qu'il reçoit. Le piège à
robots est transmis sous le nom `_honey` attendu par le service.

### Comportement en cas de problème

FormSubmit répond `HTTP 200` même lorsque l'adresse n'est pas encore confirmée,
en signalant le refus dans le corps de la réponse. Le code lit donc le corps et
pas seulement le code HTTP : sans cela, le visiteur verrait un faux message de
succès. Les quatre cas — envoi accepté, adresse non confirmée, erreur serveur,
connexion coupée — sont vérifiés au navigateur avec des réponses simulées.

En cas d'échec, le formulaire n'est pas vidé, le bouton est réactivé, et le
message invite à écrire directement à Christelle. Le détail technique part dans
la console du navigateur, pas sous les yeux du visiteur : les messages de ces
services sont en anglais.

### Changer de service

Trois autres valeurs sont possibles pour `FORM_ENDPOINT` :

| Valeur | Effet |
|---|---|
| `""` | repli `mailto` : la demande s'ouvre pré-rédigée dans le logiciel de messagerie du visiteur |
| `"https://formspree.io/f/xxxxxxxx"` | Formspree, 50 envois par mois en gratuit, compte requis |
| `"/"` | site déployé sur Netlify : Netlify Forms prend le relais grâce aux attributs déjà présents dans `contact.html` |

## Informations encore manquantes

Chaque emplacement concerné est balisé par un commentaire `<!-- TODO: ... -->`
dans le code. Pour les retrouver tous :

```bash
grep -rn "TODO" --include="*.html" --include="*.js" .
```

| À fournir | Où le renseigner |
|---|---|
| Liens Facebook / Instagram | pied de page des 5 pages, bloc « Coordonnées » de `contact.html` |
| Photos réelles des plats et des événements | déposer dans `assets/img/`, puis remplacer les `src` des `<img>` de la galerie dans `cuisine.html` et `decoration-evenements.html` |
| Horaires d'ouverture | non affichés pour l'instant ; à ajouter au pied de page si utile |
| Domaine personnalisé | voir « Ajouter un domaine personnalisé » ci-dessus |

Déjà renseigné : adresse de réception `laritaffou@gmail.com` (Christelle
Yamdjeu, fondatrice), zone desservie Montréal (Canada), délai de réponse annoncé
de 24 heures au maximum, formulaire branché sur FormSubmit. Aucun numéro de
téléphone n'est affiché, conformément à la demande.

**Action restante côté Christelle :** envoyer une demande de test depuis le site
publié et cliquer sur le lien d'activation de FormSubmit. Voir « Le formulaire
de contact » ci-dessus.

> L'adresse de Christelle apparaît en clair dans le code source des pages, ce
> qui l'expose aux robots collecteurs de courriels. Une fois le formulaire
> branché sur Netlify Forms ou Formspree, on peut retirer les liens `mailto:`
> du pied de page et de `contact.html` et ne laisser que le formulaire.

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

## Logo et illustrations

**Le logo** est un verrouillage en deux parties : le signe `assets/img/logo.svg`
et le nom composé en Fraunces directement dans le HTML. Garder le nom en texte
vivant plutôt qu'en image le rend sélectionnable, lisible par les lecteurs
d'écran et net à toutes les résolutions. Le signe reprend le losange de la frise
textile qui rythme le site : un losange évidé, quatre éclats sur les axes, un
cœur plein. Il reste lisible jusqu'à 16 px et fonctionne sur fond ivoire comme
sur fond indigo. `assets/favicon.svg` en est la version simplifiée, sans les
éclats, posée sur un carré indigo.

**Les illustrations** `assets/img/illustration-*.svg` sont des dessins
vectoriels, pas des photographies. Elles n'utilisent que les couleurs de la
marque, ce qui les rend volontairement graphiques plutôt que réalistes : elles
tiennent la place de vraies photos sans prétendre en être.

Pour les remplacer par de vraies photos, il suffit de déposer les fichiers dans
`assets/img/` et de changer les `src` des `<img>` concernées. Le conteneur
impose un carré avec `aspect-ratio: 1` et `object-fit: cover` : une photo de
n'importe quel format se recadre proprement, sans toucher au CSS. Penser à
réécrire les `alt`, qui décrivent aujourd'hui les illustrations.

Pour un traiteur, de vraies photos des plats de Christelle convertiront
nettement mieux que n'importe quelle illustration : c'est le remplacement le
plus rentable à faire sur ce site.

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
