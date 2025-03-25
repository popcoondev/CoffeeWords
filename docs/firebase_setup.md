# Firebase Setup Guide for Coffee Words App

This document explains how to set up Firebase for the Coffee Words application.

## Prerequisites

- Node.js and npm installed
- Firebase CLI installed (`npm install -g firebase-tools`)
- A Google account to create a Firebase project

## Creating a Firebase Project

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Enter "Coffee Words" as the project name
4. Follow the steps to create your project (you can enable Google Analytics if desired)

## Configuring the Web App

1. In the Firebase Console, navigate to your project
2. Click on the Web icon (</>) to add a web app
3. Register your app with the name "Coffee Words Web"
4. Copy the configuration object that looks like this:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyB...",
  authDomain: "coffee-words.firebaseapp.com",
  projectId: "coffee-words",
  storageBucket: "coffee-words.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abc123def456",
  measurementId: "G-ABC123DEF"
};
```

## Setting Up Environment Variables

1. Create a `.env` file in the root of the project by copying `.env.example`:

```bash
cp .env.example .env
```

2. Fill in the Firebase configuration values in the `.env` file:

```
FIREBASE_API_KEY=your_firebase_api_key_here
FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
FIREBASE_APP_ID=your_firebase_app_id
FIREBASE_MEASUREMENT_ID=your_measurement_id
```

3. For testing, create a `.env.test` file by copying `.env.test.example`:

```bash
cp .env.test.example .env.test
```

4. Fill in the Firebase configuration values in the `.env.test` file as well.

## Setting Up Authentication

1. In the Firebase Console, navigate to Authentication
2. Click "Get Started"
3. Enable the Email/Password sign-in method
4. (Optional) Add test users in the "Users" tab

## Setting Up Firestore Database

1. In the Firebase Console, navigate to Firestore Database
2. Click "Create database"
3. Start in test mode
4. Choose a location close to your users

After creating the database, create the following collections:

- `users` - User profiles
- `coffeeRecords` - Coffee tasting records
- `dictionaryEntries` - Coffee terminology entries

## Setting Up Storage

1. In the Firebase Console, navigate to Storage
2. Click "Get Started"
3. Start in test mode
4. Choose a location close to your users

## Running the App with Firebase

After completing the setup, run the app:

```bash
npm run start
```

The app should now connect to your Firebase project and work properly.

## Troubleshooting

If you encounter issues:

1. Make sure all environment variables are correctly set in `.env`
2. Verify that your Firebase project is properly configured
3. Check the console for any Firebase-related errors
4. Ensure the Firebase services you're using (Auth, Firestore, Storage) are enabled in the Firebase Console

## Security Rules

For production, you should configure security rules for Firestore and Storage. Here are basic rules to get started:

### Firestore Rules

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /coffeeRecords/{recordId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.resource.data.userId == request.auth.uid;
    }
    match /dictionaryEntries/{entryId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.resource.data.userId == request.auth.uid;
    }
  }
}
```

### Storage Rules

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /coffeeImages/{userId}/{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```