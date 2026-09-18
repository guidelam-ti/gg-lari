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

Trois pipelines sont fournis dans `.github/workflows/`. Ils déploient tous
exactement le même dossier ; il suffit d'en choisir un. Ceux dont les secrets
ne sont pas renseignés se terminent sans rien faire, sans faire échouer la
suite — on peut donc les laisser en place.

| Hébergeur | Dépôt privé en gratuit | Formulaire inclus | Workflow |
|---|---|---|---|
| **Netlify** | oui | **oui**, Netlify Forms | `deploy-netlify.yml` |
| **Cloudflare Pages** | oui | non | `deploy-cloudflare.yml` |
| **GitHub Pages** | non, plan payant requis | non | `deploy.yml` |

**Recommandation : Netlify.** C'est le seul des trois qui règle les deux
problèmes d'un coup. Il accepte un dépôt privé sur l'offre gratuite, ce qui
évite de rendre le code public, et **Netlify Forms** reçoit les demandes du
formulaire et les transfère par courriel — plus besoin de Formspree ni d'aucun
autre service. L'offre gratuite couvre 100 envois de formulaire par mois et
100 Go de bande passante, très au-delà des besoins d'un site vitrine.

**Cloudflare Pages** est le choix à faire si la vitesse d'affichage prime : bande
passante illimitée, réseau très rapide, domaine personnalisé et certificat
gratuits. Mais il ne gère pas les formulaires, il faut donc garder Formspree à
côté.

**GitHub Pages** reste parfaitement valable à une condition : rendre le dépôt
public. Le site est une vitrine, son code n'a rien de confidentiel, et cela ne
coûte rien. C'est l'option la plus simple si vous ne voulez pas créer de compte
ailleurs.

Deux options volontairement écartées :

- **Vercel** — techniquement excellent, mais son offre gratuite (« Hobby ») est
  réservée aux projets **non commerciaux**. Éclats et Saveurs étant une
  entreprise, l'utiliser sur ce plan irait à l'encontre de ses conditions.
- **AWS S3 + CloudFront** — puissant et bon marché, mais il n'y a pas d'offre
  gratuite permanente et la configuration initiale (bucket, distribution,
  certificat, DNS) est disproportionnée pour cinq pages statiques.

### Mettre en route Netlify

1. Créer un compte sur [netlify.com](https://www.netlify.com) et y créer un site
   vide (**Add new site → Deploy manually**, en déposant n'importe quoi ; le
   workflow écrasera le contenu au premier déploiement).
2. Relever le **Site ID** dans **Site configuration → Site details**.
3. Créer un jeton dans **User settings → Applications → Personal access tokens**.
4. Dans GitHub, **Settings → Secrets and variables → Actions → New repository
   secret**, ajouter `NETLIFY_AUTH_TOKEN` et `NETLIFY_SITE_ID`.
5. Pousser, ou lancer le workflow à la main depuis l'onglet **Actions**.

Pour recevoir les demandes par courriel : **Site configuration → Forms →
Form notifications → Add notification → Email notification**, et indiquer
l'adresse de Christelle. Puis mettre `FORM_ENDPOINT = "/"` dans
`assets/main.js`.

### Mettre en route Cloudflare Pages

1. Créer un compte sur [cloudflare.com](https://dash.cloudflare.com) et relever
   l'**Account ID** sur le tableau de bord.
2. Créer un jeton d'API avec la permission **Cloudflare Pages — Edit**.
3. Ajouter les secrets `CLOUDFLARE_API_TOKEN` et `CLOUDFLARE_ACCOUNT_ID`.
4. Facultatif : la variable `CLOUDFLARE_PROJECT_NAME` change le nom du projet,
   qui vaut `eclats-et-saveurs` par défaut.

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
(repli `mailto` vers l'adresse de Christelle). C'est fonctionnel, mais cela
dépend du logiciel de messagerie du visiteur et ne laisse aucune trace côté
Éclats et Saveurs. Trois façons de faire mieux, au choix.

La constante à modifier est la même dans les trois cas, en haut de
`assets/main.js` :

```js
var FORM_ENDPOINT = "";
```

### Option A — Netlify Forms (recommandée si le site est sur Netlify)

Aucun service tiers, aucun compte de plus. `contact.html` porte déjà les
attributs nécessaires (`data-netlify`, `form-name`, piège à robots) ; ils sont
inertes sur les autres hébergeurs. Il suffit de mettre :

```js
var FORM_ENDPOINT = "/";
```

puis d'activer la notification par courriel dans l'interface Netlify.

### Option B — Formspree

1. Créer un formulaire sur [formspree.io](https://formspree.io) avec l'adresse
   de réception.
2. Copier l'endpoint, de la forme `https://formspree.io/f/xxxxxxxx`.
3. Le coller dans `FORM_ENDPOINT`.

L'offre gratuite couvre 50 envois par mois.

### Option C — FormSubmit, sans création de compte

[FormSubmit](https://formsubmit.co) ne demande aucune inscription : l'endpoint
est construit à partir de l'adresse de réception, et un courriel de
confirmation valide l'activation au premier envoi.

```js
var FORM_ENDPOINT = "https://formsubmit.co/ajax/laritaffou@gmail.com";
```

C'est la voie la plus rapide, mais l'adresse apparaît alors en clair dans le
code source du site. FormSubmit fournit un identifiant anonyme après le premier
envoi : il est préférable de l'utiliser à la place de l'adresse.

## Informations encore manquantes

Chaque emplacement concerné est balisé par un commentaire `<!-- TODO: ... -->`
dans le code. Pour les retrouver tous :

```bash
grep -rn "TODO" --include="*.html" --include="*.js" .
```

| À fournir | Où le renseigner |
|---|---|
| Liens Facebook / Instagram | pied de page des 5 pages, bloc « Coordonnées » de `contact.html` |
| Endpoint du formulaire | `FORM_ENDPOINT` dans `assets/main.js` — voir la section ci-dessus |
| Photos réelles des plats et des événements | déposer dans `assets/img/`, puis remplacer les `src` des `<img>` de la galerie dans `cuisine.html` et `decoration-evenements.html` |
| Horaires d'ouverture | non affichés pour l'instant ; à ajouter au pied de page si utile |
| Domaine personnalisé | voir « Ajouter un domaine personnalisé » ci-dessus |

Déjà renseigné : adresse de réception `laritaffou@gmail.com` (Christelle
Yamdjeu, fondatrice), zone desservie Montréal (Canada), délai de réponse annoncé
de 24 heures au maximum. Aucun numéro de téléphone n'est affiché, conformément
à la demande.

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
