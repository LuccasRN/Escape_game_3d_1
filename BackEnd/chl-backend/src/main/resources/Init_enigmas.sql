-- ================================================================
-- Script d'initialisation des 5 enigmes de l'escape game CHL
-- À exécuter dans MySQL après le démarrage de l'application
-- (les tables sont créées automatiquement par Hibernate)
-- ================================================================

INSERT INTO enigmas (nom, description, reponse_attendue, difficulte, competence)
VALUES 
  (
    'Bureau Médecin',
    'Déchiffrez le dossier médical du Dr Deckard pour trouver le diagnostic du patient et accéder aux fichiers secrets.',
    'SUCCESS',
    'Facile',
    'LOGIQUE'
  ),
  (
    'Chambre du Patient',
    'Stabilisez le patient en analysant les constantes vitales, les plaquettes médicales et les résultats du modèle neuronal.',
    'SUCCESS',
    'Moyen',
    'PRECISION'
  ),
  (
    'Pharmacie',
    'Identifiez les molécules et prescriptions correctes pour déverrouiller la trousse de premiers secours.',
    'SUCCESS',
    'Moyen',
    'CREATIVITE'
  ),
  (
    'Salle Réseau',
    'Résolvez l''énigme réseau pour accéder aux fichiers secrets du serveur et découvrir la vérité sur Mme Calvin.',
    'SUCCESS',
    'Difficile',
    'RAPIDITE'
  ),
  (
    'Salle de Réunion',
    'Présentez votre enquête devant le comité médical et rendez votre verdict final sur la mort de Mme Calvin.',
    'SUCCESS',
    'Difficile',
    'PERSEVERANCE'
  );

-- Vérification
SELECT id_enigme, nom, difficulte, competence FROM enigmas ORDER BY id_enigme;