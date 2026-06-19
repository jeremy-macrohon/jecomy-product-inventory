const request = require('supertest');
const app = require('../src/index');

describe('Product Inventory API', () => {
  let token;

  beforeAll(async () => {
    await request(app).post('/test/reset');
    const res = await request(app)
      .post('/auth/register')
      .send({ email: 'admin@jecomy.com', password: 'SecurePass123', name: 'Admin' });
    token = res.body.token;
  });

  it('returns empty product list', async () => {
    const res = await request(app)
      .get('/products')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([]);
  });

  it('creates a product', async () => {
    const product = { id: '1', name: 'Engine Oil', quantity: 10 };
    const res = await request(app)
      .post('/products')
      .set('Authorization', `Bearer ${token}`)
      .send(product);
    expect(res.statusCode).toBe(201);
    expect(res.body).toEqual(product);
  });

  it('returns insights after product creation', async () => {
    const res = await request(app)
      .get('/insights')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.totalProducts).toBe(1);
    expect(res.body.totalQuantity).toBe(10);
  });
});
