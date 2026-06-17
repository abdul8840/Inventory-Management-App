# Inventory Pro Mobile

React Native CLI mobile client for Inventory Pro.

## Stack

- React Native CLI, TypeScript
- React Navigation
- Redux Toolkit
- TanStack Query with AsyncStorage persistence
- React Hook Form and Zod
- Firebase Authentication with Email/Password and Google Sign-In
- React Native Paper and NativeWind
- Cloudinary product image uploads through the backend
- Vision Camera barcode/QR scanner integration
- React Native Firebase Messaging push-token registration
- CSV/PDF report downloads through authenticated API requests

## Setup

```bash
cp .env.example .env
npm install
npm start
```

Android:

```bash
npm run android
```

iOS:

```bash
cd ios
pod install
cd ..
npm run ios
```

## Environment Variables

| Variable | Purpose |
| --- | --- |
| `API_URL` | Backend API URL, for example `http://10.0.2.2:5000/api/v1` |
| `GOOGLE_WEB_CLIENT_ID` | Firebase Google web client id |
| `IOS_CLIENT_ID` | Firebase iOS client id |
| `ANDROID_CLIENT_ID` | Firebase Android client id |

## Firebase Mobile Configuration

1. Create Android and iOS apps in Firebase Console.
2. Android package name should match the native app id.
3. Download `google-services.json` to `android/app/google-services.json`.
4. Download `GoogleService-Info.plist` to `ios/`.
5. Enable Email/Password and Google Sign-In providers.
6. Configure SHA-1/SHA-256 fingerprints for Android Google Sign-In.

## Native Setup Notes

The Android and iOS React Native CLI shells are included. Before running the app, add your Firebase native config files:

- Android: copy `android/app/google-services.json.example` to `android/app/google-services.json` and replace the placeholder values, or download the file from Firebase.
- iOS: copy `ios/GoogleService-Info.plist.example` to `ios/GoogleService-Info.plist` and replace the placeholder values, or download the file from Firebase.

Android package id and iOS bundle id are set to `com.inventorymobile`. If you change them in Firebase, update the native project files to match.

## Main Screens

- Splash and onboarding
- Login, registration, forgot password, email verification
- Dashboard with inventory value, sales, profit, low stock, and charts
- Product list with search, filters, pull-to-refresh, and scanner entry
- Product create/edit form with validation and image upload
- Product details with stock sale/restock actions
- Notifications
- Profile and logout
- Settings with theme, alerts, push registration, CSV/PDF exports

## Offline and Performance

- TanStack Query persists query cache in AsyncStorage.
- NetInfo updates online/offline status for query retries.
- Product mutations invalidate only affected query scopes.
- Images are compressed on the backend before Cloudinary upload.
- FlatList is used for inventory lists.

## Accessibility

- Product rows use button roles and descriptive labels.
- Form fields expose native labels through React Native Paper.
- Color palette avoids relying on a single status color for critical state.

## Build Readiness

Android release:

```bash
cd android
./gradlew assembleRelease
```

iOS release:

```bash
cd ios
pod install
open InventoryMobile.xcworkspace
```

Keep signing credentials outside source control.

## Troubleshooting

- Android cannot reach API: use `http://10.0.2.2:5000/api/v1`.
- Google Sign-In returns no token: check Firebase web client id and Android SHA fingerprints.
- Firebase native module missing: confirm `google-services.json`, `GoogleService-Info.plist`, pods, and Gradle plugin setup.
- Camera is blank: grant camera permission and test on a physical device for Vision Camera.
- Reports fail: verify the app has a valid API JWT and backend report endpoints are reachable.
