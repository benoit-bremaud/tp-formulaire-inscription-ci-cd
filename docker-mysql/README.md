# TP Docker & Docker Compose — Stack MySQL + API + Adminer

Travaux pratiques du cours CI/CD (Ynov M1). Cette stack illustre la
conteneurisation d'un environnement complet et reproductible : une base de
données MySQL pré-initialisée, une API Python qui la consulte, et une interface
web d'administration, le tout orchestré par Docker Compose.

## Architecture

Trois services orchestrés par [docker-compose.yml](docker-compose.yml) :

| Service   | Image                          | Port (hôte) | Rôle |
|-----------|--------------------------------|-------------|------|
| `db`      | construite depuis `Dockerfile` (MySQL 9.7) | interne     | Base `ynov_ci`, initialisée par les scripts de `sqlfiles/` |
| `api`     | construite depuis `api/Dockerfile` (FastAPI) | `8000`      | Expose `GET /users` (lecture de la table `utilisateur`) |
| `adminer` | `adminer`                      | `8080`      | Interface web pour gérer la base au navigateur |

Les services communiquent sur le réseau interne de Compose en s'appelant par
leur nom (`api` joint la base via l'hôte `db`). L'`api` ne démarre qu'une fois
la base réellement prête, grâce à un `healthcheck` + `depends_on: service_healthy`.

## Prérequis

- Docker (avec Docker Compose intégré : `docker compose`)

## Démarrage rapide

```bash
# 1. Créer le fichier de secret a partir du modèle
cp .env.example .env
# puis éditer .env pour définir MYSQL_ROOT_PASSWORD

# 2. Construire les images et lancer la stack
docker compose up -d --build

# 3. Vérifier que les 3 services tournent (db doit être "healthy")
docker compose ps
```

## Accès

- **API** : http://localhost:8000/users (JSON des utilisateurs)
- **Doc API** (Swagger) : http://localhost:8000/docs
- **Adminer** : http://localhost:8080
  - Système : `MySQL`
  - Serveur : `db`
  - Utilisateur : `root`
  - Mot de passe : la valeur de `MYSQL_ROOT_PASSWORD` du `.env`
  - Base : `ynov_ci`

## Structure du projet

```
docker-mysql/
├── Dockerfile              # Image de la base (MySQL 9.7)
├── docker-compose.yml      # Orchestration des 3 services
├── .env                    # Secret local (non versionné)
├── .env.example            # Modèle à copier en .env
├── .dockerignore           # Exclut .env et *.log du contexte de build
├── sqlfiles/               # Migrations SQL (jouées à l'init, ordre alphabétique)
│   ├── migration-v001.sql  # CREATE DATABASE ynov_ci
│   ├── migration-v002.sql  # CREATE TABLE utilisateur
│   └── migration-v003.sql  # INSERT d'un utilisateur de démonstration
└── api/                    # API Python
    ├── Dockerfile          # Image FastAPI (python:3.9)
    └── server.py           # Connexion MySQL + route GET /users
```

## Commandes utiles

```bash
docker compose ps                 # état des services
docker compose logs api --tail 30 # logs d'un service
docker compose down               # arrêter et supprimer la stack
docker compose up -d --build      # reconstruire et relancer
```

## Notions illustrées

- Dockerfile, build d'image, secrets hors de l'image (mot de passe via `.env`)
- Scripts SQL d'initialisation montés en volume (bind mount)
- Docker Compose : services, réseau par nom, build depuis le compose
- API conteneurisée qui lit une base de données
- Robustesse : `restart`, `healthcheck`, `depends_on: condition: service_healthy`
