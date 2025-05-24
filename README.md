# Next.js Notification App

This is a backend built with Next.js API routes. It receives FCM device tokens from the Expo app and can send push notifications using Firebase Cloud Messaging.

## Prerequisites

- Node.js (LTS)
- Firebase Admin SDK credentials (`firebase-adminsdk.json`)

## Setup Instructions

1. **Clone the repository:**

   ```bash
   git clone https://github.com/your-username/next-fcm-backend.git
   cd next-fcm-backend


2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Add Firebase Admin credentials:**

   Place your Firebase Admin JSON file in the root directory and rename it (if needed):

   ```
   firebase-adminsdk.json
   ```

4. **Configure Firebase Admin in `lib/firebaseAdmin.ts`:**

   ```ts
   import admin from 'firebase-admin';
   import serviceAccount from '../firebase-adminsdk.json';

   if (!admin.apps.length) {
     admin.initializeApp({
       credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
     });
   }

   export default admin;
   ```

5. **Run the development server:**

   ```bash
   npm run dev
   ```

   The API will be available at `http://localhost:3000/api`.

## API Routes

* `POST /api/save-token` — saves the device token sent from the Expo app.
* `POST /api/notifications` — sends a notification to the stored device token(s).

## Features

* Secure storage (in-memory for demo; use a real DB in production)
* Sends push notifications via Firebase Admin SDK
* Compatible with Expo FCM client setup
