// tests/unit/app.test.js

const request = require('supertest');

const app = require('../../src/app');

// If the request targets a non-existent route, a 404 status code should be returned
describe('GET /*', () => {
  test('Route does not exist -> 404 Returned', () => request(app).get('/*').expect(404));
});
