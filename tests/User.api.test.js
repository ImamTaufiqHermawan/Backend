const request = require('supertest');
const app = require('../app');

describe('API Login', () => {
  it('success login', async () => {
    const user = {
      identifier: '1234567890',
      password: 'password123',
    };
    const response = await request(app).post('/api/v1/auths/login').send(user);
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe('Login successfully');
    expect(response.body.success).toBe(true);
    expect(response.body.data.accessToken).toBeDefined();
    expect(response.body.data.accessToken).not.toBeNull();
  });
  it('failed login, wrong password', async () => {
    const user = {
      identifier: '1234567890',
      password: 'wrong password',
    };
    const response = await request(app).post('/api/v1/auths/login').send(user);
    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe('Sorry, wrong password');
  });
  it('failed login, email or phone not register', async () => {
    const user = {
      identifier: 'wrongemail@example.com',
      password: 'password123',
    };
    const response = await request(app).post('/api/v1/auths/login').send(user);
    expect(response.statusCode).toBe(404);
    expect(response.body.message).toBe('Email address or Phone not registered');
  });
});
