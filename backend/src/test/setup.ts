import knex from '../../db/knex';

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
