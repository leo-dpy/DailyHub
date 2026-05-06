# Étape 1 : Build de l'application React/Vite
FROM node:20-alpine AS builder

WORKDIR /app

# Copie des fichiers de configuration
COPY frontend/package*.json ./

# Installation des dépendances
RUN npm install

# Copie du reste du code source
COPY frontend/ ./

# Compilation
RUN npm run build

# Étape 2 : Déploiement Nginx
FROM nginx:alpine

# Copie de la configuration nginx personnalisée
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copier les fichiers statiques compilés depuis l'étape précédente
COPY --from=builder /app/dist /usr/share/nginx/html

# Exposer le port (utile pour Coolify / Docker)
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
