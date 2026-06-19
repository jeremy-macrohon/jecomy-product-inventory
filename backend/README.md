# Backend (Dart) stub

This folder contains a minimal Dart `shelf` server stub for the Jecomy inventory backend.

## Quick start (requires Dart SDK)

```bash
cd backend
dart pub get
dart run bin/server.dart
```

## Endpoints

- `POST /auth/register` — create a new user account
- `POST /auth/login` — receive a JWT token
- `GET /products` — list products (requires auth)
- `POST /products` — add a product (requires auth)
- `PUT /products/<id>` — update a product (requires auth)
- `DELETE /products/<id>` — remove a product (requires auth)
- `GET /insights` — inventory insights (requires auth)

## Notes

- This Dart backend is a prototype using in-memory storage.
- Use a database and secure JWT secret before production.
- The mobile app can be configured to hit this backend instead of the Node backend.
