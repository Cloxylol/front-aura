# Aura - Frontend

Bienvenue sur le frontend du projet **Aura**, une application de réseau social innovante qui intègre une dimension émotionnelle unique grâce à l'analyse faciale.

## Fonctionnalités Principales

-   **Système d'Aura** : Capture et analyse des émotions via webcam pour gamifier l'expérience utilisateur (Aura Score).
-   **Fil d'Actualité Interactif** : Navigation fluide entre les posts avec défilement vertical.
-   **Authentification Sécurisée** : Inscription et connexion utilisateurs (JWT).
-   **Profil Utilisateur** : Gestion de profil, avatars et suivi du score Aura.
-   **Création de Contenu** : Partage de posts avec texte et images.
-   **Tendances** : Filtrage du contenu par hashtags populaires.
-   **Design Moderne** : Interface soignée utilisant des icônes Lucide et des composants réactifs.

## Stack Technique

Ce projet est développé avec les technologies suivantes :

-   **Core** : [React 19](https://react.dev/)
-   **Build Tool** : [Vite](https://vitejs.dev/)
-   **Routing** : [React Router Dom](https://reactrouter.com/)
-   **Webcam** : [React Webcam](https://www.npmjs.com/package/react-webcam)
-   **Icons** : [Lucide React](https://lucide.dev/)
-   **Linting** : ESLint

## Installation et Démarrage

Suivez ces étapes pour lancer le projet localement :

1.  **Cloner le dépôt**
    ```bash
    git clone <votre-repo-url>
    cd front-aura
    ```

2.  **Installer les dépendances**
    ```bash
    npm install
    ```

3.  **Configurer l'environnement**
    Assurez-vous que le backend Aura est lancé et accessible.
    *Note : Vérifiez la configuration de l'URL de l'API dans `src/services/api.js` si nécessaire.*

4.  **Lancer le serveur de développement**
    ```bash
    npm run dev
    ```

5.  **Accéder à l'application**
    Ouvrez votre navigateur sur l'URL indiquée (généralement `http://localhost:5173`).

## Structure du Projet

```
src/
├── components/   # Composants réutilisables (Navbar, PostCard, AuraSensor...)
├── data/         # Données statiques ou mockées
├── pages/        # Pages principales (Home, Login, Profile...)
├── services/     # Communication avec l'API Backend
├── styles/       # Fichiers CSS spécifiques
├── App.jsx       # Composant racine et configuration du routing
└── main.jsx      # Point d'entrée de l'application
```
