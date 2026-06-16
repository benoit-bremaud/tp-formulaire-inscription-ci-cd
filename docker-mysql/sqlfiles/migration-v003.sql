-- migration-v003.sql
-- Troisieme migration : insertion d'un utilisateur de demonstration.
-- S'execute APRES v001 (base) et v002 (table), grace a l'ordre alphabetique.
USE ynov_ci;

INSERT INTO utilisateur (nom, prenom, email) VALUES
  ('Bremaud', 'Benoit', 'benoit.bremaud@vev.com');
