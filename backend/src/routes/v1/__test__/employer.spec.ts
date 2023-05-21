import request from 'supertest';

import { app } from '../../../app';

describe('Employer routes', () => {
  describe('POST /v1/employers', () => {
    it('Should signup new employer with valid credentials', async () => {
      const email = 'test@company.com';
      const res = await request(app)
        .post('/v1/employers')
        .send({
          email,
          password: 'password',
          confirmPassword: 'password',
          name: 'company',
        })
        .expect(201);

      expect(res.body.employer.id).toEqual(3);
      expect(res.body.employer.email).toEqual(email);
      expect(res.body.accessToken).toBeDefined();
    });
    it('Should returns a 422 with an invalid email', async () => {
      await request(app)
        .post('/v1/employers')
        .send({
          email: 'test',
          password: 'password',
          confirmPassword: 'password',
          name: 'company',
        })
        .expect(422);
    });

    it('Should returns a 422 with an invalid password', async () => {
      await request(app)
        .post('/v1/employers')
        .send({
          email: 'test@company.com',
          password: 'pw',
          confirmPassword: 'password',
          name: 'company',
        })
        .expect(422);
    });

    it('Should disallow duplicate emails', async () => {
      await request(app)
        .post('/v1/employers')
        .send({
          email: 'jobify@company.com',
          password: 'password',
          confirmPassword: 'password',
          name: 'company',
        })
        .expect(400);
    });
  });

  describe('GET /v1/employers/:id', () => {
    it('Should retrive user profile', async () => {
      const token = await global.signin('jobify@company.com');
      await request(app).get('/v1/employers/1').set('Authorization', `Bearer ${token}`).expect(200);
    });

    it('Should return 401 if user is not logged in', async () => {
      await request(app).get('/v1/employers/1').expect(401);
    });

    it("Should return 404 when given user id that doesn't exists", async () => {
      const token = await global.signin('jobify@company.com');
      await request(app).get('/v1/employers/0951').set('Authorization', `Bearer ${token}`).expect(404);
    });
  });

  describe('PATCH /v1/employers', () => {
    it('Should update employer data with valid parameters', async () => {
      const token = await global.signin('jobify@company.com');
      const res = await request(app)
        .patch('/v1/employers')
        .send({ country: 'Egypt' })
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(res.body.country).toEqual('Egypt');
    });

    it('Should return 401 if user is not logged in', async () => {
      await request(app).patch('/v1/employers').expect(401);
    });

    it('Should return 422 when given no parameters', async () => {
      const token = await global.signin('jobify@company.com');
      await request(app).patch('/v1/employers').set('Authorization', `Bearer ${token}`).expect(422);
    });
  });
});
