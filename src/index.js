const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

const users = [];
const products = [];
const inventoryEvents = [];
const JWT_SECRET = process.env.JWT_SECRET || 'change-me-in-production';

function requireAuth(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authorization required.' });
  }
  const token = auth.slice(7);
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token.' });
  }
}

function createToken(user) {
  return jwt.sign({ sub: user.id, email: user.email, name: user.name }, JWT_SECRET, { expiresIn: '12h' });
}

app.post('/auth/register', async (req, res) => {
  const { email, password, name } = req.body;
  if (!email || !password || !name) {
    return res.status(400).json({ error: 'Email, password, and name are required.' });
  }
  const existing = users.find((u) => u.email === email);
  if (existing) {
    return res.status(409).json({ error: 'User already exists.' });
  }
  const passwordHash = await bcrypt.hash(password, 10);
  const user = { id: `${users.length + 1}`, email, name, passwordHash };
  users.push(user);
  const token = createToken(user);
  res.status(201).json({ token, user: { id: user.id, email: user.email, name: user.name } });
});

app.post('/auth/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }
  const user = users.find((u) => u.email === email);
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    return res.status(401).json({ error: 'Invalid credentials.' });
  }
  const token = createToken(user);
  res.json({ token, user: { id: user.id, email: user.email, name: user.name } });
});

app.post('/test/reset', (req, res) => {
  users.length = 0;
  products.length = 0;
  inventoryEvents.length = 0;
  res.json({ reset: true });
});

app.get('/products', requireAuth, (req, res) => {
  res.json(products);
});

app.post('/products', requireAuth, (req, res) => {
  const product = req.body;
  if (!product.id || !product.name || product.quantity == null) {
    return res.status(400).json({ error: 'Product id, name, and quantity are required.' });
  }
  products.push(product);
  inventoryEvents.push({ type: 'added', productId: product.id, quantity: product.quantity, userId: req.user.sub, date: new Date().toISOString() });
  res.status(201).json(product);
});

app.put('/products/:id', requireAuth, (req, res) => {
  const productId = req.params.id;
  const index = products.findIndex((p) => p.id === productId);
  if (index === -1) {
    return res.status(404).json({ error: 'Product not found.' });
  }
  const updated = { ...products[index], ...req.body };
  products[index] = updated;
  inventoryEvents.push({ type: 'updated', productId, changes: req.body, userId: req.user.sub, date: new Date().toISOString() });
  res.json(updated);
});

app.delete('/products/:id', requireAuth, (req, res) => {
  const productId = req.params.id;
  const index = products.findIndex((p) => p.id === productId);
  if (index === -1) {
    return res.status(404).json({ error: 'Product not found.' });
  }
  const deleted = products.splice(index, 1)[0];
  inventoryEvents.push({ type: 'deleted', productId, userId: req.user.sub, date: new Date().toISOString() });
  res.json(deleted);
});

app.get('/insights', requireAuth, (req, res) => {
  const totalProducts = products.length;
  const totalQuantity = products.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0);
  const eventsByType = inventoryEvents.reduce((acc, event) => {
    acc[event.type] = (acc[event.type] || 0) + 1;
    return acc;
  }, {});
  res.json({ totalProducts, totalQuantity, eventsByType, recentEvents: inventoryEvents.slice(-10).reverse() });
});

if (require.main === module) {
  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
}

module.exports = app;
