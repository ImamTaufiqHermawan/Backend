const request = require('supertest');
const app = require('../app');

describe('API Chapter', () => {
  let userToken;
  let adminToken;
  let courseId;
  let idChapter;
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

    const getCourse = await request(app).get('/api/v1/courses')
        .set('Authorization', `Bearer ${adminToken}`);
    courseId = getCourse.body.data[0]._id;
  });
  it('success create chapter', async () => {
    const response = await request(app)
        .post(`/api/v1/chapters?courseId=${courseId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          title: 'Chapter 1 course 1',
        });
    idChapter = response.body.data._id;
    expect(response.body.message).toBe('Create chapter successfully');
    expect(response.statusCode).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data).not.toBeNull();
  });
  it('failed create chapter, not admin', async () => {
    const newCourse = {
      title: 'Chapter 1 course 2',
    };
    const response = await request(app)
        .post(`/api/v1/chapters?courseId=${courseId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send(newCourse);
    expect(response.statusCode).toBe(403);
    expect(response.body.message)
        .toBe('Access forbidden, only admin can make this request');
    expect(response.body.success).toBe(false);
    expect(response.body.status).toBe('Failed');
  });
  it('failed create chapter, not login', async () => {
    const newCourse = {
      title: 'Chapter 1 course 2',
    };
    const response = await request(app)
        .post(`/api/v1/chapters?courseId=${courseId}`)
        .send(newCourse);
    expect(response.body.message)
        .toBe('You are unauthorized to make this request, Login please');
    expect(response.statusCode).toBe(401);
  });
  it('failed create chapter, id course not found', async () => {
    const newCourse = {
      title: 'Chapter 1 course 2',
    };
    const response = await request(app)
        .post(`/api/v1/chapters?courseId=aaaaaaaaaaaaaaaaaaaaaaaa`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(newCourse);
    expect(response.body.message)
        .toBe('Course not found');
    expect(response.statusCode).toBe(404);
    expect(response.body.success).toBe(false);
    expect(response.body.status).toBe('Failed');
  });
  it('failed create chapter, no field title', async () => {
    const newCourse = {
    };
    const response = await request(app)
        .post(`/api/v1/chapters?courseId=${courseId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(newCourse);
    expect(response.body.message)
        .toBe('All fields are mandatory');
    expect(response.statusCode).toBe(400);
  });
  it('success update chapter', async () => {
    const response = await request(app)
        .patch(`/api/v1/chapters/${idChapter}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          title: 'Chapter 1 video 1',
        });
    idChapter = response.body.data._id;
    expect(response.body.message).toBe('Update chapter successfully');
    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).not.toBeNull();
  });
  it('failed update chapter, not admin', async () => {
    const newChapter = {
      title: 'Chapter 1 course 2',
    };
    const response = await request(app)
        .patch(`/api/v1/chapters/${idChapter}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send(newChapter);
    expect(response.statusCode).toBe(403);
    expect(response.body.message)
        .toBe('Access forbidden, only admin can make this request');
    expect(response.body.success).toBe(false);
    expect(response.body.status).toBe('Failed');
  });
  it('failed update chapter, not login', async () => {
    const newChapter = {
      title: 'Chapter 1 course 2',
    };
    const response = await request(app)
        .patch(`/api/v1/chapters/${idChapter}`)
        .send(newChapter);
    expect(response.body.message)
        .toBe('You are unauthorized to make this request, Login please');
    expect(response.statusCode).toBe(401);
  });
  it('failed update chapter, id chapter not found', async () => {
    const newChapter = {
      title: 'Chapter 1 course 2',
    };
    const response = await request(app)
        .patch(`/api/v1/chapters/aaaaaaaaaaaaaaaaaaaaaaaa`)
        .send(newChapter)
        .set('Authorization', `Bearer ${adminToken}`);
    expect(response.body.message)
        .toBe('Chapter not found');
    expect(response.statusCode).toBe(404);
  });
  it('success get chapter by id', async () => {
    const response = await request(app)
        .get(`/api/v1/chapters/${idChapter}`)
        .set('Authorization', `Bearer ${adminToken}`);
    expect(response.body.message).toBe('Get chapter successfully');
    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).not.toBeNull();
  });
  it('failed get chapter by id, id not found', async () => {
    const response = await request(app)
        .get(`/api/v1/chapters/aaaaaaaaaaaaaaaaaaaaaaaa`)
        .set('Authorization', `Bearer ${adminToken}`);
    expect(response.body.message).toBe('Chapter not found');
    expect(response.statusCode).toBe(404);
    expect(response.body.success).toBe(false);
  });
  it('success get all chapter', async () => {
    const response = await request(app)
        .get(`/api/v1/chapters`)
        .set('Authorization', `Bearer ${adminToken}`);
    expect(response.body.message).toBe('Get chapter successfully');
    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).not.toBeNull();
  });
});
