const request = require('supertest');
const app = require('../app');
const User = require('../app/models/user');

describe('Api auths', () => {
  let passwordResetToken;
  let userToken;
  let otpUser;
  beforeAll(async () => {
    const response = await request(app)
        .post('/api/v1/auths/forgot-password')
        .send({
          email: 'user2@example.com',
        });
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Email reset password has been sent');
    const loginUser = await request(app).post('/api/v1/auths/login').send({
      identifier: 'user2@example.com',
      password: 'securepass',
    });
    userToken = loginUser.body.data.accessToken;
    const user = await User.findOne({email: 'user2@example.com'});
    passwordResetToken = user.passwordResetToken;
    console.log(passwordResetToken);
    console.log(userToken);
    expect(loginUser.status).toBe(200);
    expect(loginUser.body.message).toBe('Login successfully');
  }, 100000);

  it('Api user login 400', async () => {
    const response = await request(app).post('/api/v1/auths/login').send({
      identifier: 'user2@example.com',
      password: 'securepass1',
    });
    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Sorry, wrong password');
  });

  it('Api user login 404', async () => {
    const response = await request(app).post('/api/v1/auths/login').send({
      identifier: 'user20@example.com',
      password: 'securepass',
    });
    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Email address or Phone not registered');
  });

  it('Api admin login', async () => {
    const response = await request(app).post('/api/v1/auths/admin/login').send({
      username: 'admin_user',
      password: 'adminpass',
    });
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Login successfully');
  });

  it('Api admin login 400', async () => {
    const response = await request(app).post('/api/v1/auths/admin/login').send({
      username: 'admin_user',
      password: 'adminpass1',
    });
    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Wrong password or username');
  });
  it('Api User Forgot password 404', async () => {
    const response = await request(app)
        .post('/api/v1/auths/forgot-password')
        .send({
          email: 'user12@example.com',
        });
    expect(response.status).toBe(404);
    expect(response.body.message).toBe('User not found');
  });

  it('Api User Email password', async () => {
    const response = await request(app).post('/api/v1/auths/email-otp').send({
      email: 'user2@example.com',
    });
    const user = await User.findOne({email: 'user2@example.com'});
    otpUser= user.otp;
    console.log(otpUser);
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Otp verification sent successfully');
  }, 100000);

  it('Api reset password', async ()=>{
    const response = await request(app)
        .patch(`/api/v1/auths/reset-password/${passwordResetToken}`)
        .send({
          password: 'securepass',
          confirmPassword: 'securepass',
        });
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Reset password successfully');
  });

  it('Api verify otp', async ()=>{
    const response = await request(app)
        .post('/api/v1/auths/verify-otp')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          otp: otpUser,
        });
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Verify OTP successfully');
  });
});
