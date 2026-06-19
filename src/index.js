const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

const products = [];

app.get('/products', (req, res) => {
  res.json(products);
});

app.post('/products', (req, res) => {
  const product = req.body;
  if (!product.id || !product.name || product.quantity == null) {
    return res.status(400).json({ error: 'Product id, name, and quantity are required.' });
  }
  products.push(product);
  res.status(201).json(product);
});

app.put('/products/:id', (req, res) => {
  const productId = req.params.id;
  const index = products.findIndex((p) => p.id === productId);
  if (index === -1) {
    return res.status(404).json({ error: 'Product not found.' });
  }
  products[index] = { ...products[index], ...req.body };
  res.json(products[index]);
});

app.delete('/products/:id', (req, res) => {
  const productId = req.params.id;
  const index = products.findIndex((p) => p.id === productId);
  if (index === -1) {
    return res.status(404).json({ error: 'Product not found.' });
  }
  const deleted = products.splice(index, 1);
  res.json(deleted[0]);
});

if (require.main === module) {
  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
}

module.exports = app;
