//tests/unit/post.test.js

const request = require('supertest');
const app = require('../../src/app');

describe('PUT /v1/fragments/:id', () => {
  // If the request is missing the Authorization header, it should be forbidden
  test('unauthenticated requests are denied', () => request(app).post('/v1/fragments').expect(401));

  // If the wrong username/password pair are used (no such user), it should be forbidden
  test('incorrect credentials are denied', () =>
    request(app).post('/v1/fragments').auth('invalid@email.com', 'incorrect_password').expect(401));

  // Using a valid username/password pair with a different content-type should return a HTTP 400 response
  test('authenticated requests with a different incoming content-type return a HTTP 400 Response', async () => {
    const res1 = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send('This is a text fragment');
    expect(res1.statusCode).toBe(201);
    expect(res1.body.status).toBe('ok');

    const res2 = await request(app)
      .put(`/v1/fragments/${res1.body.fragment.id}`)
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'application/json')
      .send({ test_fragment: "'This is an updated text fragment'" });
    expect(res2.statusCode).toBe(400);
  });

  // Using a valid username/password pair should return a HTTP 200 response
  test('valid authenticated requests return a HTTP 200 Response', async () => {
    const res1 = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send('This is a text fragment');
    expect(res1.statusCode).toBe(201);
    expect(res1.body.status).toBe('ok');

    const res2 = await request(app)
      .put(`/v1/fragments/${res1.body.fragment.id}`)
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send('This is an updated text fragment');
    expect(res2.statusCode).toBe(200);
    expect(res2.body.status).toBe('ok');

    const res3 = await request(app)
      .get(`/v1/fragments/${res1.body.fragment.id}`)
      .auth('user1@email.com', 'password1');
    expect(res3.text).toBe('This is an updated text fragment');
    expect(res3.statusCode).toBe(200);
  });
});
