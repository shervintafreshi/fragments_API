// tests/unit/get.test.js

const request = require('supertest');

const app = require('../../src/app');

describe('GET /v1/fragments', () => {
  // If the request is missing the Authorization header, it should be forbidden
  test('unauthenticated requests are denied', () => request(app).get('/v1/fragments').expect(401));

  // If the wrong username/password pair are used (no such user), it should be forbidden
  test('incorrect credentials are denied', () =>
    request(app).get('/v1/fragments').auth('invalid@email.com', 'incorrect_password').expect(401));

  // Using a valid username/password pair should give a success result with a .fragments array
  test('authenticated users get a fragments array', async () => {
    const res = await request(app).get('/v1/fragments').auth('user1@email.com', 'password1');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(Array.isArray(res.body.fragments)).toBe(true);
  });

  // Using a valid username/password pair to retrieve several stored fragments should work
  test('authenticated requests return a fragments array with the valid elements', async () => {
    const res1 = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send('This is a text fragment');

    const res2 = await request(app).get('/v1/fragments').auth('user1@email.com', 'password1');
    expect(res2.statusCode).toBe(200);
    expect(res2.body.status).toBe('ok');
    expect(Array.isArray(res2.body.fragments)).toBe(true);
    expect(res2.body.fragments.length).toBe(1);
    expect(res2.body.fragments[0]).toBe(res1.body.fragment.id);
  });

  // Using a valid username/password pair to retrieve several stored fragments with the expand option set should work
  test('authenticated requests with the expand option set return a fragments array with the valid elements', async () => {
    const res2 = await request(app)
      .get('/v1/fragments?expand=1')
      .auth('user1@email.com', 'password1');
    expect(res2.statusCode).toBe(200);
    expect(res2.body.status).toBe('ok');
    expect(Array.isArray(res2.body.fragments)).toBe(true);
    expect(res2.body.fragments.length).toBe(1);
    expect(res2.body.fragments[0]).toHaveProperty('id');
    expect(res2.body.fragments[0]).toHaveProperty('ownerId');
    expect(res2.body.fragments[0]).toHaveProperty('created');
    expect(res2.body.fragments[0]).toHaveProperty('updated');
    expect(res2.body.fragments[0]).toHaveProperty('type');
    expect(res2.body.fragments[0]).toHaveProperty('size');
  });
});
