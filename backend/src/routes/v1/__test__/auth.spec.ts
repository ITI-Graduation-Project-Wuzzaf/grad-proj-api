import request from 'supertest';

import { app } from '../../../app';

describe('Auth routes', () => {
  describe('POST /v1/signup', () => {
    it('Should signup new user with valid credentials', async () => {
      const email = 'test@test.com';
      const res = await request(app)
        .post('/v1/signup')
        .send({
          email,
          password: 'password',
          confirmPassword: 'password',
          first_name: 'heya',
          last_name: 'heya',
        })
        .expect(201);

      expect(res.body.user.id).toEqual(6);
      expect(res.body.user.email).toEqual(email);
    });

    it('Should returns a 422 with an invalid email', async () => {
      await request(app)
        .post('/v1/signup')
        .send({
          email: 'test',
          password: 'password',
          confirmPassword: 'password',
          first_name: 'heya',
          last_name: 'heya',
        })
        .expect(422);
    });

    it('Should returns a 422 with an invalid password', async () => {
      await request(app)
        .post('/v1/signup')
        .send({
          email: 'test@test.com',
          password: 'pw',
          confirmPassword: 'password',
          first_name: 'heya',
          last_name: 'heya',
        })
        .expect(422);
    });

    it('Should returns a 422 with missing data', async () => {
      await request(app).post('/v1/signup').send().expect(422);
    });

    it('Should disallow duplicate emails', async () => {
      const email = 'test@test.com';
      await request(app)
        .post('/v1/signup')
        .send({
          email,
          password: 'password',
          confirmPassword: 'password',
          first_name: 'heya',
          last_name: 'heya',
        })
        .expect(201);

      await request(app)
        .post('/v1/signup')
        .send({
          email,
          password: 'password',
          confirmPassword: 'password',
          first_name: 'heya',
          last_name: 'heya',
        })
        .expect(400);
    });
  });

  describe('POST /v1/login', () => {
    // it('Should', async () => {
    console.log('pew');
    // });
  });
});
