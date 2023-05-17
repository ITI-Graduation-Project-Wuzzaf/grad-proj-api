import request from 'supertest';

import knex from '../../../../db/knex';
import { app } from '../../../app';

describe('Auth routes', () => {
  beforeEach(async () => {
    await knex.migrate.rollback();
    await knex.migrate.latest();
    await knex.seed.run();
  });

  afterEach(async () => {
    // await knex.migrate.rollback();
  });

  describe('POST /v1/signup', () => {
    it('Should signup new user with valid credentials', async () => {
      await request(app)
        .post('/v1/signup')
        .send({
          email: 'test@test.com',
          password: 'password',
          confirmPassword: 'password',
          first_name: 'heya',
          last_name: 'heya',
        })
        .expect(201);
    });
  });

  describe('POST /v1/login', () => {
    // it('Should', async () => {
    console.log('pew');
    // });
  });
});
