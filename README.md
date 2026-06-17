# Inventory Pro

Inventory Pro is a production-oriented inventory management SaaS scaffold with a React Native CLI mobile app and a secure Express/MongoDB API. The architecture is tenant-scoped by authenticated user, so every product, setting, notification, report, and inventory log is queried through the signed-in user's MongoDB owner id.

## Projects

- `frontend/` - React Native CLI, TypeScript, React Navigation, Redux Toolkit, TanStack Query, React Hook Form, Zod, React Native Paper, NativeWind, Firebase Auth, barcode scanner, Cloudinary-backed image uploads through the API, offline query cache, reports, and push-token registration.
- `backend/` - Node.js, Express, TypeScript, MongoDB Atlas, Mongoose, Firebase Admin token verification, app JWTs, Cloudinary image optimization/upload, Swagger, RBAC-ready middleware, rate limiting, Helmet, CORS, centralized errors, logs, analytics, CSV/PDF exports, and audit logs.

## High-Level Flow

1. The mobile app signs in with Firebase using Email/Password or Google.
2. The app sends the Firebase ID token to `POST /api/v1/auth/session`.
3. The API verifies the Firebase token with Firebase Admin, upserts the user in MongoDB, and returns an application JWT.
4. Mobile API calls use the JWT. The backend resolves the MongoDB user and scopes every inventory query with `owner = req.auth.userId`.
5. Product images upload to the backend, are compressed with Sharp, stored in Cloudinary, and persisted as image URLs in MongoDB.

## Quick Start

Open two terminals.

Backend:

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

Frontend:

```bash
cd frontend
cp .env.example .env
npm install
npm start
npm run android
```

Use `http://10.0.2.2:5000/api/v1` for Android emulator API access and `http://localhost:5000/api/v1` for iOS simulator.

## Required Cloud Setup

- Firebase: Enable Email/Password and Google providers. Download Android `google-services.json` and iOS `GoogleService-Info.plist` after creating native apps. Create a service account for the backend.
- MongoDB Atlas: Create a cluster, database user, IP allow list, and connection string for `MONGODB_URI`.
- Cloudinary: Create a cloud, copy cloud name, API key, and API secret into `backend/.env`.

## API Documentation

After starting the backend, Swagger is available at:

```text
http://localhost:5000/api/v1/docs
```

Health checks:

```text
GET /health
GET /api/v1/health
```

## Screenshots

Place production screenshots in:

- `frontend/screenshots/onboarding.png`
- `frontend/screenshots/dashboard.png`
- `frontend/screenshots/inventory.png`
- `frontend/screenshots/product-details.png`
- `frontend/screenshots/settings.png`
- `backend/screenshots/swagger.png`

## Repository Layout

This GitHub repository contains both production projects:

- `frontend/` for the mobile client
- `backend/` for the REST API

Each folder has its own package manifest, README, tests, and environment example. The root `.gitignore` keeps secrets, dependencies, and build artifacts out of Git.

## Production Notes

- Keep Firebase Admin credentials only on the backend.
- Keep Cloudinary API secret only on the backend.
- Use strong JWT secrets and rotate them through your deployment platform.
- Use MongoDB Atlas network access rules, least-privilege database users, and backups.
- Configure Android/iOS signing outside the repository and never commit keystores or provisioning profiles.
- Add CI to run `npm run lint`, `npm run test`, and `npm run build` before release.
