import knex from '../config/db-conf';

export const userTable = knex.schema.hasTable('user_account').then(async (exists) => {
  if (!exists) {
    await knex.schema.createTable('user_account', (t) => {
      t.increments('id').primary();
      t.string('email', 100);
      t.string('password', 100);
      t.string('first_name', 100);
      t.string('last_name', 100);
    });
  }
});
