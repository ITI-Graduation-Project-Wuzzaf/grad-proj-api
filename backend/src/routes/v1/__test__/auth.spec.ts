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
      expect(res.body.accessToken).toBeDefined();
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
    it('Should return user data and access token when given valid credentials', async () => {
      const res = await request(app)
        .post('/v1/login')
        .send({
          email: 'bassel@test.com',
          password: '12345678',
        })
        .expect(200);

      expect(res.body.accessToken).toBeDefined();
      expect(res.body.user.email).toEqual('bassel@test.com');
      expect(res.body.user.first_name).toEqual('Bassel');
      expect(res.body.user.last_name).toEqual('Salah');
    });

    it("Should fail when an email that doesn't exists is supplied", async () => {
      await request(app)
        .post('/v1/login')
        .send({
          email: 'test@test.com',
          password: '12345678',
        })
        .expect(400);
    });

    it('Should fail when an incorrect password is supplied', async () => {
      await request(app)
        .post('/v1/login')
        .send({
          email: 'bassel@test.com',
          password: '1234abcd',
        })
        .expect(400);
    });

    it('Should return 422 when given invalid email', async () => {
      await request(app)
        .post('/v1/login')
        .send({
          email: 'bassel',
          password: '12345678',
        })
        .expect(422);
    });
  });
});
