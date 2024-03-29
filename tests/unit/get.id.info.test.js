const request = require('supertest');
const app = require('../../src/app');

describe('GET /v1/fragments/:id/info', () => {
  // If the request is missing the Authorization header, it should be forbidden
  test('unauthenticated requests are denied', () =>
    request(app).get('/v1/fragments/sfj448ge5i/info').expect(401));

  // If the wrong username/password pair are used (no such user), it should be forbidden
  test('incorrect credentials are denied', () =>
    request(app)
      .get('/v1/fragments/sfj448ge5i/info')
      .auth('invalid@email.com', 'incorrect_password')
      .expect(401));

  // Using a valid username/password pair and fragment id should return HTTP 200 response
  test('valid authenticated requests return a HTTP 200 Response', async () => {
    const res1 = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send('This is a text fragment');

    const res2 = await request(app)
      .get(`/v1/fragments/${res1.body.fragment.id}/info`)
      .auth('user1@email.com', 'password1');
    expect(res2.statusCode).toBe(200);
    expect(res2.body.status).toBe('ok');
  });

  // Using a valid username/password pair and fragment id should return fragment metadata
  test('valid authenticated requests return properly formatted fragment metadata object', async () => {
    const res1 = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send('This is a text fragment');

    const res2 = await request(app)
      .get(`/v1/fragments/${res1.body.fragment.id}/info`)
      .auth('user1@email.com', 'password1');
    expect(res2.statusCode).toBe(200);
    expect(res2.body.status).toBe('ok');
    expect(res2.body).toHaveProperty('fragment');
    expect(res2.body.fragment).toHaveProperty('id');
    expect(res2.body.fragment).toHaveProperty('created');
    expect(res2.body.fragment).toHaveProperty('updated');
    expect(res2.body.fragment).toHaveProperty('ownerId');
    expect(res2.body.fragment).toHaveProperty('type');
    expect(res2.body.fragment).toHaveProperty('size');
  });
});
