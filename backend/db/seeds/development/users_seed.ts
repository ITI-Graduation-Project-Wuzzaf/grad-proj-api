import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex('user_account').del();

  // Inserts seed entries
  await knex('user_account').insert([
    { email: 'bassel@test.com', password: '123456', first_name: 'Bassel', last_name: 'Salah' },
    { email: 'hussien@test.com', password: '123456', first_name: 'Hussien', last_name: 'Tarek' },
    { email: 'youssef@test.com', password: '123456', first_name: 'Youssef', last_name: 'Said' },
    { email: 'noran@test.com', password: '123456', first_name: 'Noran', last_name: 'Nabil' },
    { email: 'rewan@test.com', password: '123456', first_name: 'Rewan', last_name: 'Hamed' },
  ]);
  await knex.raw("select setval('user_account_id_seq', max(id)) from user_account");
}
