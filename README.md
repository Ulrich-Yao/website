# Application Web Administrateur

Une application web moderne avec une page d'accueil publique et un espace administrateur sécurisé pour gérer différents types de contenus.

## Fonctionnalités

### Page d'accueil publique
- Design moderne et responsive
- Présentation des fonctionnalités
- Accès direct à l'espace administrateur

### Espace administrateur sécurisé
- Authentification par nom d'utilisateur et mot de passe
- Dashboard avec statistiques
- CRUD complet pour 5 modèles de données :
  - **Profils** : Gestion des profils utilisateurs
  - **Actualités** : Publication et gestion des news
  - **Landing Pages** : Gestion des pages d'atterrissage
  - **Transactions** : Suivi des transactions financières
  - **Questions** : Gestion des questions/réponses

## Technologies utilisées

- **Frontend** : Next.js 14, React, TypeScript, Tailwind CSS
- **Backend** : Next.js API Routes
- **Base de données** : SQLite
- **Authentification** : JWT avec bcrypt
- **UI** : Lucide React pour les icônes

## Installation

1. Installer les dépendances :
```bash
npm install
```

2. Démarrer l'application en mode développement :
```bash
npm run dev
```

3. Ouvrir [http://localhost:3000](http://localhost:3000) dans votre navigateur

## Utilisation

### Accès administrateur
- URL : `/admin/login`
- Identifiants par défaut :
  - **Nom d'utilisateur** : `admin`
  - **Mot de passe** : `admin123`

### Navigation
- **Page d'accueil** : `/`
- **Connexion admin** : `/admin/login`
- **Dashboard** : `/admin/dashboard`
- **Profils** : `/admin/profils`
- **Actualités** : `/admin/news`
- **Landing Pages** : `/admin/landing`
- **Transactions** : `/admin/transactions`
- **Questions** : `/admin/questions`

## Structure du projet

```
├── app/
│   ├── admin/           # Pages administrateur
│   ├── api/             # API Routes
│   ├── globals.css      # Styles globaux
│   ├── layout.tsx       # Layout principal
│   └── page.tsx         # Page d'accueil
├── components/
│   └── AdminLayout.tsx  # Layout administrateur
├── lib/
│   ├── auth.ts          # Authentification
│   └── database.ts      # Base de données
├── types/
│   └── index.ts         # Types TypeScript
└── middleware.ts        # Middleware d'authentification
```

## Modèles de données

### Profil
- id, name, photo, description, color, time, additionale, can_win, ordre, active, createdAt

### News
- id, author, title, subtitle, post, photo, visible, movie, add_date

### Landing
- id, title, subtitle, description, photo

### Transaction
- id, user, add_date, piece, montant, status, transaction_type, profil, reseau

### Question
- id, question, propo_une, propo_deux, propo_trois, propo_quatre, propo_cinq, response

## Sécurité

- Authentification JWT
- Middleware de protection des routes admin
- Hashage des mots de passe avec bcrypt
- Validation des données côté serveur

## Développement

Pour ajouter de nouvelles fonctionnalités :

1. Créer les types dans `types/index.ts`
2. Ajouter les tables dans `lib/database.ts` 
3. Créer les API routes dans `app/api/`
4. Développer l'interface dans `app/admin/`
5. Ajouter la navigation dans `components/AdminLayout.tsx`
