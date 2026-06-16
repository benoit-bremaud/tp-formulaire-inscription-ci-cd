# Image MySQL pour le TP Docker - cours CI/CD Ynov M1
# Les scripts SQL ne sont plus copies dans l'image : ils sont desormais
# montes au runtime via un volume (bind mount) declare dans docker-compose.yml.
# Le mot de passe root est fourni au lancement (--env-file ou .env du compose).
FROM mysql:9.7

# Documente le port MySQL.
EXPOSE 3306
