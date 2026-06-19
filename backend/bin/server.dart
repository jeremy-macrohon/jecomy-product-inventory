import 'dart:convert';
import 'dart:io';

import 'package:crypto/crypto.dart';
import 'package:dart_jsonwebtoken/dart_jsonwebtoken.dart';
import 'package:shelf/shelf.dart';
import 'package:shelf/shelf_io.dart' as io;
import 'package:shelf_router/shelf_router.dart';

final List<Map<String, dynamic>> users = [];
final List<Map<String, dynamic>> products = [];
final List<Map<String, dynamic>> inventoryEvents = [];
const jwtSecret = 'change-me-in-production';

String hashPassword(String password) {
  return sha256.convert(utf8.encode(password)).toString();
}

Response _json(Object? obj, {int status = HttpStatus.ok}) => Response(status, body: jsonEncode(obj), headers: {'content-type': 'application/json'});

Map<String, dynamic>? validateToken(Request req) {
  final auth = req.headers['authorization'];
  if (auth == null || !auth.startsWith('Bearer ')) return null;
  final token = auth.substring(7);
  try {
    final jwt = JWT.verify(token, SecretKey(jwtSecret));
    return jwt.payload as Map<String, dynamic>;
  } catch (_) {
    return null;
  }
}

void main(List<String> args) async {
  final router = Router();

  router.post('/auth/register', (Request req) async {
    final body = await req.readAsString();
    final data = jsonDecode(body) as Map<String, dynamic>;
    final email = data['email'] as String?;
    final password = data['password'] as String?;
    final name = data['name'] as String?;
    if (email == null || password == null || name == null) {
      return _json({'error': 'Email, password, and name are required.'}, status: HttpStatus.badRequest);
    }
    if (users.any((u) => u['email'] == email)) {
      return _json({'error': 'User already exists.'}, status: HttpStatus.conflict);
    }
    final user = {
      'id': '${users.length + 1}',
      'email': email,
      'name': name,
      'passwordHash': hashPassword(password),
    };
    users.add(user);
    final jwt = JWT({'sub': user['id'], 'email': email, 'name': name});
    final token = jwt.sign(SecretKey(jwtSecret), expiresIn: const Duration(hours: 12));
    return _json({'token': token, 'user': {'id': user['id'], 'email': email, 'name': name}}, status: HttpStatus.created);
  });

  router.post('/auth/login', (Request req) async {
    final body = await req.readAsString();
    final data = jsonDecode(body) as Map<String, dynamic>;
    final email = data['email'] as String?;
    final password = data['password'] as String?;
    if (email == null || password == null) {
      return _json({'error': 'Email and password are required.'}, status: HttpStatus.badRequest);
    }
    final user = users.firstWhere(
      (u) => u['email'] == email && u['passwordHash'] == hashPassword(password),
      orElse: () => {},
    );
    if (user.isEmpty) {
      return _json({'error': 'Invalid credentials.'}, status: HttpStatus.unauthorized);
    }
    final jwt = JWT({'sub': user['id'], 'email': email, 'name': user['name']});
    final token = jwt.sign(SecretKey(jwtSecret), expiresIn: const Duration(hours: 12));
    return _json({'token': token, 'user': {'id': user['id'], 'email': email, 'name': user['name']}});
  });

  router.post('/products', (Request req) async {
    final payload = validateToken(req);
    if (payload == null) return _json({'error': 'Authorization required.'}, status: HttpStatus.unauthorized);
    final body = await req.readAsString();
    final data = jsonDecode(body) as Map<String, dynamic>;
    if (!data.containsKey('id') || !data.containsKey('name') || data['quantity'] == null) {
      return _json({'error': 'Product id, name, and quantity are required.'}, status: HttpStatus.badRequest);
    }
    products.add(data);
    inventoryEvents.add({
      'type': 'added',
      'productId': data['id'],
      'quantity': data['quantity'],
      'userId': payload['sub'],
      'date': DateTime.now().toIso8601String(),
    });
    return _json(data, status: HttpStatus.created);
  });

  router.get('/products', (Request req) {
    final payload = validateToken(req);
    if (payload == null) return _json({'error': 'Authorization required.'}, status: HttpStatus.unauthorized);
    return _json(products);
  });

  router.put('/products/<id>', (Request req, String id) async {
    final payload = validateToken(req);
    if (payload == null) return _json({'error': 'Authorization required.'}, status: HttpStatus.unauthorized);
    final index = products.indexWhere((p) => p['id'] == id);
    if (index == -1) return _json({'error': 'Product not found.'}, status: HttpStatus.notFound);
    final body = await req.readAsString();
    final data = jsonDecode(body) as Map<String, dynamic>;
    products[index] = {...products[index], ...data};
    inventoryEvents.add({
      'type': 'updated',
      'productId': id,
      'changes': data,
      'userId': payload['sub'],
      'date': DateTime.now().toIso8601String(),
    });
    return _json(products[index]);
  });

  router.delete('/products/<id>', (Request req, String id) {
    final payload = validateToken(req);
    if (payload == null) return _json({'error': 'Authorization required.'}, status: HttpStatus.unauthorized);
    final index = products.indexWhere((p) => p['id'] == id);
    if (index == -1) return _json({'error': 'Product not found.'}, status: HttpStatus.notFound);
    final removed = products.removeAt(index);
    inventoryEvents.add({
      'type': 'deleted',
      'productId': id,
      'userId': payload['sub'],
      'date': DateTime.now().toIso8601String(),
    });
    return _json(removed);
  });

  router.get('/insights', (Request req) {
    final payload = validateToken(req);
    if (payload == null) return _json({'error': 'Authorization required.'}, status: HttpStatus.unauthorized);
    final totalProducts = products.length;
    final totalQuantity = products.fold<int>(0, (sum, item) => sum + (item['quantity'] as int));
    final eventsByType = <String, int>{};
    for (final event in inventoryEvents) {
      eventsByType[event['type'] as String] = (eventsByType[event['type'] as String] ?? 0) + 1;
    }
    return _json({
      'totalProducts': totalProducts,
      'totalQuantity': totalQuantity,
      'eventsByType': eventsByType,
      'recentEvents': inventoryEvents.reversed.take(10).toList(),
    });
  });

  final handler = const Pipeline().addMiddleware(logRequests()).addHandler(router);
  final server = await io.serve(handler, 'localhost', 8080);
  print('Dart backend running on http://${server.address.host}:${server.port}');
}
