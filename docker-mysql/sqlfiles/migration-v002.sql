-- migration-v002.sql
-- Deuxieme migration : creation de la table utilisateur dans la base ynov_ci.
-- S'execute APRES migration-v001.sql (ordre alphabetique des fichiers).
USE ynov_ci;

CREATE TABLE IF NOT EXISTS utilisateur (
  id               INT AUTO_INCREMENT PRIMARY KEY,
  nom              VARCHAR(100) NOT NULL,
  prenom           VARCHAR(100) NOT NULL,
  email            VARCHAR(255) NOT NULL UNIQUE,
  date_inscription TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
