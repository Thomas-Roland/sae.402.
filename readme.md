# UniversCinéma

## Description
UniversCinéma est une application web interactive qui permet aux utilisateurs de jouer à un jeu basé sur les films et les acteurs. Les joueurs doivent associer des acteurs aux films correspondants pour marquer des points.

## Fonctionnalités principales
- **Page d'accueil** : Présente le site et permet d'accéder au jeu.
- **Jeu interactif** : Les utilisateurs doivent deviner les acteurs associés à un film.
- **Statistiques en temps réel** : Affiche le score, les bonnes et mauvaises réponses, ainsi que le nombre de films traités.
- **Thème clair/sombre** : Possibilité de basculer entre deux thèmes visuels.
- **API REST** : Fournit des données sur les films et les acteurs via des routes spécifiques.

## Structure du projet
- **index.html** : Page d'accueil du site.
- **jeu.html** : Page principale du jeu.
- **index.js** : Fichier principal du backend, gère les routes et la logique serveur.
- **src/routes/** : Contient les fichiers de routes pour les films, les acteurs et leurs relations.
- **src/sgbd/** : Contient la configuration et les modèles pour la base de données.

## Installation
1. Clonez le dépôt :
   ```bash
   git clone <url-du-repo>
   cd UniversCinéma