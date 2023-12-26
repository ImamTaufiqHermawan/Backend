const request = require('supertest');
const app = require('../app');
const User = require('../app/models/user');
const {default: mongoose} = require('mongoose');
const ApiError = require('../app/utils/apiError');

describe('API User', () => {
  let userToken;
  let user;

  beforeAll(async () => {
    const loginUser = await request(app).post('/api/v1/auths/login').send({
      identifier: 'user2@example.com',
      password: 'securepass',
    });
    userToken = loginUser.body.data.accessToken;

    user = await User.findOne({email: 'user2@example.com'});
  });

  describe('GET users', () => {
    it('should get all users with valid authentication', async () => {
      const response = await request(app)
          .get('/api/v1/users')
          .set('Authorization', `Bearer ${userToken}`);
      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Get all users data successfuly');
    });
    it('should return 401 if no token is provided', async () => {
      const response = await request(app).get('/api/v1/users/');
      expect(response.status).toBe(401);
      expect(response.body.message).toBe(
          'You are unauthorized to make this request, Login please',
      );
    });
  });

  describe('Get users By id', () => {
    it('should get users by id', async () => {
      const response = await request(app)
          .get(`/api/v1/users/${user._id}`)
          .set('Authorization', `Bearer ${userToken}`);
      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Get single user succesfully');
    });

    it('should get error users by id', async () => {
      const response = await request(app)
          .get('/api/v1/users/6569b03463e7a9d96bbe4fc0')
          .set('Authorization', `Bearer ${userToken}`);
      expect(response.status).toBe(404);
      expect(response.body.message).toBe('User not found');
    });
    it('should get error users id not valid', async () => {
      const response = await request(app)
          .get('/api/v1/users/1')
          .set('Authorization', `Bearer ${userToken}`);
      expect(response.status).toBe(400);
      expect(response.body.message).toBe('ID is not valid');
    });

    it('should return 401 if no token is provided', async () => {
      const response = await request(app).get(`/api/v1/users/${user._id}`);
      expect(response.status).toBe(401);
      expect(response.body.message).toBe(
          'You are unauthorized to make this request, Login please',
      );
    });
  });

  describe('Update User', () => {
    it('should update user information with valid authentication', async () => {
      const updatedUserData = {
        name: 'User 2',
        email: 'user2@example.com',
        phone: '081287961238',
        country: 'Indonesia',
        city: 'Banten',
        image_profile: 'https://source.unsplash.com/500x500',
      };
      const response = await request(app)
          .patch(`/api/v1/users/${user._id}`)
          .set('Authorization', `Bearer ${userToken}`)
          .send(updatedUserData);
      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Update Sucessfully');
    });

    it('should return 401 if no token is provided', async () => {
      const updatedUserData = {
        name: 'User 2',
        email: 'user2@example.com',
        phone: '081287961238',
        country: 'Indonesia',
        city: 'Banten',
        image_profile: 'https://source.unsplash.com/500x500',
      };

      const response = await request(app)
          .patch(`/api/v1/users/${user._id}`)
          .send(updatedUserData);

      expect(response.status).toBe(401);
      expect(response.body.message).toBe(
          'You are unauthorized to make this request, Login please',
      );
    });

    it('should return 400 if user ID is not valid', async () => {
      const updatedUserData = {
        name: 'User 2',
        email: 'user2@example.com',
        phone: '081287961238',
        country: 'Indonesia',
        city: 'Banten',
        image_profile: 'https://source.unsplash.com/500x500',
      };

      const response = await request(app)
          .patch(`/api/v1/users/1`)
          .set('Authorization', `Bearer ${userToken}`)
          .send(updatedUserData);

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('ID is not valid');
    });

    it('should return 404 if user ID is not found', async () => {
      const updatedUserData = {
        name: 'User 2',
        email: 'user2@example.com',
        phone: '081287961238',
        country: 'Indonesia',
        city: 'Banten',
        image_profile: 'https://source.unsplash.com/500x500',
      };

      const response = await request(app)
          .patch(`/api/v1/users/6569b03463e7a9d96bbe4fc0`)
          .set('Authorization', `Bearer ${userToken}`)
          .send(updatedUserData);

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('User not found');
    });
  });
  describe('Update Password User', () => {
    it('should update the user password', async () => {
      const updatePasswordData = {
        oldPassword: 'securepass',
        newPassword: 'securepass',
        confirmPassword: 'securepass',
      };
      const response = await request(app)
          .patch(`/api/v1/users/update-password/${user._id}`)
          .set('Authorization', `Bearer ${userToken}`)
          .send(updatePasswordData);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Password updated successfully');
    });

    it('should return 401 update password, password length < 8', async () => {
      const updatePasswordData = {
        oldPassword: 'securepass',
        newPassword: 'secure',
        confirmPassword: 'secure',
      };
      const response = await request(app)
          .patch(`/api/v1/users/update-password/${user._id}`)
          .set('Authorization', `Bearer ${userToken}`)
          .send(updatePasswordData);
      expect(response.status).toBe(401);
      expect(response.body.message)
          .toBe('Minimum password length is 8 characters.');
    });

    it('should return 400 update password,old password incorrect', async () => {
      const updatePasswordData = {
        oldPassword: 'securepas',
        newPassword: 'securess',
        confirmPassword: 'securess',
      };
      const response = await request(app)
          .patch(`/api/v1/users/update-password/${user._id}`)
          .set('Authorization', `Bearer ${userToken}`)
          .send(updatePasswordData);
      expect(response.status).toBe(400);
      expect(response.body.message)
          .toBe('Your old password is incorrect.');
    });

    it('should return 400 update password,not match password', async () => {
      const updatePasswordData = {
        oldPassword: 'securepass',
        newPassword: 'secures',
        confirmPassword: 'securess',
      };
      const response = await request(app)
          .patch(`/api/v1/users/update-password/${user._id}`)
          .set('Authorization', `Bearer ${userToken}`)
          .send(updatePasswordData);
      expect(response.status).toBe(400);
      expect(response.body.message)
          .toBe('New password and new confirm password does not match.');
    });

    it('should return 400, all field mandatory', async () => {
      const response = await request(app)
          .patch(`/api/v1/users/update-password/${user._id}`)
          .set('Authorization', `Bearer ${userToken}`);
      expect(response.status).toBe(400);
      expect(response.body.message).toBe(
          'All fields are mandatory',
      );
    });

    it('should return 401 if no token is provided', async () => {
      const updatePasswordData = {
        oldPassword: 'securepass',
        newPassword: 'newsecurepass',
        confirmPassword: 'newsecurepass',
      };

      const response = await request(app)
          .patch(`/api/v1/users/update-password/${user._id}`)
          .send(updatePasswordData);

      expect(response.status).toBe(401);
      expect(response.body.message).toBe(
          'You are unauthorized to make this request, Login please',
      );
    });

    it('should return 400 if user ID is not valid', async () => {
      const updatePasswordData = {
        oldPassword: 'securepass',
        newPassword: 'newsecurepass',
        confirmPassword: 'newsecurepass',
      };

      const response = await request(app)
          .patch('/api/v1/users/update-password/1')
          .set('Authorization', `Bearer ${userToken}`)
          .send(updatePasswordData);

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('ID is not valid');
    });
    it('should return 404 if user ID is not found', async () => {
      const updatePasswordData = {
        oldPassword: 'securepass',
        newPassword: 'newsecurepass',
        confirmPassword: 'newsecurepass',
      };

      const response = await request(app)
          .patch('/api/v1/users/update-password/6569b03463e7a9d96bbe4fc0')
          .set('Authorization', `Bearer ${userToken}`)
          .send(updatePasswordData);

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('User not found');
    });
  });

  describe('500 API User', () => {
    beforeEach(() => {
      jest.spyOn(mongoose.model('User'), 'findById')
          .mockImplementationOnce(() => {
            throw new ApiError('Simulated internal server error');
          });
    });
    afterEach(() => {
      jest.restoreAllMocks();
    });
    it('failed get all user, internal server error', async () => {
      jest.spyOn(mongoose.model('User'), 'find')
          .mockImplementationOnce(() => {
            throw new ApiError('Simulated internal server error');
          });
      const response = await request(app)
          .get(`/api/v1/users`)
          .set('Authorization', `Bearer ${userToken}`);
      expect(response.status).toBe(500);
      expect(response.body.success).toBe(false);
      expect(response.body.message)
          .toBe('Simulated internal server error');
    });
    it('failed get user by id, internal server error', async () => {
      const response = await request(app)
          .get(`/api/v1/users/111111111111111111111111`)
          .set('Authorization', `Bearer ${userToken}`);
      expect(response.body.message)
          .toBe('Simulated internal server error');
      expect(response.status).toBe(500);
      expect(response.body.success).toBe(false);
    });
    it('failed update user by id, internal server error', async () => {
      const response = await request(app)
          .patch(`/api/v1/users/111111111111111111111111`)
          .set('Authorization', `Bearer ${userToken}`);
      expect(response.body.message)
          .toBe('Simulated internal server error');
      expect(response.status).toBe(500);
      expect(response.body.success).toBe(false);
    });
  });
});
