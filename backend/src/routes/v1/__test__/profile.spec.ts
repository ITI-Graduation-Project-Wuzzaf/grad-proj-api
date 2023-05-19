import request from 'supertest';
import { app } from '../../../app';

const signin = async () => {
  const res = await request(app).post('/v1/login').send({
    email: 'bassel@test.com',
    password: '12345678',
  });
  const token = res.body.accessToken;
  return token;
};

describe('Profile routes', () => {
  describe('GET /v1/profiles/:id', () => {
    it('Should retrive user profile', async () => {
      const token = await signin();
      await request(app).get('/v1/profiles/1').set('Authorization', `Bearer ${token}`).expect(200);
    });
    it('Should return 401 if user is not logged in', async () => {
      await request(app).get('/v1/profiles/1').expect(401);
    });

    it("Should return 404 when given user id that doesn't exists", async () => {
      const token = await signin();
      await request(app).get('/v1/profiles/0951').set('Authorization', `Bearer ${token}`).expect(404);
    });
  });

  describe('PATCH /v1/profiles', () => {
    it('Should update user profile when giving valid data', async () => {
      const token = await signin();
      const res = await request(app)
        .patch('/v1/profiles')
        .send({ city: 'Port Said' })
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(res.body.city).toEqual('Port Said');
    });

    it('Should return 401 if user is not logged in', async () => {
      await request(app).patch('/v1/profiles').expect(401);
    });

    it('Should return 422 when given no parameters', async () => {
      const token = await signin();
      await request(app).patch('/v1/profiles').set('Authorization', `Bearer ${token}`).expect(422);
    });
  });
});
