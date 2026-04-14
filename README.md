# DailyHub - Dashboard SPA

Bienvenue sur **DailyHub**, une application "Single Page" interactive conçue en JavaScript pur (Vanilla), sans aucun framework. Ce dashboard centralise toutes vos informations quotidiennes dans une interface premium et responsive.

## 🚀 Fonctionnalités

### Flux Temps Réel (APIs)
- **Météo Expert** : Température, humidité et vent en temps réel (via Open-Meteo).
- **Matchs de Foot** : Scores et affiches du jour.
- **Infos Bourse** : Suivi des actifs (Apple, Tesla, BTC).
- **News Feed** : Derniers titres de l'actualité.

### Outils & Utilitaires
- **Suivi de Colis** : Barre de progression dynamique.
- **Calculatrice** : Opérations mathématiques intégrées.
- **Horloge & Calendrier** : Temps réel et génération dynamique du mois.

### Gestion & Personnalisation
- **Task Manager (Post-it)** : Ajoutez, barrez et supprimez vos tâches.
- **Player Musique** : Contrôles audio (Play/Pause/Volume) via YouTube IFrame API.
- **Dark Mode** : Changez de thème en un clic.

## 🛠 Installation

### 1. Configuration des APIs
Renommez le fichier `config.txt` (si ce n'est pas déjà fait) et remplissez vos clés d'API :
```env
VITE_YOUTUBE_API_KEY=...
VITE_ALPHA_VANTAGE_KEY=...
```
I si vous souhaitez des données réelles pour le Foot, la Bourse et les News.
3. Lancez l'application via un serveur local (ex: `Live Server` sur VS Code ou `npx serve`).
The app now tracks if the `config.txt` file was successfully loaded. If you are not using a server (and the browser blocks the file access), the app will detect it and enter "Demo Mode" immediately with a helpful tip.
ar le JavaScript.*

## 📋 Critères Techniques Respectés
- **Manipulation du DOM** : 0 élément dynamique codé en dur dans le HTML. Tout est généré via `document.createElement`.
- **Événements** : Click, Change, Input.
- **Persistance** : Utilisation du `LocalStorage` pour le thème et les tâches.
- **Pure JS** : Utilisation intensive de `.forEach()`, `.map()` et `.filter()`.
- **Design** : CSS Grid Layout, Responsive design, Glassmorphism.

## 🔑 Clés d'API (Optionnel)
Pour profiter pleinement de tous les widgets, obtenez vos clés gratuites ici :
- **YouTube** : [Google Cloud Console](https://console.cloud.google.com/)
- **Stocks** : [Alpha Vantage](https://www.alphavantage.co/)
- **News** : [NewsData.io](https://newsdata.io/)
- **Football** : [Football-Data.org](https://www.football-data.org/)
