import request from 'supertest';

import knex from '../../db/knex';
import { app } from '../app';

declare global {
  function signin(email: 'jobify@company.com' | 'bassel@test.com'): Promise<string>;
}

beforeAll(async () => {
  await knex.migrate.rollback();
  await knex.migrate.latest();
});

beforeEach(async () => {
  await knex.raw('TRUNCATE TABLE profile RESTART IDENTITY CASCADE');
  // await knex.raw('TRUNCATE TABLE job RESTART IDENTITY CASCADE');
  await knex.raw('TRUNCATE TABLE user_account RESTART IDENTITY CASCADE');
  await knex.raw('TRUNCATE TABLE employer RESTART IDENTITY CASCADE');
  await knex.seed.run();
});

afterEach(async () => {
  // await knex.migrate.rollback();
});

afterAll(async () => {
  await knex.migrate.rollback();
  await knex.destroy();
});

global.signin = async (email) => {
  const res = await request(app).post('/v1/login').send({
    email,
    password: '12345678',
  });
  const token = res.body.accessToken;
  return token;
};
