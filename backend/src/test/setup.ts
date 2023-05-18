import knex from '../../db/knex';

beforeEach(async () => {
  await knex.migrate.rollback();
  await knex.migrate.latest();
  await knex.seed.run();
});

afterEach(async () => {
  // await knex.migrate.rollback();
});
