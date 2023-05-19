import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema
    .createTable('user_account', (t) => {
      t.increments('id').primary().unique();
      t.string('email', 100).unique().notNullable();
      t.string('password', 100).notNullable();
      t.string('first_name', 100).notNullable();
      t.string('last_name', 100).notNullable();
    })
    .createTable('profile', (t) => {
      t.integer('id').unsigned().notNullable().primary().references('id').inTable('user_account');
      t.string('job', 100);
      t.string('country', 60);
      t.string('city', 60);
      t.string('university');
      t.enu('gender', ['M', 'F']);
      t.string('experience', 100);
      t.date('birthdate');
      t.text('profile_picture');
      t.text('cv');
      t.text('bio');
      t.specificType('skills', 'varchar(100)[]');
      t.specificType('links', 'text[]');
      t.text('portfolio');
      t.timestamps();
    });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('profile').dropTable('user_account');
}
