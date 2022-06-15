//tests/unit/post.test.js

const request = require('supertest');

const app = require('../../src/app');

describe('POST /v1/fragments', () => {
  // If the request is missing the Authorization header, it should be forbidden
  test('unauthenticated requests are denied', () => request(app).post('/v1/fragments').expect(401));

  // If the wrong username/password pair are used (no such user), it should be forbidden
  test('incorrect credentials are denied', () =>
    request(app).post('/v1/fragments').auth('invalid@email.com', 'incorrect_password').expect(401));

  // Using a valid username/password pair should give a success result with a locations headers
  test('authenticated requests return a HTTP 201 Response', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send('This is a text fragment');
    expect(res.statusCode).toBe(201);
    expect(res.body.status).toBe('ok');
  });

  // Using a valid username/password pair should give a success result with a locations headers
  test('authenticated requests return a location header', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send('This is a text fragment');
    expect(res.statusCode).toBe(201);
    expect(res.body.status).toBe('ok');
    expect(res.header).toHaveProperty('location');
  });
});
