# PROJECT_LOG

Journal de bord opérationnel et chronologique du projet
`tp-formulaire-inscription-ci-cd` (TP CI/CD Ynov). Complète `git log` avec le
contexte humain : PR mergées, décisions, tags/releases. Ce n'est pas le
`CHANGELOG` (registre des versions publiées) mais l'historique du quotidien.

Ordre antéchronologique (le plus récent en haut).

---

## 2026-05-26 — SemVer & publication npm

Application du cours « Intégration déploiement — Semantic versioning » : ajout du
versioning SemVer et de la publication du package sur le registre npm public, via
le pipeline CI existant. Livré par les PR #7 et #8 (détails ci-dessous).

- **Décisions** :
  - `Même dépôt` — la publication npm est ajoutée au repo existant plutôt que
    dans un nouveau, pour réutiliser le pipeline CI (build/test/Codecov/Pages)
    déjà en place ; alternative « nouveau dépôt » rejetée (duplication, perte
    d'historique).
  - `Package public non scopé` — nom `tp-formulaire-inscription-ci-cd` (vérifié
    libre sur npm) ; `private: true` retiré du `package.json`.
  - `Publication sur push main` — bump + publish déclenchés après build/test sur
    `main`, conformément au support de cours.
  - `Named export` — le point d'entrée expose `export { App }` (le code utilisait
    déjà des exports nommés) plutôt que l'`export default` du support.
  - `Compilation Babel ciblée` — ajout de `@babel/cli` + `@babel/core`
    uniquement ; le JSX est déjà couvert par `@babel/preset-react` de
    `babel.config.js` (pas de plugin JSX redondant).
  - `Compte npm` — publication sous le compte npm `beniot` ; le token sera fourni
    en secret GitHub `NPM_TOKEN` (non versionné).
- **Contenu livré — PR #7 mergée** (`76b8bb0`, squash de `feat/npm-publish`) :
  - Métadonnées de publication dans `package.json` (`description`, `author`,
    `license: MIT`, `repository`, `keywords`, `main: dist/index.js`).
  - Script `build-npm` (`rm -rf dist && npx babel src --out-dir dist
    --copy-files`) ; `/dist` ajouté au `.gitignore`.
  - `export { App }` ajouté à `src/index.js` (point d'entrée du package).
  - `.npmignore` créé : le tarball publié passe de 31 à 9 fichiers (seul le
    `dist/` runtime + `README.md` + `package.json`). Point de vigilance consigné :
    un `.npmignore` remplace `.gitignore` côté npm, d'où la ré-exclusion explicite
    de `/.claude` et des fichiers `.env`.
  - Job `publish` séparé ajouté au workflow
    `.github/workflows/build_test_deploy_react.yml` (`needs: build_test`, sur
    push `main`) : `setup-node` avec `registry-url` (auth npm via `.npmrc`),
    `npm version patch` (+ `[skip ci]`), `npm publish`, push du bump sur `main`
    (`contents: write`). Corrige le snippet du cours (double commit bugué retiré,
    auth registre ajoutée, garde-fou anti-boucle).
- **Revue PR #7** (Copilot, 2 tours, 15 commentaires) : 5 corrigés (LICENSE MIT,
  `concurrency` sur le job publish, doc SemVer, 2 typos), 3 défères justifiés
  (effet de bord de l'entry-point = choix conforme au cours ; `rm -rf` = cible
  Linux/CI ; react en `dependencies` = artefact pédagogique, pas
  `peerDependencies`).
- **PR #8 mergée** (`906200e`, squash de `ci/manual-publish-trigger`) — *ci:
  allow manual publish via workflow_dispatch*. Le squash-merge de #7 n'avait pas
  émis d'event `push` re-déclenchant le workflow → le job `publish` ne tournait
  jamais. Ajout du trigger `workflow_dispatch` + condition `publish` étendue
  (`push || workflow_dispatch`), avec garde `github.ref == 'refs/heads/main'`
  (`083886e`) suite à une revue P1 Copilot + Codex (interdire la publication
  hors `main`).
- **Mise en service de la publication** : token npm **Automation** (compte
  `beniot`) enregistré en secret GitHub `NPM_TOKEN`. Premier essai bloqué en
  `E403` (token initial insuffisant), résolu en régénérant un Classic Automation.
  1ʳᵉ publication déclenchée via push sur `main` (l'API `workflow_dispatch`
  renvoyait `HTTP 500` — incident GitHub Actions `degraded_performance` ce
  jour-là) : le job `publish` exécute `npm version patch` (0.1.0 → 0.1.1) puis
  `npm publish`.

---

## 2026-05-07 — Création du projet et mise en place de la CI/CD

Journée fondatrice : initialisation du projet, chaîne CI/CD complète et
durcissement de la couverture de tests. Entrées rétroactives (premier `PROJECT_LOG`
du projet), condensées à une ligne par PR/jalon.

- **Inception** (`0ce7587`) — commit initial : formulaire d'inscription React
  (Create React App) avec Jest + Testing Library.
- **CI build/test** (`3f7c57e`) — premier workflow GitHub Actions (build + test) ;
  ajustements : `watchAll` désactivé pour la CI (`48be392`), scripts
  `predeploy`/`deploy` rangés dans le bloc `scripts` (`3b5cd5e`).
- **Déploiement GitHub Pages** (`26193f4`) — déploiement après tests ; permissions
  Pages au niveau workflow (`1aff3d5`).
- **Couverture Codecov** (`2ca1692`) — upload de la couverture Jest vers Codecov.
- **Documentation** — installation JSDoc + script de génération (`6d64a58`),
  génération JSDoc avant le build de prod (`8f2c033`), réécriture du README
  (`d254607`).
- **PR #1 mergée** (`93fa3c7`) — `refactor/app-testability` : extraction de
  `validateForm` pour la testabilité (`7a15914`), correctif d'ids manquants dans
  `loadRegistrants` (`ea3729e`), skip du job deploy sur les events `pull_request`
  (`a76e8b2`).
- **PR #2 mergée** (`48be392`→`48f4482`) — tests de rendu initial et du bouton submit.
- **PR #3 mergée** (`78e2a40`) — tests de `validateForm`, réorganisation des suites
  (happy/sad path).
- **PR #4 mergée** (`fdcafdb`) — vérification du rendu des messages d'erreur avec la
  classe d'erreur au submit.
- **PR #5 mergée** (`0c43a3a`) — couverture du parcours de soumission réussie de bout
  en bout.
- **PR #6 mergée** (`0d3bedd`) — comblement des trous de couverture pour atteindre 100 %.
