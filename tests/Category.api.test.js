const request = require('supertest');
const app = require('../app');

describe('API Category', () => {
  it('success get category', async () => {
    const response = await request(app).get('/api/v1/categories');
    expect(response.statusCode).toBe(200);
    expect(response.body.data).not.toBeNull();
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe('Get all category course successfully');
  });
});

describe('API Category statistik', () => {
  it('success get category statistik', async () => {
    const response = await request(app).get('/api/v1/categories/statistik');
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe('Get statistik successfully');
  });
});

describe('API Category type-class', () => {
  it('success get category type-class', async () => {
    const response = await request(app).get('/api/v1/categories/type-class');
    expect(response.statusCode).toBe(200);
    // eslint-disable-next-line max-len
    expect(response.body.message).toBe('Get all category type class successfully');
  });
});

describe('API Category progress', () => {
  it('success get category progress', async () => {
    const response = await request(app).get('/api/v1/categories/progress');
    expect(response.statusCode).toBe(200);
    // eslint-disable-next-line max-len
    expect(response.body.message).toBe('Get all category progress successfully');
  });
});
