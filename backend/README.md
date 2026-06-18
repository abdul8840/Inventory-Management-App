# Inventory SaaS API

Secure multi-tenant REST API for Inventory Pro.

## Stack

- Node.js, Express.js, TypeScript
- MongoDB Atlas, Mongoose
- Firebase Admin for Firebase ID token verification
- JWT app sessions
- Cloudinary and Sharp for optimized image uploads
- Zod validation
- Helmet, CORS, rate limiting, centralized errors
- Swagger API documentation
- CSV/PDF inventory exports

## Setup

```bash
cp .env.example .env
npm install
npm run dev
```

The API starts at:

```text
http://localhost:5000/api/v1
```

Swagger:

```text
http://localhost:5000/api/v1/docs
```

## Environment Variables

| Variable | Purpose |
| --- | --- |
| `NODE_ENV` | `development`, `test`, or `production` |
| `PORT` | API port |
| `CLIENT_ORIGIN` | Comma-separated allowed CORS origins |
| `MONGODB_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Strong secret, at least 32 chars |
| `JWT_EXPIRES_IN` | JWT lifetime, for example `7d` |
| `FIREBASE_PROJECT_ID` | Firebase project id |
| `FIREBASE_CLIENT_EMAIL` | Firebase service account client email |
| `FIREBASE_PRIVATE_KEY` | Firebase service account private key with escaped newlines |
| `FIREBASE_SERVICE_ACCOUNT_BASE64` | Alternative base64 encoded full service account JSON |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |
| `CLOUDINARY_FOLDER` | Cloudinary upload folder |

## Firebase Configuration

1. Open Firebase Console.
2. Enable Authentication providers: Email/Password and Google.
3. Go to Project Settings > Service Accounts.
4. Generate a private key.
5. Either paste individual fields into `.env` or base64 encode the whole JSON file and set `FIREBASE_SERVICE_ACCOUNT_BASE64`.

## MongoDB Atlas

1. Create a cluster.
2. Create a database user with read/write access.
3. Add your API host IP to Network Access.
4. Put a database name in the connection string path.
5. Use a connection string like:

```text
mongodb+srv://<username>:<password>@<cluster>.mongodb.net/inventory_app?retryWrites=true&w=majority
```

## Cloudinary

1. Create a Cloudinary account.
2. Copy Cloud Name, API Key, and API Secret.
3. Set `CLOUDINARY_FOLDER=inventory-products`.
4. The upload endpoint compresses images to WebP before upload.

## Authentication

The API does not store user passwords. Firebase owns identity. The API creates app sessions by verifying Firebase ID tokens:

```http
POST /api/v1/auth/session
Content-Type: application/json

{
  "idToken": "firebase-id-token"
}
```

The response contains an app JWT. Send it as:

```http
Authorization: Bearer <jwt>
```

## Core Endpoints

| Method | Route | Description |
| --- | --- | --- |
| `POST` | `/auth/session` | Exchange Firebase token for app JWT |
| `GET` | `/auth/me` | Current MongoDB user |
| `PATCH` | `/auth/account` | Update account profile |
| `GET` | `/products` | Search, filter, sort, paginate products |
| `POST` | `/products` | Create product |
| `GET` | `/products/:id` | Product details |
| `PATCH` | `/products/:id` | Update product |
| `DELETE` | `/products/:id` | Delete product |
| `POST` | `/products/:id/stock` | Record sale, restock, adjust stock |
| `POST` | `/products/bulk` | Bulk delete/status/category updates |
| `POST` | `/uploads/product-image` | Upload optimized product image |
| `GET` | `/analytics/dashboard` | Dashboard analytics |
| `GET` | `/reports/inventory.csv` | CSV export |
| `GET` | `/reports/inventory.pdf` | PDF export |
| `GET` | `/notifications` | User notifications |
| `GET` | `/settings` | User settings |

## Data Isolation

Every protected request resolves the JWT to a MongoDB user. Product, analytics, report, notification, settings, and inventory-log queries include `owner: req.auth.userId`. This is the SaaS tenant boundary.

## Build and Deploy

```bash
npm run build
npm start
```

Recommended deployment targets:

- Render, Fly.io, Railway, AWS ECS, Google Cloud Run, Azure App Service
- MongoDB Atlas for database
- Cloudinary for image storage

Production checklist:

- Set `NODE_ENV=production`
- Use a strong `JWT_SECRET`
- Restrict `CLIENT_ORIGIN`
- Enable MongoDB Atlas backups
- Store secrets in the deployment platform, not in source control
- Run `npm run build` before deploy

## Troubleshooting

- `Invalid backend environment configuration`: check required `.env` values.
- `Cloudinary is not configured`: set all Cloudinary credentials.
- `Invalid or expired authentication token`: refresh Firebase session on mobile and create a new API session.
- CORS errors: add the mobile debug host or web origin to `CLIENT_ORIGIN`.
- `Could not connect to any servers in your MongoDB Atlas cluster`: open Atlas > Network Access > Add IP Address > Add Current IP Address, then restart `npm run dev`.
- `MongoDB database: not set in URI`: add a database name before the query string, for example `/inventory_app?retryWrites=true&w=majority`.
- Mongo authentication errors: check the Atlas database user's username/password and URL-encode special characters in the password.
