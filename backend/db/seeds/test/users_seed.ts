import { Knex } from 'knex';
import { hashSync } from 'bcrypt';

const password = hashSync('12345678', 8);

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex('user_account').del();

  // Inserts seed entries
  await knex('user_account').insert([
    { id: 1, email: 'bassel@test.com', password, first_name: 'Bassel', last_name: 'Salah' },
    { id: 2, email: 'hussien@test.com', password, first_name: 'Hussien', last_name: 'Tarek' },
    { id: 3, email: 'youssef@test.com', password, first_name: 'Youssef', last_name: 'Said' },
    { id: 4, email: 'noran@test.com', password, first_name: 'Noran', last_name: 'Nabil' },
    { id: 5, email: 'rewan@test.com', password, first_name: 'Rewan', last_name: 'Hamed' },
  ]);
  await knex.raw("select setval('user_account_id_seq', max(id)) from user_account");
}
