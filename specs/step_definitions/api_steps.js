const { Given, When, Then, Before } = require('@cucumber/cucumber');
const request = require('supertest');
const app = require('../../src/index');
const assert = require('assert');

Before(async function () {
  await request(app).post('/test/reset');
});

Given('the inventory is empty', async function () {
  const res = await request(app)
    .post('/auth/register')
    .send({ email: 'admin@jecomy.com', password: 'SecurePass123', name: 'Admin' });
  assert.strictEqual(res.statusCode, 201);
  this.token = res.body.token;
});

Given('there is a user account with email {string} and password {string} and name {string}', async function (email, password, name) {
  const res = await request(app)
    .post('/auth/register')
    .send({ email, password, name });
  assert.strictEqual(res.statusCode, 201);
});

Given('I am logged in', async function () {
  const res = await request(app)
    .post('/auth/login')
    .send({ email: 'admin@jecomy.com', password: 'SecurePass123' });
  assert.strictEqual(res.statusCode, 200);
  this.token = res.body.token;
});

Given('a product exists with id {string} name {string} and quantity {int}', async function (id, name, quantity) {
  const product = { id, name, quantity };
  const res = await request(app)
    .post('/products')
    .set('Authorization', `Bearer ${this.token}`)
    .send(product);
  assert.strictEqual(res.statusCode, 201);
});

When('I create a product with id {string} name {string} and quantity {int}', async function (id, name, quantity) {
  const product = { id, name, quantity };
  const res = await request(app)
    .post('/products')
    .set('Authorization', `Bearer ${this.token}`)
    .send(product);
  assert.strictEqual(res.statusCode, 201);
});

When('I update product {string} quantity to {int}', async function (id, quantity) {
  const res = await request(app)
    .put(`/products/${id}`)
    .set('Authorization', `Bearer ${this.token}`)
    .send({ quantity });
  assert.strictEqual(res.statusCode, 200);
});

When('I request inventory insights', async function () {
  const res = await request(app)
    .get('/insights')
    .set('Authorization', `Bearer ${this.token}`);
  assert.strictEqual(res.statusCode, 200);
  this.insights = res.body;
});

Then('the product list should contain a product with id {string}', async function (id) {
  const res = await request(app)
    .get('/products')
    .set('Authorization', `Bearer ${this.token}`);
  assert.strictEqual(res.statusCode, 200);
  const found = res.body.find((p) => p.id === id);
  assert.ok(found, `Expected product ${id} in list`);
});

Then('the product {string} should have quantity {int}', async function (id, expectedQuantity) {
  const res = await request(app)
    .get('/products')
    .set('Authorization', `Bearer ${this.token}`);
  assert.strictEqual(res.statusCode, 200);
  const found = res.body.find((p) => p.id === id);
  assert.ok(found, `Expected product ${id} in list`);
  assert.strictEqual(found.quantity, expectedQuantity);
});

Then('the insights should show total products {int} and total quantity {int}', function (totalProducts, totalQuantity) {
  assert.strictEqual(this.insights.totalProducts, totalProducts);
  assert.strictEqual(this.insights.totalQuantity, totalQuantity);
});
