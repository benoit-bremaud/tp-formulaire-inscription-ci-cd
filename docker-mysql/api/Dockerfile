# Image de l'API Python (FastAPI) qui expose la table utilisateur en HTTP
FROM python:3.9

WORKDIR /server

# Dependances : connecteur MySQL + FastAPI + serveur ASGI uvicorn
RUN pip install --no-cache-dir mysql-connector-python fastapi uvicorn

# Code de l'API
COPY server.py .

# Port d'ecoute de l'API
EXPOSE 8000

# Commande lancee au demarrage du conteneur : demarre l'API
CMD ["uvicorn", "server:app", "--host", "0.0.0.0", "--port", "8000"]
