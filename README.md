# Jecomy Product Inventory

A spec-driven scaffold for a mobile product inventory super app tailored to a motor lubricants and parts shop.

## Architecture

- Frontend: React Native mobile app in `mobile/` with iOS and Windows support
- Backend: Node.js API in `src/` with JWT auth, product inventory, and insights
- Dart backend stub in `backend/` for an alternate Dart/Shelf implementation
- Spec-driven API scenarios in `specs/` using Gherkin and `@cucumber/cucumber`

## Setup

### Root install

```bash
cd "e:/VSCode/New folder"
npm install
```

### Run Node backend

```bash
npm start
```

### Run tests and specs

```bash
npm test
npm run specs:api
```

## Mobile app

```bash
cd mobile
npm install
```

For iOS:

```bash
npx pod-install ios
npm run ios
```

For Android:

```bash
npm run android
```

For Windows:

```bash
npm run windows
```

## Project structure

- `src/`: Node backend with JWT auth and inventory endpoints
- `mobile/`: React Native app scaffold with login, scanner, dashboard, and insights
- `backend/`: Dart/Shelf backend stub with auth and products
- `specs/`: Gherkin feature files and step definitions
- `.github/workflows/nodejs.yml`: CI workflow for running tests and specs

## Notes

- The backend is in-memory and intended as a prototype. Replace storage with a database before production.
- The mobile scaffold includes `screens/BarcodeScanner.js` for a native camera scanning example using `react-native-vision-camera`.
- If running mobile on a physical device, update `mobile/api.js` from `http://localhost:3000` to your backend host.
- The Dart backend now supports `/auth/register`, `/auth/login`, `/products`, and `/insights`.
