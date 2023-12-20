const request = require('supertest');
const app = require('../app');
const Course = require('../app/models/course');
const Progress = require('../app/models/progress');
const User = require('../app/models/user');
const {default: mongoose} = require('mongoose');
const ApiError = require('../app/utils/apiError');

describe('api Progress', () => {
  let userToken;
  let courseId;
  beforeAll(async () => {
    const loginUser = await request(app).post('/api/v1/auths/login').send({
      identifier: 'user2@example.com',
      password: 'securepass',
    });
    userToken = loginUser.body.data.accessToken;
    const userId = await User.findOne({email: 'user2@example.com'});
    const course = await Course.findOne({typeClass: 'FREE'});
    courseId = course._id;
    await Progress.create({
      userId: userId,
      courseId: courseId,
      indexProgress: 1,
      percentage: 0,
      status: 'Progress',
    });
  });

  it('should 200 get all progresss', async () => {
    const response = await request(app)
        .get('/api/v1/progress')
        .set('Authorization', `Bearer ${userToken}`);
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Get progress user successfully');
  });

  it('should 200 get all progresss with filter', async () => {
    const response = await request(app)
        .get('/api/v1/progress?status=Done')
        .set('Authorization', `Bearer ${userToken}`);
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Get progress user successfully');
  });

  it('should 401 get all progress', async () => {
    const response = await request(app).get('/api/v1/progress');
    expect(response.status).toBe(401);
    expect(response.body.message).toBe(
        'You are unauthorized to make this request, Login please',
    );
  });

  it('should 200 add index progress and update percentage', async () => {
    const response = await request(app)
        .post(`/api/v1/progress?courseId=${courseId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          indexProgress: 2,
        });
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Add index progress successfully');
  });

  it('should 200 add index progress and update percentage', async () => {
    const response = await request(app)
        .post(`/api/v1/progress?courseId=${courseId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          indexProgress: 5,
        });
    expect(response.status).toBe(200);
    expect(response.body.message)
        // eslint-disable-next-line max-len
        .toBe('Add index progress successfully, Check your email to download certificate');
  });

  it('should 200 add index progress smaller index progress user', async () => {
    const response = await request(app)
        .post(`/api/v1/progress?courseId=${courseId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          indexProgress: 2,
        });
    expect(response.status).toBe(200);
    expect(response.body.message)
        // eslint-disable-next-line max-len
        .toBe('Add index progress successfully, Check your email to download certificate');
  }, 100000);

  it('should 401 add index progress and update percentage 401', async () => {
    const response = await request(app)
        .post(`/api/v1/progress?courseId=${courseId}`)
        .send({
          indexProgress: 5,
        });
    expect(response.status).toBe(401);
    expect(response.body.message).toBe(
        'You are unauthorized to make this request, Login please',
    );
  }, 100000);

  describe('500 API Progress', () => {
    it('should 500 add index progress, internal server error', async () => {
      jest.spyOn(mongoose.model('Progress'), 'find')
          .mockImplementationOnce(() => {
            throw new ApiError('Simulated internal server error');
          });
      const response = await request(app)
          .get('/api/v1/progress')
          .set('Authorization', `Bearer ${userToken}`);
      expect(response.status).toBe(500);
      expect(response.body.success).toBe(false);
      expect(response.body.message)
          .toBe('Simulated internal server error');
    });
    it('should 500 get notification user, internal server error', async () => {
      jest.spyOn(mongoose.model('Progress'), 'findOne')
          .mockImplementationOnce(() => {
            throw new ApiError('Simulated internal server error');
          });
      const response = await request(app)
          .post(`/api/v1/progress?courseId=${courseId}`)
          .set('Authorization', `Bearer ${userToken}`)
          .send({
            indexProgress: 5,
          });
      expect(response.status).toBe(500);
      expect(response.body.success).toBe(false);
      expect(response.body.message)
          .toBe('Simulated internal server error');
    });
  });
});
