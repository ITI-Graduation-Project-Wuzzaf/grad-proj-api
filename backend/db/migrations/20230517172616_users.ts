import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('user_account', (t) => {
    t.increments('id').primary().unique();
    t.string('email', 100);
    t.string('password', 100);
    t.string('first_name', 100);
    t.string('last_name', 100);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('user_account');
}
