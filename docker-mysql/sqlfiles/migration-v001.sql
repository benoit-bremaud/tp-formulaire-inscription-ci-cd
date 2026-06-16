-- migration-v001.sql
-- Premiere migration : creation de la base de donnees applicative.
-- Ce fichier est execute automatiquement par l'image MySQL au tout premier
-- demarrage du conteneur (mecanisme /docker-entrypoint-initdb.d).
CREATE DATABASE IF NOT EXISTS ynov_ci;
