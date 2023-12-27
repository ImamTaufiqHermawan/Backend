const request = require('supertest');
const app = require('../app');
const Course = require('../app/models/course');
const Transaction = require('../app/models/transaction');
const Purchase = require('../app/models/purchase');
const {default: mongoose} = require('mongoose');
const ApiError = require('../app/utils/apiError');

describe('API Payment', () => {
  let adminToken;
  let course;
  let userToken;
  let userTokenNotVerif;
  let payment;
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
    const loginUserNotVerif = await request(app)
        .post('/api/v1/auths/login').send({
          identifier: 'user2@example.com',
          password: 'securepass',
        });
    userTokenNotVerif = loginUserNotVerif.body.data.accessToken;
    course = await Course.findOne({typeClass: 'PREMIUM'});
  }, 1000000);
  it('should 200 get payment all users', async () => {
    const response = await request(app)
        .get('/api/v1/payments/all')
        .set('Authorization', `Bearer ${adminToken}`);
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Get all payment history success');
  });
  it('should 200 get payment all users, filter status', async () => {
    const response = await request(app)
        .get(`/api/v1/payments/all?status=paid`)
        .set('Authorization', `Bearer ${adminToken}`);
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Get all payment history success');
  });
  it('should 200 get payment all users, filter username', async () => {
    const response = await request(app)
        .get(`/api/v1/payments/all?username=john_doe`)
        .set('Authorization', `Bearer ${adminToken}`);
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Get all payment history success');
  });
  it('should 401 get payment all users, not login', async () => {
    const response = await request(app).get('/api/v1/payments/all');
    expect(response.status).toBe(401);
    expect(response.body.message).toBe(
        'You are unauthorized to make this request, Login please',
    );
  });
  it('should 403 get payment all users, not admin', async () => {
    const response = await request(app)
        .get('/api/v1/payments/all')
        .set('Authorization', `Bearer ${userToken}`);
    expect(response.status).toBe(403);
    expect(response.body.message).toBe(
        'Access forbidden, only admin can make this request',
    );
  });
  it('should 201 create payment user', async () => {
    const newPayment = {
      courseId: course._id,
      courseTitle: course.title,
      totalPrice: 100000,
    };
    const response = await request(app)
        .post('/api/v1/payments')
        .set('Authorization', `Bearer ${userToken}`)
        .send(newPayment);
    payment = response.body.data?._id;
    const transaction = await Transaction
        .findByIdAndUpdate(payment, {status: 'Paid'}, {new: true});
    await Purchase.create({
      userId: transaction?.userId,
      courseId: transaction.courseId,
    });
    expect(response.statusCode).toBe(201);
    expect(response.body.message).toBe('Create payment success');
    expect(response.body.success).toBe(true);
  });
  it('should 400 create payment user, all fields are mandatory ', async () => {
    const newPayment = {
      courseId: course._id,
      courseTitle: course.title,
    };
    const response = await request(app)
        .post('/api/v1/payments')
        .set('Authorization', `Bearer ${userToken}`)
        .send(newPayment);
    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe('All fields are mandatory');
    expect(response.body.success).toBe(false);
  });
  it('should 400 create payment user, was bought', async () => {
    const newPayment = {
      courseId: course._id,
      courseTitle: course.title,
      totalPrice: 100000,
    };
    const response = await request(app)
        .post('/api/v1/payments')
        .set('Authorization', `Bearer ${userToken}`)
        .send(newPayment);
    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe('You already bought this course!');
    expect(response.body.success).toBe(false);
  });
  it('should 400 create payment user, email not verif', async () => {
    const newPayment = {
      courseId: course._id,
      courseTitle: course.title,
      totalPrice: 100000,
    };
    const response = await request(app)
        .post('/api/v1/payments')
        .send(newPayment)
        .set('Authorization', `Bearer ${userTokenNotVerif}`);
    expect(response.body.message)
        .toBe('Please verify your account');
    expect(response.statusCode).toBe(400);
  });
  it('should 401 create payment user, not login', async () => {
    const newPayment = {
      courseId: course._id,
      courseTitle: course.title,
      totalPrice: 100000,
    };
    const response = await request(app)
        .post('/api/v1/payments')
        .send(newPayment);
    expect(response.body.message)
        .toBe('You are unauthorized to make this request, Login please');
    expect(response.statusCode).toBe(401);
  });
  it('should 200 get payment by id', async () => {
    const response = await request(app)
        .get(`/api/v1/payments/${payment}`)
        .set('Authorization', `Bearer ${adminToken}`);
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Get payment by id success');
  });
  it('should get 404 get payment by id, id not found', async () => {
    const response = await request(app)
        .get(`/api/v1/payments/111111111111111111111111`)
        .set('Authorization', `Bearer ${adminToken}`);
    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Id payment not found');
  });
  it('should 401 get payment by id, not login', async () => {
    const response = await request(app).get(`/api/v1/payments/${payment}`);
    expect(response.status).toBe(401);
    expect(response.body.message).toBe(
        'You are unauthorized to make this request, Login please',
    );
  });
  it('should 200 get payment user login', async () => {
    const response = await request(app)
        .get(`/api/v1/payments/`)
        .set('Authorization', `Bearer ${userToken}`);
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Get payment user login success');
  });
  it('should 401 get payment user login, not login', async () => {
    const response = await request(app).get(`/api/v1/payments`);
    expect(response.status).toBe(401);
    expect(response.body.message).toBe(
        'You are unauthorized to make this request, Login please',
    );
  });

  describe('500 API Payment', () => {
    beforeEach(() => {
      jest.spyOn(mongoose.model('Transaction'), 'find')
          .mockImplementationOnce(() => {
            throw new ApiError('Simulated internal server error');
          });
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });
    it('failed create payment, Internal server error', async () => {
      const newPayment = {
        courseId: 'FalseId',
        courseTitle: course.title,
        totalPrice: 100000,
      };
      const response = await request(app)
          .post('/api/v1/payments')
          .set('Authorization', `Bearer ${userToken}`)
          .send(newPayment);
      expect(response.status).toBe(500);
      expect(response.body.success).toBe(false);
      expect(response.body.message)
          // eslint-disable-next-line max-len
          .toBe('Cast to ObjectId failed for value \"FalseId\" (type string) at path \"courseId\" for model \"Purchase\"');
    });
    it('should 500 get payment by id, Internal server error', async () => {
      jest.spyOn(mongoose.model('Transaction'), 'findOne')
          .mockImplementationOnce(() => {
            throw new ApiError('Simulated internal server error');
          });
      const response = await request(app)
          .get(`/api/v1/payments/${payment}`)
          .set('Authorization', `Bearer ${adminToken}`);
      expect(response.status).toBe(500);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Simulated internal server error');
    });
    it('should 500 get payment user login, Internal server error', async () => {
      const response = await request(app)
          .get(`/api/v1/payments/`)
          .set('Authorization', `Bearer ${userToken}`);
      expect(response.status).toBe(500);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Simulated internal server error');
    });
    it('should 500 get payment all, Internal server error', async () => {
      const response = await request(app)
          .get('/api/v1/payments/all')
          .set('Authorization', `Bearer ${adminToken}`);
      expect(response.status).toBe(500);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Simulated internal server error');
    });
  });
});
