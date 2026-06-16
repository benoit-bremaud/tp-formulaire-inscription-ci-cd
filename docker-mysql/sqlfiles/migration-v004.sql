-- migration-v004.sql
-- Quatrieme migration : insertion de plusieurs utilisateurs.
-- S'execute APRES v001, v002, v003 (ordre alphabetique des fichiers).
-- Chaque email doit etre unique (contrainte UNIQUE sur la colonne email).
USE ynov_ci;

INSERT INTO utilisateur (nom, prenom, email) VALUES
  ('Curie',    'Marie', 'marie.curie@ynov.com'),
  ('Turing',   'Alan',  'alan.turing@ynov.com'),
  ('Lovelace', 'Ada',   'ada.lovelace@ynov.com'),
  ('Hopper',   'Grace', 'grace.hopper@ynov.com');
