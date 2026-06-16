# Image React (CRA) pour le front du TP - cours CI/CD Ynov
# pull official base image
FROM node:20

# set working directory
WORKDIR /app

# Ajoute /app/node_modules/.bin au PATH : permet d'utiliser react-scripts
# sans souci de droits d'acces sur les fichiers.
ENV PATH=/app/node_modules/.bin:$PATH

# install app dependencies
# (le code source est monte via un volume dans docker-compose.yml, donc on ne
# copie que le manifeste necessaire a l'installation des dependances)
COPY package.json ./
RUN npm install --silent
RUN npm install react-scripts@5.0.1 -g --silent

EXPOSE 3000
