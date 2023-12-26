const request = require('supertest');
const app = require('../app');
const {default: mongoose} = require('mongoose');
const ApiError = require('../app/utils/apiError');

describe('API Course', () => {
  let adminToken;
  let idCategory;
  let idCourse;
  let userToken;
  beforeAll(async () => {
    const loginAdmin = await request(app).post('/api/v1/auths/login').send({
      identifier: 'admin@example.com',
      password: 'adminpass',
    });
    adminToken = loginAdmin.body.data.accessToken;
    const loginUser = await request(app).post('/api/v1/auths/login').send({
      identifier: 'user2@example.com',
      password: 'securepass',
    });
    userToken = loginUser.body.data.accessToken;
    const categoryResponse = await request(app).get('/api/v1/categories');
    idCategory = categoryResponse.body.data[1]._id;
  }, 1000000);
  it('success get course', async () => {
    const response = await request(app).get('/api/v1/courses');
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe('Get all course successfully');
    expect(response.body.success).toBe(true);
  });
  it('success get course, with filter', async () => {
    // eslint-disable-next-line max-len
    const response = await request(app).get('/api/v1/courses?category=web&typeClass=free&level=beginer&title=web&popular=true&latest=true');
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe('Get all course successfully');
    expect(response.body.success).toBe(true);
  });
  it('success post new course', async () => {
    const newCourse = {
      title: 'Dummy Course',
      targetAudience:
        `1. Anda yang ingin memahami poin penting design system,
        2. Anda yang ingin membantu perusahaan lebih optimal dalam
         membuat design produk,
        3. Anda yang ingin latihan membangun design system,
        4. Anda yang ingin latihan membangun design system`,
      description: 'This is a dummy course for testing.',
      classCode: 'ABC123',
      category: idCategory,
      typeClass: 'FREE',
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
      targetAudience:
        `1. Anda yang ingin memahami poin penting design system,
        2. Anda yang ingin membantu perusahaan lebih optimal dalam
         membuat design produk,
        3. Anda yang ingin latihan membangun design system,
        4. Anda yang ingin latihan membangun design system`,
      description: 'This is a dummy course for testing.',
      classCode: 'ABC123',
      category: '111111111111111111111111',
      typeClass: 'FREE',
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
  it('failed post new course, all field mandatory', async () => {
    const response = await request(app)
        .post(`/api/v1/courses`)
        .set('Authorization', `Bearer ${adminToken}`);
    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe('All fields are mandatory');
  });
  it('failed post new course, not login', async () => {
    const newCourse = {
      title: 'Dummy Course',
      targetAudience:
        `1. Anda yang ingin memahami poin penting design system,
        2. Anda yang ingin membantu perusahaan lebih optimal dalam
         membuat design produk,
        3. Anda yang ingin latihan membangun design system,
        4. Anda yang ingin latihan membangun design system`,
      description: 'This is a dummy course for testing.',
      classCode: 'ABC123',
      category: idCategory,
      typeClass: 'FREE',
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
  it('success update course', async () => {
    const newCourse = {
      title: 'Web Course',
      targetAudience:
      `1. Anda yang ingin memahami poin penting design system,
      2. Anda yang ingin membantu perusahaan lebih optimal dalam
       membuat design produk,
      3. Anda yang ingin latihan membangun design system,
      4. Anda yang ingin latihan membangun design system`,
      description: 'This is a dummy course for testing.',
      classCode: 'ABC123',
      category: idCategory,
      typeClass: 'FREE',
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
      targetAudience:
        `1. Anda yang ingin memahami poin penting design system,
        2. Anda yang ingin membantu perusahaan lebih optimal dalam
         membuat design produk,
        3. Anda yang ingin latihan membangun design system,
        4. Anda yang ingin latihan membangun design system`,
      description: 'This is a dummy course for testing.',
      classCode: 'ABC123',
      category: '111111111111111111111111',
      typeClass: 'FREE',
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
      targetAudience:
        `1. Anda yang ingin memahami poin penting design system,
        2. Anda yang ingin membantu perusahaan lebih optimal dalam
         membuat design produk,
        3. Anda yang ingin latihan membangun design system,
        4. Anda yang ingin latihan membangun design system`,
      description: 'This is a dummy course for testing.',
      classCode: 'ABC123',
      category: idCategory,
      typeClass: 'FREE',
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
      targetAudience:
        `1. Anda yang ingin memahami poin penting design system,
        2. Anda yang ingin membantu perusahaan lebih optimal dalam
         membuat design produk,
        3. Anda yang ingin latihan membangun design system,
        4. Anda yang ingin latihan membangun design system`,
      description: 'This is a dummy course for testing.',
      classCode: 'ABC123',
      category: idCategory,
      typeClass: 'FREE',
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
  it('success get course by id, role user', async () => {
    const response = await request(app)
        .get(`/api/v1/courses/${idCourse}`)
        .set('Authorization', `Bearer ${userToken}`);
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

  describe('500 API Course', () => {
    it('should 500 get course, internal server error', async () => {
      jest.spyOn(mongoose.model('Course'), 'find')
          .mockImplementationOnce(() => {
            throw new ApiError('Simulated internal server error');
          });
      const response = await request(app).get('/api/v1/courses');
      expect(response.status).toBe(500);
      expect(response.body.success).toBe(false);
      expect(response.body.message)
          .toBe('Simulated internal server error');
    });
    it('should 500 delete course, internal server error', async () => {
      jest.spyOn(mongoose.model('Course'), 'findOne')
          .mockImplementationOnce(() => {
            throw new ApiError('Simulated internal server error');
          });
      const response = await request(app)
          .delete(`/api/v1/courses/${idCourse}`)
          .set('Authorization', `Bearer ${adminToken}`);
      expect(response.status).toBe(500);
      expect(response.body.success).toBe(false);
      expect(response.body.message)
          .toBe('Error while validating Course ID in the database');
    });
  });
});
