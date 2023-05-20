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
    })
    .createTable('employer', (t) => {
      t.increments('id').primary().unique();
      t.string('email', 100).unique().notNullable();
      t.string('password', 100).notNullable();
      t.string('name', 100).notNullable();
      t.string('country', 60);
      t.string('city', 60);
      t.text('logo');
      t.text('description');
      t.text('website');
      t.string('industry', 100);
      t.integer('size');
      t.timestamps();
    })
    .createTable('job', (t) => {
      t.increments('id').primary().unique();
      t.string('title', 200);
      t.text('description');
      t.enu('type', ['Part-time', 'Full-time']);
      t.string('location');
      t.integer('min_salary');
      t.integer('max_salary');
      t.string('experience', 100);
      t.specificType('skills', 'varchar(100)[]');
      t.integer('employer_id').unsigned().notNullable().references('id').inTable('employer');
      t.timestamp('created_at').defaultTo(knex.fn.now());
    });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('profile').dropTable('job').dropTable('user_account').dropTable('employer');
}
