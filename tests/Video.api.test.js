const request = require('supertest');
const app = require('../app');

describe('API Video', () => {
  let userToken;
  let adminToken;
  let idChapter;
  let idVideo;
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

    const getChapter = await request(app).get('/api/v1/chapters')
        .set('Authorization', `Bearer ${adminToken}`);
    idChapter = getChapter.body.data[0]._id;
  });
  it('success create video', async () => {
    const newVideo = {
      title: 'Video 1 chapter 1',
      duration: 10,
      videoUrl: 'youtube.com',
      index: 6,
    };
    const response = await request(app)
        .post(`/api/v1/videos?chapterId=${idChapter}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(newVideo);
    expect(response.body.message).toBe('Create video successfully');
    expect(response.statusCode).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data).not.toBeNull();
    idVideo = response.body.data.videos[3]._id;
  });
  it('failed create video, not admin', async () => {
    const newVideo = {
      title: 'Video 1 chapter 1',
      duration: 10,
      videoUrl: 'youtube.com',
      index: 10,
    };
    const response = await request(app)
        .post(`/api/v1/videos?chapterId=${idChapter}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send(newVideo);
    expect(response.statusCode).toBe(403);
    expect(response.body.message)
        .toBe('Access forbidden, only admin can make this request');
    expect(response.body.success).toBe(false);
    expect(response.body.status).toBe('Failed');
  });
  it('failed create video, not login', async () => {
    const newVideo = {
      title: 'Video 1 chapter 1',
      duration: 10,
      videoUrl: 'youtube.com',
      index: 10,
    };
    const response = await request(app)
        .post(`/api/v1/videos?chapterId=${idChapter}`)
        .send(newVideo);
    expect(response.body.message)
        .toBe('You are unauthorized to make this request, Login please');
    expect(response.statusCode).toBe(401);
  });
  it('failed create video, id chapter not found', async () => {
    const newVideo = {
      title: 'Video 1 chapter 1',
      duration: 10,
      videoUrl: 'youtube.com',
      index: 10,
    };
    const response = await request(app)
        .post(`/api/v1/videos?chapterId=aaaaaaaaaaaaaaaaaaaaaaaa`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(newVideo);
    expect(response.body.message)
        .toBe('Chapter not found');
    expect(response.statusCode).toBe(404);
    expect(response.body.success).toBe(false);
    expect(response.body.status).toBe('Failed');
  });
  it('failed create video, all field must be fill', async () => {
    const newVideo = {
      title: 'Video 1 chapter 1',
    };
    const response = await request(app)
        .post(`/api/v1/videos?chapterId=${idChapter}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(newVideo);
    expect(response.body.message)
        .toBe('All fields are mandatory');
    expect(response.statusCode).toBe(400);
  });
  it('success update video', async () => {
    const newVideo = {
      title: 'Video 1 chapter 1',
      duration: 10,
      videoUrl: 'youtube.com',
      index: 7,
    };
    const response = await request(app)
        .patch(`/api/v1/videos/${idVideo}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(newVideo);
    expect(response.body.message).toBe('Update video successfully');
    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).not.toBeNull();
  });
  it('failed update video, not admin', async () => {
    const newVideo = {
      title: 'Video 1 chapter 1',
      duration: 10,
      videoUrl: 'youtube.com',
      index: 10,
    };
    const response = await request(app)
        .patch(`/api/v1/videos/${idVideo}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send(newVideo);
    expect(response.statusCode).toBe(403);
    expect(response.body.message)
        .toBe('Access forbidden, only admin can make this request');
    expect(response.body.success).toBe(false);
    expect(response.body.status).toBe('Failed');
  });
  it('failed update video, not login', async () => {
    const newVideo = {
      title: 'Video 1 chapter 1',
      duration: 10,
      videoUrl: 'youtube.com',
      index: 10,
    };
    const response = await request(app)
        .patch(`/api/v1/videos/${idVideo}`)
        .send(newVideo);
    expect(response.body.message)
        .toBe('You are unauthorized to make this request, Login please');
    expect(response.statusCode).toBe(401);
  });
  it('failed update video, id video not found', async () => {
    const newVideo = {
      title: 'Video 1 chapter 1',
      duration: 10,
      videoUrl: 'youtube.com',
      index: 10,
    };
    const response = await request(app)
        .patch(`/api/v1/videos/aaaaaaaaaaaaaaaaaaaaaaaa`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(newVideo);
    expect(response.body.message)
        .toBe('Video not found');
    expect(response.statusCode).toBe(404);
    expect(response.body.success).toBe(false);
    expect(response.body.status).toBe('Failed');
  });
  it('success delete video', async () => {
    const response = await request(app)
        .delete(`/api/v1/videos/${idVideo}`)
        .set('Authorization', `Bearer ${adminToken}`);
    expect(response.body.message).toBe('Delete video successfully');
    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toBeNull();
  });
  it('failed delete video, not admin', async () => {
    const response = await request(app)
        .delete(`/api/v1/videos/${idVideo}`)
        .set('Authorization', `Bearer ${userToken}`);
    expect(response.statusCode).toBe(403);
    expect(response.body.message)
        .toBe('Access forbidden, only admin can make this request');
    expect(response.body.success).toBe(false);
    expect(response.body.status).toBe('Failed');
  });
  it('failed delete video, not login', async () => {
    const response = await request(app)
        .delete(`/api/v1/videos/${idVideo}`);
    expect(response.body.message)
        .toBe('You are unauthorized to make this request, Login please');
    expect(response.statusCode).toBe(401);
  });
  it('failed delete video, id chapter not found', async () => {
    const response = await request(app)
        .delete(`/api/v1/videos/aaaaaaaaaaaaaaaaaaaaaaaa`)
        .set('Authorization', `Bearer ${adminToken}`);
    expect(response.body.message)
        .toBe('Video not found');
    expect(response.statusCode).toBe(404);
    expect(response.body.success).toBe(false);
    expect(response.body.status).toBe('Failed');
  });
});
