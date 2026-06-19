# Mobile (React Native) scaffold

This folder contains a minimal React Native scaffold targeted at iOS and Windows (React Native Windows).

## Quick start

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

## What is included

- `AuthContext.js` — auth state provider and session context
- `api.js` — API helper for login, register, inventory, and insights
- `App.js`, `navigation/AppNavigator.js` — app entry and stack navigation
- `screens/Login.js` — login screen for JWT authentication
- `screens/Scanner.js` — scanner scaffold with simulated scan support
- `screens/BarcodeScanner.js` — Vision Camera barcode scanner example
- `screens/Dashboard.js`, `components/ProductList.js` — inventory dashboard and product list
- `screens/Insights.js` — inventory insights screen

## Barcode scanner

This scaffold includes a native barcode scanner example using `react-native-vision-camera` and `vision-camera-code-scanner`.

### Notes

- `react-native-vision-camera` requires native installation and camera permissions.
- Use a real device or an emulator with camera support for scanning.
- When running on a device, update `api.js` from `http://localhost:3000` to the appropriate backend host.

## Tips

- If you want a simpler Expo path, use `expo-barcode-scanner` instead, but Expo does not support Windows.
- For real inventory data, replace `http://localhost:3000` with your deployed backend URL.

