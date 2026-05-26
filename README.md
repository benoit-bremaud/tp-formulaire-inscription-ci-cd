# TP Formulaire d'inscription CI/CD

[![Build](https://github.com/benoit-bremaud/tp-formulaire-inscription-ci-cd/actions/workflows/build_test_deploy_react.yml/badge.svg)](https://github.com/benoit-bremaud/tp-formulaire-inscription-ci-cd/actions/workflows/build_test_deploy_react.yml)
[![codecov](https://codecov.io/gh/benoit-bremaud/tp-formulaire-inscription-ci-cd/graph/badge.svg)](https://codecov.io/gh/benoit-bremaud/tp-formulaire-inscription-ci-cd)

A React signup form built as a teaching project for the **Ynov M1 CI/CD**
course. The repository demonstrates an end-to-end pipeline: Jest tests,
coverage reporting to Codecov, JSDoc generation, automated deployment to
GitHub Pages, and **automated Semantic Versioning + npm publishing** via GitHub
Actions.

**Live demo**: <https://benoit-bremaud.github.io/tp-formulaire-inscription-ci-cd/>

## Stack

- React 19 (Create React App)
- Jest + Testing Library (unit and component tests)
- JSDoc (generated documentation)
- GitHub Actions (CI/CD)
- Codecov (coverage tracking)
- GitHub Pages (hosting)
- npm registry (package publishing)

## Prerequisites

- Node.js 20.x (LTS)
- npm 10+

## Installation

```bash
git clone git@github.com:benoit-bremaud/tp-formulaire-inscription-ci-cd.git
cd tp-formulaire-inscription-ci-cd
npm ci
```

## Available scripts

| Command | What it does |
| --- | --- |
| `npm start` | Run the dev server on <http://localhost:3000> |
| `npm test` | Run the Jest test suite once with coverage report |
| `npm run build` | Produce a production bundle in `build/` |
| `npm run jsdoc` | Generate the technical documentation in `docs/` |
| `npm run build-npm` | Transpile `src/` to `dist/` with Babel (the publishable package) |
| `npm run deploy` | Manually publish the build to GitHub Pages (legacy, CI handles this automatically) |

## CI/CD pipeline

Every push to `main` triggers the
[`Build, Test and Deploy React Application`](.github/workflows/build_test_deploy_react.yml)
workflow:

1. **build_test**: installs dependencies, runs the build and the test suite,
   uploads coverage to Codecov, and packages the build folder as a Pages artifact.
2. **deploy**: runs only if `build_test` succeeds; publishes the artifact to
   GitHub Pages.
3. **publish**: runs only if `build_test` succeeds; transpiles `src/` to `dist/`,
   bumps the patch version (`npm version patch`), and publishes the package to
   the npm registry. The version bump is committed back to `main` with a
   `[skip ci]` marker so it does not re-trigger the pipeline.

The deployment URL is exposed in the workflow run summary under the
`github-pages` environment. Publishing requires the `NPM_TOKEN` repository
secret (an npm **Automation** access token).

## Use as an npm package

The compiled component is published to the public npm registry:

```bash
npm install tp-formulaire-inscription-ci-cd
```

```jsx
import { App } from 'tp-formulaire-inscription-ci-cd';
```

### Versioning (SemVer)

Versions follow [Semantic Versioning](https://semver.org/) — `MAJOR.MINOR.PATCH`:

- **MAJOR**: breaking change (incompatible API).
- **MINOR**: backward-compatible feature.
- **PATCH**: backward-compatible bug fix.

The CI bumps the **patch** number automatically on every push to `main`
(`npm version patch`) and publishes the result. This automated flow therefore
only produces patch releases. Minor and major releases are intentionally out of
scope for this teaching project: they would require a dedicated release process
(e.g. a manual `npm version minor`/`major` performed outside this auto-patch
job, or a tag-driven workflow) so the automatic patch bump does not override the
intended version.

## Project structure

```text
src/
├── App.js              root component (signup form)
├── validators.js       pure validation helpers (email, postal code, age, ...)
├── validators.test.js  Jest unit tests for the validators
└── ...
.github/workflows/
└── build_test_deploy_react.yml  CI/CD pipeline
jsdoc.config.json       JSDoc generator configuration
```
