# Inventory Pro Application Documentation

## 1. Overview

Inventory Pro is a full-stack inventory management mobile application built for small businesses, shops, warehouses, distributors, and growing teams that need a secure way to track products, stock movement, sales value, purchase value, profit, supplier information, reports, and low-stock activity from a mobile-first interface.

The system is designed as a multi-user SaaS product. Each user signs in with Firebase Authentication, receives a backend application session, and can access only their own inventory records. Product data, analytics, settings, notifications, and inventory logs are tenant-scoped through the authenticated MongoDB user id.

The project contains two production projects:

- `frontend/` - React Native CLI mobile application for Android and iOS.
- `backend/` - Node.js, Express.js, TypeScript, MongoDB Atlas REST API.

## 2. Purpose Of The App

Inventory Pro helps users answer practical business questions quickly:

- Which products are currently in stock?
- Which products are close to low-stock level?
- How much money is invested in inventory?
- How much sales value and profit has been generated?
- Which categories contain the most products?
- Which products were sold, restocked, adjusted, or updated?
- Which supplier is connected to a product?
- Which records should be exported for review or accounting?

The application reduces manual spreadsheet work by combining inventory CRUD, stock calculations, product images, reports, analytics, and audit history inside one mobile workflow.

## 3. Target Users

Inventory Pro is suitable for:

- Retail stores
- Clothing and shoe shops
- Electronics sellers
- Grocery and beauty stores
- Furniture businesses
- Sports and accessory shops
- Book sellers
- Small warehouses
- Independent sellers managing multiple product categories

## 4. Core Features

### Authentication And Account Management

- Firebase Email/Password registration
- Firebase Email/Password login
- Google Sign-In support
- Forgot password flow
- Email verification screen
- Persistent mobile sessions
- Logout
- MongoDB user profile storage
- User fields: Firebase UID, name, email, profile image, role, created date, last login

### Inventory Management

- Product create, read, update, and delete
- Product image upload through backend Cloudinary integration
- SKU auto-generation
- Barcode and QR scanner screen
- Category filtering
- Product search
- Sorting and pagination-ready API
- Stock sale, restock, and adjustment actions
- Inventory history logs
- Bulk action-ready backend architecture
- Product status management
- Notes and supplier information

### Product Fields

Each product can store business-ready inventory information:

- Product image gallery
- Product title
- Description
- SKU
- Barcode value
- Product category
- Stock available
- Stock sold
- Purchase price
- Selling price
- Total stock
- Total purchase value
- Total sales value
- Profit amount
- Profit margin percentage
- Low stock threshold
- Supplier name
- Supplier contact
- Product status
- Created date
- Updated date
- Notes

### Dashboard And Analytics

The dashboard summarizes the business in a fast mobile view:

- Total products
- Total inventory value
- Total sales value
- Total profit
- Total stock available
- Low stock product count
- Recent activity
- Sales analytics
- Category distribution
- Chart-ready analytics endpoint

### Reports And Exports

- Inventory CSV export
- Inventory PDF export
- Authenticated report downloads
- Report generation through backend services

### Notifications And Alerts

- Notifications model and API
- Push-token registration support through Firebase Messaging
- Low-stock alert-ready product threshold
- Notification list screen

### Offline And Mobile Experience

- TanStack Query cache persistence with AsyncStorage
- Pull-to-refresh support
- Optimistic and scoped query invalidation patterns
- Loading skeleton components
- Secure token storage
- Dark and light theme settings
- React Native Paper UI components
- NativeWind utility styling

## 5. Technology Stack

### Mobile Frontend

| Area | Technology |
| --- | --- |
| Mobile framework | React Native CLI |
| Language | TypeScript |
| Navigation | React Navigation |
| Server state | TanStack Query / React Query |
| Local app state | Redux Toolkit |
| Forms | React Hook Form |
| Validation | Zod |
| UI components | React Native Paper |
| Styling | NativeWind / Tailwind CSS for React Native |
| Icons | Lucide React Native and vector icons |
| Authentication | React Native Firebase Auth and Google Sign-In |
| Push support | React Native Firebase Messaging |
| Secure storage | React Native Keychain |
| Offline cache | AsyncStorage query persister |
| Barcode scanning | React Native Vision Camera |
| Reports | React Native Blob Util downloads |
| Charts | React Native Chart Kit |

### Backend

| Area | Technology |
| --- | --- |
| Runtime | Node.js |
| API framework | Express.js |
| Language | TypeScript |
| Database | MongoDB Atlas |
| ODM | Mongoose |
| Auth verification | Firebase Admin SDK |
| App sessions | JWT |
| Image storage | Cloudinary |
| Image optimization | Sharp |
| Upload handling | Multer |
| Validation | Zod |
| Security headers | Helmet |
| Rate limiting | express-rate-limit |
| CORS | cors |
| Logging | Pino and pino-http |
| API docs | Swagger UI and swagger-jsdoc |
| Reports | CSV utilities and PDFKit |
| Tests | Jest and Supertest |

## 6. High-Level Architecture

```text
React Native Mobile App
        |
        | Firebase login / Google Sign-In
        v
Firebase Authentication
        |
        | Firebase ID token
        v
Express API /api/v1/auth/session
        |
        | Firebase Admin verifies token
        v
MongoDB User upsert + JWT session creation
        |
        | Authorization: Bearer <app-jwt>
        v
Tenant-scoped API modules
        |
        | Products, analytics, reports, logs, notifications, settings
        v
MongoDB Atlas + Cloudinary
```

## 7. How Authentication Works

1. The mobile app signs in the user through Firebase Authentication.
2. Firebase returns an ID token to the mobile app.
3. The app sends that ID token to `POST /api/v1/auth/session`.
4. The backend verifies the ID token using Firebase Admin SDK.
5. The backend creates or updates the matching MongoDB user.
6. The backend returns an application JWT.
7. The mobile app stores the JWT securely.
8. Future API requests send `Authorization: Bearer <jwt>`.
9. The backend resolves the JWT into the MongoDB user and scopes data by owner id.

This keeps password management inside Firebase while giving the backend its own secure application session and tenant boundary.

## 8. Multi-User SaaS Data Isolation

The backend is built around owner-scoped data access. Protected requests resolve the current authenticated user, then product, analytics, report, inventory-log, notification, and settings queries include the user owner id.

This means User A cannot read or modify User B's inventory data, even if both users use the same API and database cluster.

## 9. How Inventory Calculations Work

Inventory values are derived from product stock and price fields:

- `totalStock = stockAvailable + stockSold`
- `totalPurchaseValue = totalStock * purchasePrice`
- `totalSalesValue = stockSold * sellingPrice`
- `profitAmount = totalSalesValue - (stockSold * purchasePrice)`
- `profitMargin = profitAmount / totalSalesValue * 100`

When a stock sale, restock, or adjustment is recorded, the backend updates product stock fields and creates inventory log records so the action can be audited later.

## 10. Image Upload Flow

1. User selects or captures a product image in the mobile app.
2. The app sends the image to the backend upload endpoint.
3. Multer receives the file in memory.
4. Sharp optimizes/compresses the image.
5. The backend uploads the optimized image to Cloudinary.
6. Cloudinary returns a secure URL.
7. The URL is stored in MongoDB as part of the product image gallery.

Cloudinary credentials remain on the backend only. The mobile app never receives the Cloudinary API secret.

## 11. Backend API Modules

| Module | Purpose |
| --- | --- |
| Auth | Firebase token exchange, current user, account updates |
| Products | Product CRUD, search, filters, stock operations, bulk actions |
| Uploads | Product image upload and optimization |
| Analytics | Dashboard metrics and category/sales summaries |
| Reports | CSV and PDF inventory exports |
| Notifications | User notification records |
| Settings | User preferences and app settings |
| Categories | Product category access |
| Health | Health check endpoints |
| Docs | Swagger API documentation |

## 12. Main API Endpoints

| Method | Endpoint | Description |
| --- | --- | --- |
| `POST` | `/api/v1/auth/session` | Exchange Firebase ID token for app JWT |
| `GET` | `/api/v1/auth/me` | Get current MongoDB user |
| `PATCH` | `/api/v1/auth/account` | Update account profile |
| `GET` | `/api/v1/products` | List products with query options |
| `POST` | `/api/v1/products` | Create product |
| `GET` | `/api/v1/products/:id` | Get product details |
| `PATCH` | `/api/v1/products/:id` | Update product |
| `DELETE` | `/api/v1/products/:id` | Delete product |
| `POST` | `/api/v1/products/:id/stock` | Record stock sale/restock/adjustment |
| `POST` | `/api/v1/products/bulk` | Bulk update products |
| `POST` | `/api/v1/uploads/product-image` | Upload product image |
| `GET` | `/api/v1/analytics/dashboard` | Dashboard metrics |
| `GET` | `/api/v1/reports/inventory.csv` | CSV export |
| `GET` | `/api/v1/reports/inventory.pdf` | PDF export |
| `GET` | `/api/v1/notifications` | User notifications |
| `GET` | `/api/v1/settings` | User settings |
| `GET` | `/api/v1/docs` | Swagger API documentation |

## 13. Database Models

### User

Stores the application user mapped to Firebase identity:

- Firebase UID
- Name
- Email
- Profile image
- Role
- Created date
- Last login

### Product

Stores tenant-owned inventory records, pricing information, stock counters, supplier data, status, category, notes, SKU, barcode value, and image gallery.

### InventoryLog

Stores stock movement and audit events, including sale, restock, adjustment, and product updates.

### Category

Provides category structure for product grouping.

### Notification

Stores user-visible notifications such as low-stock or account/inventory activity.

### Settings

Stores user preferences such as theme, notifications, and alert behavior.

## 14. Mobile App Screens

| Screen | Purpose |
| --- | --- |
| Splash | Initial app loading and session restoration |
| Onboarding | First-run introduction |
| Login | Email/password and Google sign-in |
| Register | New account creation |
| Forgot Password | Firebase password reset flow |
| Verify Email | Email verification guidance |
| Dashboard | Business metrics, charts, and recent activity |
| Inventory List | Search, filter, scan, and open products |
| Product Form | Create and edit products |
| Product Details | View product and perform stock actions |
| Barcode Scanner | Scan barcode or QR values |
| Notifications | View notification records |
| Profile | Account profile and logout |
| Settings | Theme, notifications, exports, and preferences |

## 15. Folder Structure

```text
Inventory-Management-App/
  backend/
    src/
      config/
      constants/
      controllers/
      docs/
      middleware/
      models/
      routes/
      schemas/
      services/
      utils/
    .env.example
    package.json
    README.md
  frontend/
    android/
    ios/
    src/
      api/
      components/
      config/
      constants/
      features/
      hooks/
      navigation/
      screens/
      services/
      store/
      theme/
      types/
      utils/
    .env.example
    package.json
    README.md
  docs/
    APP_DOCUMENTATION.md
  README.md
```

## 16. Environment Configuration

### Backend Environment

Backend secrets are stored in deployment platform environment variables or local `backend/.env`.

Important backend variables:

- `NODE_ENV`
- `PORT`
- `API_VERSION`
- `CLIENT_ORIGIN`
- `MONGODB_URI`
- `JWT_SECRET`
- `JWT_EXPIRES_IN`
- `FIREBASE_PROJECT_ID`
- `FIREBASE_CLIENT_EMAIL`
- `FIREBASE_PRIVATE_KEY`
- `FIREBASE_SERVICE_ACCOUNT_BASE64`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `CLOUDINARY_FOLDER`

### Frontend Environment

Frontend environment values are stored in `frontend/.env`.

Important frontend variables:

- `API_URL`
- `FIREBASE_ANDROID_PROJECT_NUMBER`
- `FIREBASE_ANDROID_PROJECT_ID`
- `FIREBASE_ANDROID_APP_ID`
- `FIREBASE_ANDROID_API_KEY`
- `FIREBASE_STORAGE_BUCKET`
- `GOOGLE_WEB_CLIENT_ID`
- `IOS_CLIENT_ID`
- `ANDROID_CLIENT_ID`

For Android emulator development, `API_URL` can be:

```env
API_URL=http://10.0.2.2:5000/api/v1
```

For production builds, `API_URL` must be a deployed HTTPS backend URL:

```env
API_URL=https://your-backend-domain.com/api/v1
```

## 17. Local Development Setup

### Backend

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

Backend local URL:

```text
http://localhost:5000/api/v1
```

Swagger local URL:

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

Run iOS:

```bash
cd ios
pod install
cd ..
npm run ios
```

## 18. Production Deployment Flow

1. Create and configure Firebase project.
2. Create MongoDB Atlas cluster and database user.
3. Create Cloudinary account and product image folder.
4. Deploy backend to a Node.js hosting platform such as Render, Railway, Fly.io, AWS, Azure, or Google Cloud Run.
5. Add production backend environment variables.
6. Test backend health endpoint and Swagger docs.
7. Update `frontend/.env` with the deployed backend API URL.
8. Configure Android upload keystore and Firebase SHA fingerprints.
9. Build release APK or AAB.
10. Test release build on a real Android device.
11. Upload AAB to Play Console.
12. Add Play App Signing SHA fingerprints to Firebase after the first Play upload.

## 19. Android Release Build

Generate or reuse the private upload keystore:

```powershell
cd F:\InventryApp\frontend
keytool -genkeypair -v -keystore android\app\upload-keystore.jks -alias inventory-upload -keyalg RSA -keysize 2048 -validity 10000
```

Create `android/key.properties` from the example file and fill real passwords:

```powershell
Copy-Item android\key.properties.example android\key.properties
```

Build release APK:

```powershell
npm.cmd run android:release:apk
```

Build Play Store AAB:

```powershell
npm.cmd run android:release:aab
```

Release output paths:

```text
frontend/android/app/build/outputs/apk/release/app-release.apk
frontend/android/app/build/outputs/bundle/release/app-release.aab
```

Keep these files private and backed up:

```text
frontend/android/app/upload-keystore.jks
frontend/android/key.properties
```

## 20. Security Design

- Firebase manages identity and password authentication.
- Backend verifies Firebase ID tokens with Firebase Admin SDK.
- Backend issues application JWTs for API authorization.
- Tenant data is scoped by MongoDB owner id.
- Cloudinary API secret stays on the backend.
- MongoDB credentials stay on the backend.
- Helmet sets secure HTTP headers.
- Rate limiting protects API endpoints.
- Zod validates incoming request data.
- Centralized error middleware prevents raw internal errors from leaking.
- Release signing files are ignored by Git.

## 21. Testing And Quality Commands

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

## 22. Production Readiness Checklist

- Backend deployed with HTTPS.
- `API_URL` points to deployed backend.
- MongoDB Atlas database user has least required permissions.
- MongoDB Atlas network access is configured.
- Firebase Email/Password and Google providers are enabled.
- Firebase Android package is `com.inventorymobile`.
- Upload key SHA-1/SHA-256 added to Firebase.
- Play App Signing SHA-1/SHA-256 added to Firebase after Play upload.
- Cloudinary credentials are configured on backend only.
- JWT secret is strong and private.
- Release keystore is backed up.
- AAB is built for Play Store.
- Real device testing is completed.

## 23. Future Expansion

The project is structured for future admin and SaaS expansion:

- Admin dashboard
- Organization/team accounts
- Role-based permissions beyond user/admin
- Subscription billing
- Multi-location inventory
- Purchase orders
- Sales invoices
- Supplier management
- Advanced audit exports
- Scheduled low-stock push notifications
- Web dashboard sharing the same backend API

## 24. Summary

Inventory Pro is a mobile-first SaaS inventory management system with a modern React Native client and secure Express/MongoDB backend. It combines Firebase identity, JWT API sessions, tenant-scoped data, Cloudinary image handling, product analytics, inventory logs, reports, and release-ready Android signing in one production-oriented codebase.