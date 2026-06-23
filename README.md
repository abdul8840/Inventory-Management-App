# Inventory Pro

<p align="center">
  <strong>Production-ready mobile inventory management SaaS built with React Native CLI, TypeScript, Express, MongoDB Atlas, Firebase Authentication, Cloudinary, and secure REST APIs.</strong>
</p>

<p align="center">
  <a href="./frontend"><img alt="Mobile" src="https://img.shields.io/badge/mobile-React%20Native-61DAFB?style=for-the-badge&logo=react&logoColor=111111"></a>
  <a href="./backend"><img alt="API" src="https://img.shields.io/badge/api-Express%20%2B%20TypeScript-111111?style=for-the-badge&logo=express&logoColor=white"></a>
  <a href="./docs/APP_DOCUMENTATION.md"><img alt="Docs" src="https://img.shields.io/badge/docs-complete-BF0D24?style=for-the-badge"></a>
  <img alt="Database" src="https://img.shields.io/badge/database-MongoDB%20Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white">
</p>

## Project Snapshot

Inventory Pro helps business owners manage products, stock, suppliers, sales value, profit, low-stock alerts, reports, and audit history from a premium mobile app. It is built as a multi-user SaaS system: every authenticated user receives a private inventory workspace, and backend queries are scoped to that user's MongoDB owner id.

The repository contains both production projects:

| Project | Description |
| --- | --- |
| `frontend/` | React Native CLI mobile app for Android and iOS |
| `backend/` | Secure Express.js REST API with MongoDB Atlas, Firebase Admin, JWT, Cloudinary, Swagger, reports, and analytics |
| `docs/APP_DOCUMENTATION.md` | Full product and technical documentation |

## Why This App Exists

Small businesses often manage stock in notebooks or spreadsheets, which makes it hard to know current inventory value, sales value, profit, supplier details, or low-stock products. Inventory Pro brings those workflows into a secure mobile app with real-time authentication, product images, reports, and analytics.

## Key Features

- Firebase Email/Password registration and login
- Google Sign-In
- Forgot password and email verification flow
- Persistent sessions and logout
- MongoDB user profile storage
- Product CRUD with image gallery support
- Cloudinary image upload through backend optimization
- SKU generation and barcode/QR scanner integration
- Category filtering, search, sorting, and pagination-ready API
- Stock sale, restock, and adjustment workflows
- Inventory history and audit logs
- Dashboard analytics for stock, value, sales, profit, and categories
- Low-stock alert-ready product thresholds
- Notifications and push-token registration support
- CSV and PDF inventory exports
- Dark/light theme support
- Offline query caching with TanStack Query persistence
- Secure JWT-authenticated REST API
- Production Android release signing setup

## Screenshots

Add production screenshots in these paths:

| Onboarding | Dashboard | Inventory |
| --- | --- | --- |
| `frontend/screenshots/onboarding.png` | `frontend/screenshots/dashboard.png` | `frontend/screenshots/inventory.png` |

| Product Details | Settings | Swagger |
| --- | --- | --- |
| `frontend/screenshots/product-details.png` | `frontend/screenshots/settings.png` | `backend/screenshots/swagger.png` |

## Technology Stack

### Mobile

| Area | Technology |
| --- | --- |
| Framework | React Native CLI |
| Language | TypeScript |
| Navigation | React Navigation |
| UI | React Native Paper, NativeWind, Lucide icons |
| State | Redux Toolkit, TanStack Query |
| Forms and validation | React Hook Form, Zod |
| Auth | React Native Firebase Auth, Google Sign-In |
| Storage | AsyncStorage query cache, React Native Keychain |
| Camera | React Native Vision Camera |
| Reports | React Native Blob Util |

### Backend

| Area | Technology |
| --- | --- |
| Runtime | Node.js |
| Framework | Express.js |
| Language | TypeScript |
| Database | MongoDB Atlas with Mongoose |
| Auth | Firebase Admin token verification and JWT sessions |
| Uploads | Multer, Sharp, Cloudinary |
| Security | Helmet, CORS, rate limiting, Zod validation |
| Docs | Swagger UI |
| Logging | Pino |
| Testing | Jest, Supertest |

## How It Works

```text
Mobile app -> Firebase Authentication -> Firebase ID token
          -> Express /api/v1/auth/session
          -> Firebase Admin verification
          -> MongoDB user upsert
          -> Backend JWT session
          -> Tenant-scoped inventory APIs
          -> MongoDB Atlas + Cloudinary
```

1. The user signs in with Firebase Email/Password or Google.
2. The app sends the Firebase ID token to the backend.
3. The backend verifies the token, stores or updates the user, and returns an app JWT.
4. The mobile app sends the JWT with every protected API request.
5. The backend scopes inventory, analytics, reports, notifications, and settings to the signed-in user.
6. Product images are optimized by the backend and stored in Cloudinary.

## Repository Structure

```text
Inventory-Management-App/
  backend/       Node.js Express API
  frontend/      React Native CLI mobile app
  docs/          Full application documentation
  README.md      Project overview and setup guide
```

## Local Setup

### Backend

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

Backend URL:

```text
http://localhost:5000/api/v1
```

Swagger:

```text
http://localhost:5000/api/v1/docs
```

### Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm start
```

Run Android:

```bash
npm run android
```

For Android emulator, use this frontend API URL:

```env
API_URL=http://10.0.2.2:5000/api/v1
```

For a real device or Play Store build, use your deployed backend URL:

```env
API_URL=https://your-backend-domain.com/api/v1
```

## Required Cloud Services

| Service | Used For |
| --- | --- |
| Firebase | Authentication, Google Sign-In, email verification, password reset, messaging support |
| MongoDB Atlas | Production database |
| Cloudinary | Product image storage |
| Render/Railway/Fly/AWS/Azure/GCP | Backend deployment |
| Google Play Console | Android production release |

## Environment Files

Copy the examples and fill real values:

```bash
backend/.env.example -> backend/.env
frontend/.env.example -> frontend/.env
```

Never commit `.env`, Firebase service account JSON, Cloudinary secrets, MongoDB credentials, Android keystores, or `android/key.properties`.

## Production Deployment

1. Deploy `backend/` to a Node.js hosting platform.
2. Add backend environment variables in the hosting dashboard.
3. Test `/health` and `/api/v1/docs` on the deployed backend.
4. Set `frontend/.env` `API_URL` to the deployed backend URL.
5. Add Android SHA-1/SHA-256 fingerprints to Firebase.
6. Build signed Android APK or AAB.
7. Test on a real device.
8. Upload the AAB to Play Console.

## Android Release Commands

Build signed APK:

```powershell
cd F:\InventryApp\frontend
npm.cmd run android:release:apk
```

APK output:

```text
frontend/android/app/build/outputs/apk/release/app-release.apk
```

Build Play Store AAB:

```powershell
npm.cmd run android:release:aab
```

AAB output:

```text
frontend/android/app/build/outputs/bundle/release/app-release.aab
```

Keep these files backed up and private:

```text
frontend/android/app/upload-keystore.jks
frontend/android/key.properties
```

## Quality Commands

Backend:

```bash
cd backend
npm run lint
npm run test
npm run build
```

Frontend:

```bash
cd frontend
npm run lint
npm run test
npm run typecheck
```

## Documentation

Read the full application guide here:

[docs/APP_DOCUMENTATION.md](./docs/APP_DOCUMENTATION.md)

It includes product purpose, architecture, authentication flow, SaaS data isolation, backend modules, API endpoints, database models, mobile screens, deployment, release signing, and production checklist.

## Production Notes

- Backend must be deployed before the app can work for real mobile users.
- Emulator-only URLs such as `10.0.2.2` must not be used in Play Store builds.
- Firebase Admin credentials belong only on the backend.
- Cloudinary API secret belongs only on the backend.
- MongoDB Atlas credentials belong only on the backend.
- The Android upload keystore must be backed up because future releases need the same key.

## License

This project is prepared as a production-ready inventory management SaaS foundation.