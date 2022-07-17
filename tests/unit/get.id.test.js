const request = require('supertest');

const app = require('../../src/app');

describe('GET /v1/fragments/:id', () => {
  // If the request is missing the Authorization header, it should be forbidden
  test('unauthenticated requests are denied', () =>
    request(app).get('/v1/fragments/sfj448ge5i').expect(401));

  // If the wrong username/password pair are used (no such user), it should be forbidden
  test('incorrect credentials are denied', () =>
    request(app)
      .get('/v1/fragments/sfj448ge5i')
      .auth('invalid@email.com', 'incorrect_password')
      .expect(401));

  // Using a valid username/password pair should give a back 200 HTTP Response
  test('authenticated requests return a HTTP 200 Response', async () => {
    const res1 = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send('This is a text fragment');

    const res2 = await request(app)
      .get(`/v1/fragments/${res1.body.fragment.id}`)
      .auth('user1@email.com', 'password1');
    expect(res2.statusCode).toBe(200);
  });

  // Using a valid username/password pair should give back the text fragment
  test('authenticated requests return a text fragment when a valid ID is given', async () => {
    const res1 = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send('This is a text fragment');

    const res2 = await request(app)
      .get(`/v1/fragments/${res1.body.fragment.id}`)
      .auth('user1@email.com', 'password1');
    expect(res2.text).toBe('This is a text fragment');
  });

  // Using valid credentials to request for markdown content to be converted to HTML works
  test('authenticated requests for markdown content converted to HTML work properly', async () => {
    const res1 = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/markdown')
      .send('# This is a fragment');

    const res2 = await request(app)
      .get(`/v1/fragments/${res1.body.fragment.id}.html`)
      .auth('user1@email.com', 'password1');
    expect(res2.statusCode).toBe(200);
    expect(res2.text).toEqual('<h1>This is a fragment</h1>');
  });
});
