const request = require('supertest');
const app = require('../app');
const User = require('../app/models/user');

describe('Api auths', () => {
  let passwordResetToken;
  let userToken;
  let otpUser;
  it('Api user login 200', async () => {
    const loginUser = await request(app).post('/api/v1/auths/login').send({
      identifier: 'user2@example.com',
      password: 'securepass',
    });
    userToken = loginUser.body.data.accessToken;
    const user = await User.findOne({email: 'user2@example.com'});
    passwordResetToken = user.passwordResetToken;
    expect(loginUser.status).toBe(200);
    expect(loginUser.body.message).toBe('Login successfully');
  });
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

  it('should return 400 admin login, all field mandatory', async () => {
    const response = await request(app).post('/api/v1/auths/admin/login');
    expect(response.status).toBe(400);
    expect(response.body.message).toBe('All fields are mandatory');
  });

  it('Api admin login 400', async () => {
    const response = await request(app).post('/api/v1/auths/admin/login').send({
      username: 'admin_user',
      password: 'adminpass1',
    });
    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Wrong password or username');
  });

  it('Api user forgot password 200', async () => {
    const response = await request(app)
        .post('/api/v1/auths/forgot-password')
        .send({
          email: 'user2@example.com',
        });
    const user = await User.findOne({email: 'user2@example.com'});
    passwordResetToken = user.passwordResetToken;
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Email reset password has been sent');
  }, 100000);

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
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Otp verification sent successfully');
  }, 100000);

  it('should return 400 reset password, length password < 8', async ()=>{
    const response = await request(app)
        .patch(`/api/v1/auths/reset-password/${passwordResetToken}`)
        .send({
          password: 'secure',
          confirmPassword: 'secure',
        });
    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Minimum password 8 characters');
  }, 100000);

  it('should return 400 reset password, password not match', async ()=>{
    const response = await request(app)
        .patch(`/api/v1/auths/reset-password/${passwordResetToken}`)
        .send({
          password: 'securepass',
          confirmPassword: 'secure',
        });
    expect(response.status).toBe(400);
    expect(response.body.message)
        .toBe('Password and confirm password doesn\'t match');
  }, 100000);

  it('should return 400 reset password, All field mandatory', async ()=>{
    const response = await request(app)
        .patch(`/api/v1/auths/reset-password/${passwordResetToken}`);
    expect(response.status).toBe(400);
    expect(response.body.message).toBe('All fields are mandatory');
  }, 100000);

  it('should return 404 reset password, not found token', async ()=>{
    const response = await request(app)
        .patch(`/api/v1/auths/reset-password/1111`)
        .send({
          password: 'secure',
          confirmPassword: 'secure',
        });
    expect(response.status).toBe(404);
    expect(response.body.message).toBe('User not found for the given token');
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
  }, 100000);

  it('Api verify otp', async ()=>{
    const response = await request(app)
        .post('/api/v1/auths/verify-otp')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          otp: otpUser,
        });
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Verify OTP successfully');
  }, 100000);

  it('Api verify otp 4041', async ()=>{
    const response = await request(app)
        .post('/api/v1/auths/verify-otp')
        .send({
          otp: otpUser,
        });
    expect(response.status).toBe(401);
    // eslint-disable-next-line max-len
    expect(response.body.message).toBe('You are unauthorized to make this request, Login please');
  }, 100000);

  it('Api verify otp  400', async ()=>{
    const response = await request(app)
        .post('/api/v1/auths/verify-otp')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          otp: '123456',
        });
    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Sorry, OTP code is wrong');
  }, 100000);

  it('Api Auth me', async ()=>{
    const response = await request(app)
        .get('/api/v1/auths/me')
        .set('Authorization', `Bearer ${userToken}`);
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Successfully retrieved user data');
  });

  it('Api Register', async ()=>{
    const response = await request(app)
        .post('/api/v1/auths/register')
        .send({
          name: 'Imam Taufiqs',
          email: 'maulanaabdullana12345@gmail.com',
          phone: '082312838398',
          password: '123456789',
        });
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Register successfully');
  }, 100000);

  it('Api Register 400 minimum password', async ()=>{
    const response = await request(app)
        .post('/api/v1/auths/register')
        .send({
          name: 'Imam Taufiqs',
          email: 'maulanaabdullana50@gmail.com',
          phone: '082312838390',
          password: '1234',
        });
    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Minimum password 8 characters');
  }, 100000);

  it('Api Register 400 Email already registered', async ()=>{
    const response = await request(app)
        .post('/api/v1/auths/register')
        .send({
          name: 'Imam Taufiqs',
          email: 'user2@example.com',
          phone: '082312838398',
          password: '123456789',
        });
    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Email address already registered');
  }, 100000);

  it('Api Register 400 mobile phone already registered ', async () => {
    const response = await request(app).post('/api/v1/auths/register').send({
      name: 'Imam Taufiqs',
      email: 'maulanaabdullana225@gmail.com',
      phone: '082312838398',
      password: '123456789',
    });
    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Mobile phone already registered');
  }, 100000);
});
