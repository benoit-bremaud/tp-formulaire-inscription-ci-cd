# PROJECT_LOG

Journal de bord opérationnel et chronologique du projet
`tp-formulaire-inscription-ci-cd` (TP CI/CD Ynov). Complète `git log` avec le
contexte humain : PR mergées, décisions, tags/releases. Ce n'est pas le
`CHANGELOG` (registre des versions publiées) mais l'historique du quotidien.

Ordre antéchronologique (le plus récent en haut).

---

## 2026-06-17 — Tests E2E Cypress, intégration API mockée & corrections TP

Grosse journée : tests de bout en bout, bascule du `localStorage` vers une API
tierce testée par mocks, puis corrections issues du retour de notation du TP.

- **PR #12 mergée** (`1345de1`, squash de `feat/cypress-e2e`) — *test(e2e): add
  Cypress end-to-end tests*. Cypress installé (scripts `cypress:open` /
  `cypress:run`), `cypress.config.js` (`baseUrl`, `allowCypressEnv: false`),
  3 specs dans `cypress/e2e/inscription.cy.js` (page d'accueil, soumission valide
  = +1 inscrit, soumission invalide = aucun ajout) + workflow
  `.github/workflows/e2e-cypress.yml` (`cypress-io/github-action@v6`). Aucune
  modif du code applicatif. → release **0.2.3** (`652199e`).
- **PR #13 mergée** (`bf42c04`, squash de `feat/integration-mocks`) — *feat(app):
  consume a third-party API with mocked integration tests*. Bascule du
  `localStorage` vers une API tierce : appels isolés dans `src/api.js`
  (`fetchRegistrants` / `createRegistrant`, axios), config env Jest via
  `.jest/setEnvVars.js` + `transformIgnorePatterns` pour axios, `src/api.test.js`
  (mocks axios succès/erreur, GET/POST), `App.js` migré (compteur au montage, POST
  au submit, gestion d'erreur réseau), e2e Cypress adaptés avec `cy.intercept`,
  `REACT_APP_API_URL` (jsonplaceholder) dans `.env.{development,production,example}`.
  31 tests, 100 % de couverture. → release **0.2.4** (`27b7e6e`).
- **PR #14 mergée** (`1765b04`, squash de `fix/formulaire-date-aberrante-jsdoc`) —
  *fix(formulaire): reject aberrant birth dates and document App component*.
  Corrige deux points du retour de notation (UT 4,5/5, doc 4/5) :
  - Borne d'âge supérieure : nouveau `isPlausibleBirthDate` (âge dans
    `[MIN_AGE=18, MAX_AGE=120]`) remplace `isAdult` dans `validateForm` → une date
    aberrante type `0001-01-01` (âge calculé > 2000) est désormais rejetée ; le
    bloc de tests `edge cases` (jusque-là vide) est rempli (0001-01-01, date
    future, bornes 18/120).
  - JSDoc ajoutée au composant `App` et aux constantes `EMPTY_FORM` /
    `ERROR_MESSAGES`, pour que la doc générée couvre le composant principal (les
    `validators.js` étaient déjà documentés).
  - Nettoyage Sonar : `TypeError` + `Number.isNaN` dans `calculateAge`.
  38 tests, 100 % de couverture. → release patch **0.2.5** *en attente* :
  déclenchée par le job `publish` sur le merge `1765b04` ; le commit
  `chore(release): 0.2.5` et le tag `v0.2.5` seront ajoutés ici une fois publiés.

---

## 2026-06-16 — Conteneurisation Docker & pipeline CI

- **PR #11 mergée** (`e649fcb`, squash de `feat/docker-compose-stack`) —
  *feat(docker): docker-compose stack + CI pipeline*. TP Docker sous
  `docker-mysql/` : `docker-compose.yml` (MySQL seedé par scripts SQL init,
  backend FastAPI, Adminer, frontend React) avec healthchecks sur les 4 services
  et `depends_on: condition: service_healthy`. Workflow
  `.github/workflows/docker-pipeline.yml` : `test-docker` (`docker compose up -d
  --build --wait` + assertions `docker inspect ... | jq -e`) et `build-docker`
  (publication `beniot/ynov-ci-backend:latest` et `beniot/ynov-ci-frontend:latest`
  sur Docker Hub, sur push uniquement, `needs: test-docker`). `.env` gitignored,
  `.env.example` versionné. Limitation connue : image frontend orientée dev (code
  monté en volume, pas de `CMD`) — build/push OK mais pas exécutable seule (image
  prod multi-stage + nginx = suite). → release **0.2.2** (`f4af02c`).

---

## 2026-05-26 (suite) — Lien doc in-app, niveau de release & toast d'erreur

- **PR #9 mergée** (`0971027`, squash de `feat/release-level-and-docs-link`) —
  *feat: in-app docs link and selectable release type*. (1) Lien footer vers la
  doc publiée (`/docs`, site JSDoc dont la home est le README), couvert par un
  test ; (2) input `workflow_dispatch` `release_type` (patch/minor/major, défaut
  patch) pour publier aussi des releases minor/major (un simple push `main` reste
  un patch). → releases **0.1.1** (`736073b`) puis **0.2.0** (`eebfa09`, 1er bump
  minor via le nouveau `release_type`).
- **PR #10 mergée** (`75f83fc`, squash de `feat/error-toast`) — *feat(app): error
  toast on invalid submit*. Toast d'erreur rouge (`toast--error`, `role=alert`,
  auto-hide `TOAST_DURATION_MS`) au submit invalide, exclusif du toast de succès,
  exigé par le sujet ; variante CSS + test dédié. 27 tests, 100 % de couverture.
  → release **0.2.1** (`4ebb960`).

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
