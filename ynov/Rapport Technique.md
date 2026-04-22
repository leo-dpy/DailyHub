# 📄 Rapport Technique & Fonctionnel - Projet JavaScript (Ynov)

**Nom du projet :** DailyHub
**Type :** Dashboard / Single Page Application (SPA)

Ce document justifie de la bonne implémentation des prérequis techniques du "Projet JS" tels que définis dans le cahier des charges (fichier PDF joint). DailyHub a été choisi dans la catégorie **Dashboard (Météo, News, Horloge...)*.

---

## 🚀 1. Fonctionnalités de l'Application

DailyHub est un tableau de bord complet qui regroupe plusieurs widgets interactifs, mis à jour dynamiquement au sein d'une même page :

- **Widget Météo (OpenWeather API) :** Affiche la température, l'humidité et les icônes selon la ville recherchée.
- **Scores Sportifs (API-Sports) :** Suivi en direct ou statut des matchs des ligues européennes majeures.
- **Flux d'Actualités (NewsAPI) :** Remontée des derniers gros titres.
- **Marchés Financiers (Finnhub API) :** Suivi en temps réel des actions/bourses majeures.
- **Gestionnaire de Tâches (Post-it / To-do) :** Permet d'ajouter, valider et supprimer des tâches.
- **Lecteur Radio (YouTube Iframe) :** Lecteur de musique intégré en fond, fonctionnant de manière transparente.
- **Horloge Dynamique :** Affichage de la date complète et des secondes défilantes en temps réel.
- **Mode Plein Écran :** Bouton de contrôle pour maximiser la vue du tableau de bord.

---

## 🛠️ 2. Validation des Spécifications Techniques

Le développement a été réalisé de façon à respecter **strictement l'ensemble des critères** imposés par le projet, et va au-delà pour offrir un code modulable et propre :

### A. Manipulation dynamique du DOM
- **Totalement dynamique** : Le fichier `index.html` sert uniquement de coquille vide (`<div id="app"></div>`). **100% de l'interface** est générée en JavaScript à partir des composants.
- **Méthodes utilisées :** `document.createElement`, `appendChild`, gestion des attributs et manipulation avancée du DOM sans aucun typage HTML "en dur".

### B. Gestion des Évènements
L'application écoute et réagit continuellement aux interactions :
- `click` : Déclenchement de la suppression/validation des tâches, appels des requêtes météo, ou du mode plein-écran.
- `keypress` : Interception de la touche "Entrée" pour ajouter une tâche ou valider un formulaire de recherche.
- `submit` : Soumission de formulaires interactifs.

### C. Persistance des données (LocalStorage)
Afin que l'utilisateur retrouve son tableau de bord intact à chaque visite :
- La liste des **tâches** est intégralement lue et écrite dans le `localStorage`.
- La **dernière ville cherchée** pour la météo est sauvegardée dans le navigateur (restauration au rafraîchissement).

### D. Logique de programmation
- **Méthodes itératives :** Filtrage et extraction massive des données des API via `.map()`, `.filter()`, et `.forEach()`.
- **Structures de données :** Utilisation d'objets (JSON) pour stocker les profils des widgets et de tableaux pour la gestion des données de la To-Do List.
- **Asynchrone :** Utilisation intensive des promesses (`async / await`, `fetch`) pour consommer les APIs externes simultanément sans bloquer le rendu visuel.

---

## 🎨 3. UI / UX & Organisation du code

### Architecture propre
Le code est segmenté pour garantir la modularité et faciliter la maintenance :
- Les appels APIs sont isolés.
- Les blocs composant le tableau de bord (widgets) sont construits dans des modules JS séparés.
- Design en **Bento Box**, avec une approche CSS "Grid" ultra-moderne pour une présentation adaptative, respectant le ratio écran en 100vh pour un affichage "Dashboard" parfait.

---

## 🔧 4. Mode d'Emploi

Même si le projet est prévu pour un déploiement robuste en production via Docker / Vite, voici les informations pour le tester localement.

**Prérequis :** Node.js et les clés d'API configurées (fournies dans `.env` si applicable).

1. Ouvrez un terminal dans le répertoire contenant l'application principale (`frontend/`).
2. Exécutez `npm install` pour récupérer les modules.
3. Lancez la version de développement avec `npm run dev`.
4. L'application est disponible directement dans le navigateur et se mettra à jour en fonction des inputs.

*Ce dossier `ynov` comporte ainsi ce rapport, le sujet d'origine (PDF), justifiant chaque attentes pédagogiques.*

