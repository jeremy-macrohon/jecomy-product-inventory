const request = require('supertest');
const app = require('../src/index');

describe('Product Inventory API', () => {
  it('returns empty product list', async () => {
    const res = await request(app).get('/products');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([]);
  });

  it('creates a product', async () => {
    const product = { id: '1', name: 'Laptop', quantity: 10 };
    const res = await request(app).post('/products').send(product);
    expect(res.statusCode).toBe(201);
    expect(res.body).toEqual(product);
  });
});
