const request = require('supertest');
const app = require('../app');

describe('api Progress', () => {
  let userToken;
  let courseId;
  beforeAll(async () => {
    const loginUser = await request(app).post('/api/v1/auths/login').send({
      identifier: 'user2@example.com',
      password: 'securepass',
    });
    userToken = loginUser.body.data.accessToken;
    const getcourse = await request(app).get('/api/v1/courses');
    courseId = getcourse.body.data[1]._id;
    const getcourseId = await request(app)
        .get(`/api/v1/courses/${courseId}`)
        .set('Authorization', `Bearer ${userToken}`);
    console.log(getcourseId);
  });

  it('should get all progresss', async () => {
    const response = await request(app)
        .get('/api/v1/progress')
        .set('Authorization', `Bearer ${userToken}`);
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Get progress user successfully');
    console.log(response.status);
  });

  it('should 401 get all progress', async () => {
    const response = await request(app).get('/api/v1/progress');
    expect(response.status).toBe(401);
    expect(response.body.message).toBe(
        'You are unauthorized to make this request, Login please',
    );
  });

  it('should add index progress and update percentage', async () => {
    const response = await request(app)
        .post(`/api/v1/progress?courseId=${courseId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          indexProgress: 5,
        });
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Add index progress successfully');
  });

  it('should add index progress and update percentage 401', async () => {
    const response = await request(app)
        .post(`/api/v1/progress?courseId=${courseId}`)
        .send({
          indexProgress: 5,
        });
    expect(response.status).toBe(401);
    expect(response.body.message).toBe(
        'You are unauthorized to make this request, Login please',
    );
  });
});
