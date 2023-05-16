import { knex } from '../config/db-conf';

export const profileTable = knex.schema.hasTable('profile').then(async (exists) => {
  if (!exists) {
    await knex.schema.createTable('profile', (t) => {
      t.increments('id').primary();
      t.string('country', 100);
      t.string('city', 100);
      t.string('job', 150);
      t.enu('gender', ['M', 'F']);
      t.string('experience_level');
      t.specificType('links', 'text ARRAY');
      t.text('profile_picture');
      t.text('cv');
      t.text('bio');
      t.bigInteger('user_id').unsigned().index().references('id').inTable('user_account');
      t.timestamps();
    });
  }
});
