# DailyHub - Dashboard SPA

Bienvenue sur **DailyHub**, une application "Single Page" interactive conçue en JavaScript pur (Vanilla), sans aucun framework. Ce dashboard centralise toutes vos informations quotidiennes dans une interface premium et responsive.

## 🚀 Fonctionnalités

### Flux Temps Réel (APIs)
- **Météo Expert** : Température, humidité et vent en temps réel.
- **Matchs de Foot** : Scores et affiches du jour.
- **Infos Bourse** : Suivi des bourse mondiales.
- **News Feed** : Derniers titres de l'actualité.

### Outils & Utilitaires
- **Suivi de Colis** : Barre de progression dynamique.
- **Calculatrice** : Opérations mathématiques intégrées.
- **Horloge & Calendrier** : Temps réel avec les secondes et calendrier du mois.

### Gestion & Personnalisation
- **Task Manager (Post-it)** : Ajoutez, barrez et supprimez vos tâches.
- **Player Musique** : Contrôles audio (Play/Pause/Volume) via YouTube IFrame API.
- **Dark Mode** : Changez de thème en un clic.

## 📋 Critères Techniques Respectés
- **Manipulation du DOM** : 0 élément dynamique codé en dur dans le HTML. Tout est généré via `document.createElement`.
- **Événements** : Click, Change, Input.
- **Persistance** : Utilisation du `LocalStorage` pour le thème et les tâches.
- **Pure JS** : Utilisation intensive de `.forEach()`, `.map()` et `.filter()`.
- **Design** : CSS Grid Layout, Responsive design, Glassmorphism.
