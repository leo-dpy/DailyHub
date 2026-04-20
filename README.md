# DailyHub - Dashboard SPA

Une Single Page Application (SPA) ultra-moderne conçue comme un tableau de bord personnel. Architecture "No-Backend", tout est géré côté client avec Vite et hébergé en production sous Docker/Nginx.

## 🚀 Fonctionnalités Actuelles

- **Météo Dynamique** : Température en temps réel et prévisions avec recherche de ville (OpenWeather API).
- **Scores de Foot en Direct** : Suivi des ligues européennes majeures avec traduction du statut et timer écoulé (API-Sports).
- **Marchés Financiers** : Ticker des bourses majeures en temps réel (Finnhub API).
- **Sur le Web (News)** : Actualités en direct filtrées (NewsAPI).
- **Gestionnaire de Tâches** : "To-do list" épurée avec sauvegarde automatique.
- **Radio / Player** : Lecteur YouTube invisible intégré pour diffuser de la musique (YouTube Iframe API).
- **Horloge Magistrale** : Horloge tickant à la seconde, avec date complète.
- **Mode Télécommande** : Bouton natif pour passer le tableau de bord en plein-écran.

## 📋 Critères Techniques du Projet JS (Parfaitement Respectés)

1. **Manipulation du DOM** : `index.html` est totalement vide. **100% de l'interface** est générée à la volée en JavaScript via une usine à composants (`document.createElement`).
2. **Événements** : Utilisation intensive des listeners (`click` sur les tâches, `keypress` "Entrée" sur les inputs météo/tâches).
3. **Persistance des Données** : Utilisation stricte de l'API `localStorage` pour conserver définitivement la dernière ville météo et la liste complète des tâches après rafraîchissement.
4. **Pure JS Sécurisé** : Approche asynchrone pointue (`async/await`, `Promise.all`), filtrage réseau complexe (`.filter()`, `.map()`, `.forEach()`) pour parser divers JSON.
5. **Design Moderne (Bento Box)** : CSS avancé avec utilisation de l'architecture `Grid areas` pour garantir un viewport de `100vh`/`100vw` ultra-propre et sans scroll intempestif.

## 🛠️ Architecture & Déploiement

Le projet est segmenté en deux espaces stricts (Clean Architecture) :
- `frontend/` : Contient l'application pure.
- `/` (Racine) : Contient l'infrastructure système.

### Installation Locale
```bash
# 1. Configurer vos clés API dans le fichier caché .env à la racine
# 2. Entrer dans le code de l'application
cd frontend
# 3. Installer et lancer
npm install
npm run dev
```

### Déploiement Production (VPS / Coolify)
Le projet contient un `Dockerfile` multi-stage :
- Étape 1 : Builder Node Alpine (Compile le projet).
- Étape 2 : Nginx Alpine (Expose le dossier statique avec le fichier `nginx.conf`).
