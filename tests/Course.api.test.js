const request = require('supertest');
const app = require('../app');

describe('API Course', () => {
  let adminToken;
  let idCategory;
  let idCourse;
  beforeAll(async () => {
    const loginAdmin = await request(app).post('/api/v1/auths/login').send({
      identifier: 'admin@example.com',
      password: 'adminpass',
    });
    adminToken = loginAdmin.body.data.accessToken;
    const categoryResponse = await request(app).get('/api/v1/categories');
    idCategory = categoryResponse.body.data[0]._id;
  });
  it('success get course', async () => {
    const response = await request(app).get('/api/v1/courses');
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe('Get all course successfully');
    expect(response.body.success).toBe(true);
  });
  it('succes post new course', async () => {
    const newCourse = {
      title: 'Dummy Course',
      description: 'This is a dummy course for testing.',
      classCode: 'ABC123',
      category: idCategory,
      typeClass: 'PREMIUM',
      level: 'Beginner',
      price: 1000,
      about: 'About the dummy course.',
    };
    const response = await request(app)
        .post(`/api/v1/courses`)
        .send(newCourse)
        .set('Authorization', `Bearer ${adminToken}`);
    idCourse = response.body.data._id;
    expect(response.statusCode).toBe(201);
    expect(response.body.message).toBe('Create course successfully');
    expect(response.body.success).toBe(true);
  });
  it('failed post new course, id category not found', async () => {
    const newCourse = {
      title: 'Dummy Course',
      description: 'This is a dummy course for testing.',
      classCode: 'ABC123',
      category: '111111111111111111111111',
      typeClass: 'PREMIUM',
      level: 'Beginner',
      price: 1000,
      about: 'About the dummy course.',
    };
    const response = await request(app)
        .post(`/api/v1/courses`)
        .send(newCourse)
        .set('Authorization', `Bearer ${adminToken}`);
    expect(response.statusCode).toBe(404);
    expect(response.body.message).toBe('Id category not found');
  });
  it('failed post new course, not login', async () => {
    const newCourse = {
      title: 'Dummy Course',
      description: 'This is a dummy course for testing.',
      classCode: 'ABC123',
      category: idCategory,
      typeClass: 'PREMIUM',
      level: 'Beginner',
      price: 1000,
      about: 'About the dummy course.',
    };
    const response = await request(app)
        .post(`/api/v1/courses`)
        .send(newCourse);
    expect(response.body.message)
        .toBe('You are unauthorized to make this request, Login please');
    expect(response.statusCode).toBe(401);
  });
  it('succes update course', async () => {
    const newCourse = {
      title: 'Web Course',
      description: 'This is a dummy course for testing.',
      classCode: 'ABC123',
      category: idCategory,
      typeClass: 'PREMIUM',
      level: 'Beginner',
      price: 1000,
      about: 'About the dummy course.',
    };
    const response = await request(app)
        .patch(`/api/v1/courses/${idCourse}`)
        .send(newCourse)
        .set('Authorization', `Bearer ${adminToken}`);
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe('Update course successfully');
    expect(response.body.success).toBe(true);
  });
  it('failed update course, id category not found', async () => {
    const newCourse = {
      title: 'Dummy Course',
      description: 'This is a dummy course for testing.',
      classCode: 'ABC123',
      category: '111111111111111111111111',
      typeClass: 'PREMIUM',
      level: 'Beginner',
      price: 1000,
      about: 'About the dummy course.',
    };
    const response = await request(app)
        .patch(`/api/v1/courses/${idCourse}`)
        .send(newCourse)
        .set('Authorization', `Bearer ${adminToken}`);
    expect(response.statusCode).toBe(404);
    expect(response.body.message).toBe('Id category not found');
  });
  it('failed update course, id course not found', async () => {
    const newCourse = {
      title: 'Dummy Course',
      description: 'This is a dummy course for testing.',
      classCode: 'ABC123',
      category: idCategory,
      typeClass: 'PREMIUM',
      level: 'Beginner',
      price: 1000,
      about: 'About the dummy course.',
    };
    const response = await request(app)
        .patch(`/api/v1/courses/111111111111111111111111`)
        .send(newCourse)
        .set('Authorization', `Bearer ${adminToken}`);
    expect(response.statusCode).toBe(404);
    expect(response.body.message).toBe('Course not found');
  });
  it('failed update course, not login', async () => {
    const newCourse = {
      title: 'Dummy Course',
      description: 'This is a dummy course for testing.',
      classCode: 'ABC123',
      category: idCategory,
      typeClass: 'PREMIUM',
      level: 'Beginner',
      price: 1000,
      about: 'About the dummy course.',
    };
    const response = await request(app)
        .patch(`/api/v1/courses/${idCourse}`)
        .send(newCourse);
    expect(response.body.message)
        .toBe('You are unauthorized to make this request, Login please');
    expect(response.statusCode).toBe(401);
  });
  it('success get course', async () => {
    const response = await request(app).get('/api/v1/courses');
    expect(response.statusCode).toBe(200);
    expect(response.body.data).not.toBeNull();
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe('Get all course successfully');
  });
  it('success get course by id', async () => {
    const response = await request(app)
        .get(`/api/v1/courses/${idCourse}`)
        .set('Authorization', `Bearer ${adminToken}`);
    expect(response.statusCode).toBe(200);
    expect(response.body.data).not.toBeNull();
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe('Get course successfully');
  });
  it('failed get course by id, id course not found', async () => {
    const response = await request(app)
        .get(`/api/v1/courses/111111111111111111111111`)
        .set('Authorization', `Bearer ${adminToken}`);
    expect(response.statusCode).toBe(404);
    expect(response.body.message).toBe('Course not found');
  });
  it('failed get course by id, not login', async () => {
    const response = await request(app)
        .get(`/api/v1/courses/${idCourse}`);
    expect(response.body.message)
        .toBe('You are unauthorized to make this request, Login please');
    expect(response.statusCode).toBe(401);
  });
  it('success delete course', async () => {
    const response = await request(app)
        .delete(`/api/v1/courses/${idCourse}`)
        .set('Authorization', `Bearer ${adminToken}`);
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe('Delete course successfully');
    expect(response.body.success).toBe(true);
  });
  it('failed delete course, not login', async () => {
    const response = await request(app)
        .delete(`/api/v1/courses/${idCourse}`);
    expect(response.body.message)
        .toBe('You are unauthorized to make this request, Login please');
    expect(response.statusCode).toBe(401);
  });
  it('failed delete course, id course not found', async () => {
    const response = await request(app)
        .delete(`/api/v1/courses/111111111111111111111111`)
        .set('Authorization', `Bearer ${adminToken}`);
    expect(response.statusCode).toBe(404);
    expect(response.body.message).toBe('Course not found');
  });
});
