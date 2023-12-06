const request = require('supertest');
const app = require('../app');

describe('API Category', () => {
  it('success get category', async () => {
    const response = await request(app).get('/api/v1/categories');
    expect(response.statusCode).toBe(200);
    expect(response.body.data).not.toBeNull();
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe('Get all category successfully');
  });
});
