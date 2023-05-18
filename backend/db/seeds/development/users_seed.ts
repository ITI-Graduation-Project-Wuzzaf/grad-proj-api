import { Knex } from 'knex';
import { hashSync } from 'bcrypt';

const { PASSWORD, PEPPER, SR } = process.env;
const password = hashSync(`${PASSWORD}${PEPPER}`, Number(SR));

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex('user_account').del();

  // Inserts seed entries
  await knex('user_account').insert([
    { email: 'bassel@test.com', password, first_name: 'Bassel', last_name: 'Salah' },
    { email: 'hussien@test.com', password, first_name: 'Hussien', last_name: 'Tarek' },
    { email: 'youssef@test.com', password, first_name: 'Youssef', last_name: 'Said' },
    { email: 'noran@test.com', password, first_name: 'Noran', last_name: 'Nabil' },
    { email: 'rewan@test.com', password, first_name: 'Rewan', last_name: 'Hamed' },
  ]);
  await knex.raw("select setval('user_account_id_seq', max(id)) from user_account");
}
