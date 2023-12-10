const request = require('supertest');
const app = require('../app');

describe('API Notification', () => {
  let userToken;
  let adminToken;
  let notificationSample;
  let idUser;
  beforeAll(async () => {
    const loginAdmin = await request(app).post('/api/v1/auths/login').send({
      identifier: 'admin@example.com',
      password: 'adminpass',
    });
    adminToken = loginAdmin.body.data.accessToken;

    const loginUser = await request(app).post('/api/v1/auths/login').send({
      identifier: 'user1@example.com',
      password: 'password123',
    });
    userToken = loginUser.body.data.accessToken;

    const getUsers = await request(app).get('/api/v1/users')
        .set('Authorization', `Bearer ${adminToken}`);
    idUser = getUsers.body.data[0]._id;
  });
  it('success get notification', async () => {
    const response = await request(app).get('/api/v1/notifications')
        .set('Authorization', `Bearer ${userToken}`);
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe('Get all notifications success');
    expect(response.body.success).toBe(true);
  });
  it('failed get notification, not login', async () => {
    const response = await request(app).get('/api/v1/notifications');
    expect(response.body.message)
        .toBe('You are unauthorized to make this request, Login please');
    expect(response.statusCode).toBe(401);
  });
  it('success create notification', async () => {
    const newNotification = {
      title: 'Promo',
      description: 'example description for promo',
    };
    const response = await request(app)
        .post('/api/v1/notifications')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(newNotification);
    expect(response.statusCode).toBe(201);
    expect(response.body.message).toBe('Create notification successfully');
    expect(response.body.success).toBe(true);
    expect(response.body.data).not.toBeNull();
  });
  it('failed create notification, not admin', async () => {
    const newNotification = {
      title: 'Promo',
      description: 'example description for promo',
    };
    const response = await request(app)
        .post('/api/v1/notifications')
        .set('Authorization', `Bearer ${userToken}`)
        .send(newNotification);
    expect(response.statusCode).toBe(403);
    expect(response.body.message)
        .toBe('Access forbidden, only admin can make this request');
    expect(response.body.success).toBe(false);
    expect(response.body.status).toBe('Failed');
  });
  it('failed create notification, not login', async () => {
    const newNotification = {
      title: 'Promo',
      description: 'example description for promo',
    };
    const response = await request(app).post('/api/v1/notifications')
        .send(newNotification);
    expect(response.body.message)
        .toBe('You are unauthorized to make this request, Login please');
    expect(response.statusCode).toBe(401);
  });
  it('failed create notification, field not full', async () => {
    const newNotification = {
      title: 'Promo',
    };
    const response = await request(app).post('/api/v1/notifications')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(newNotification);
    expect(response.body.message)
        .toBe('All fields are mandatory');
    expect(response.statusCode).toBe(400);
  });
  it('success create notification 1 user', async () => {
    const newNotification = {
      title: 'Notification for user1',
      description: 'Description notification',
      userId: idUser,
    };
    const response = await request(app)
        .post(`/api/v1/notifications/specific`)
        .send(newNotification)
        .set('Authorization', `Bearer ${adminToken}`);
    notificationSample = response.body.data;
    expect(response.statusCode).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe('Create notification successfully');
    expect(response.body.data).not.toBeNull();
  });
  it('failed create 1 notification, field not full', async () => {
    const newNotification = {
      title: 'Promo',
    };
    const response = await request(app).post('/api/v1/notifications/specific')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(newNotification);
    expect(response.body.message)
        .toBe('All fields are mandatory');
    expect(response.statusCode).toBe(400);
  });
  it('failed create 1 notification, not admin', async () => {
    const newNotification = {
      title: 'Promo',
      description: 'example description for promo',
      userId: idUser,
    };
    const response = await request(app)
        .post('/api/v1/notifications/specific')
        .set('Authorization', `Bearer ${userToken}`)
        .send(newNotification);
    expect(response.statusCode).toBe(403);
    expect(response.body.message)
        .toBe('Access forbidden, only admin can make this request');
    expect(response.body.success).toBe(false);
    expect(response.body.status).toBe('Failed');
  });
  it('failed create 1 notification, user not found', async () => {
    const newNotification = {
      title: 'Promo',
      description: 'example description for promo',
      userId: 'aaaaaaaaaaaaaaaaaaaaaaaa',
    };
    const response = await request(app)
        .post('/api/v1/notifications/specific')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(newNotification);
    expect(response.statusCode).toBe(404);
    expect(response.body.message)
        .toBe('User not found');
    expect(response.body.success).toBe(false);
    expect(response.body.status).toBe('Failed');
  });
  it('failed create 1 notification, not login', async () => {
    const newNotification = {
      title: 'Promo',
      description: 'example description for promo',
      userId: idUser,
    };
    const response = await request(app).post('/api/v1/notifications/specific')
        .send(newNotification);
    expect(response.body.message)
        .toBe('You are unauthorized to make this request, Login please');
    expect(response.statusCode).toBe(401);
  });
  it('success read notification', async () => {
    const response = await request(app)
        .patch( `/api/v1/notifications/${notificationSample._id}`)
        .set('Authorization', `Bearer ${userToken}`);
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe('message has been read');
    expect(response.body.success).toBe(true);
    expect(response.body.data).not.toBeNull();
  });
  it('fail read notification, not login', async () => {
    const response = await request(app)
        .patch( `/api/v1/notifications/${notificationSample._id}`);
    expect(response.body.message)
        .toBe('You are unauthorized to make this request, Login please');
    expect(response.statusCode).toBe(401);
  });
});
