# TP Formulaire d'inscription CI/CD

[![Build](https://github.com/benoit-bremaud/tp-formulaire-inscription-ci-cd/actions/workflows/build_test_deploy_react.yml/badge.svg)](https://github.com/benoit-bremaud/tp-formulaire-inscription-ci-cd/actions/workflows/build_test_deploy_react.yml)
[![codecov](https://codecov.io/gh/benoit-bremaud/tp-formulaire-inscription-ci-cd/graph/badge.svg)](https://codecov.io/gh/benoit-bremaud/tp-formulaire-inscription-ci-cd)

A React signup form built as a teaching project for the **Ynov M1 CI/CD**
course. The repository demonstrates an end-to-end pipeline: Jest tests,
coverage reporting to Codecov, JSDoc generation, and automated deployment to
GitHub Pages via GitHub Actions.

**Live demo**: <https://benoit-bremaud.github.io/tp-formulaire-inscription-ci-cd/>

## Stack

- React 19 (Create React App)
- Jest + Testing Library (unit and component tests)
- JSDoc (generated documentation)
- GitHub Actions (CI/CD)
- Codecov (coverage tracking)
- GitHub Pages (hosting)

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
| `npm run deploy` | Manually publish the build to GitHub Pages (legacy, CI handles this automatically) |

## CI/CD pipeline

Every push to `main` triggers the
[`Build, Test and Deploy React Application`](.github/workflows/build_test_deploy_react.yml)
workflow:

1. **build_test**: installs dependencies, runs the build and the test suite,
   uploads coverage to Codecov, and packages the build folder as a Pages artifact.
2. **deploy**: runs only if `build_test` succeeds; publishes the artifact to
   GitHub Pages.

The deployment URL is exposed in the workflow run summary under the
`github-pages` environment.

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
