import { Knex } from 'knex';
import { hashSync } from 'bcrypt';

const { PEPPER, SR } = process.env;

const password = hashSync('12345678' + PEPPER, Number(SR));

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex('profile').del();
  await knex('user_account').del();

  // Inserts seed entries
  //? HERE  USER
  await knex('user_account').insert([
    { id: 1, email: 'bassel@test.com', password, first_name: 'Bassel', last_name: 'Salah' },
    { id: 2, email: 'hussien@test.com', password, first_name: 'Hussien', last_name: 'Tarek' },
    { id: 3, email: 'youssef@test.com', password, first_name: 'Youssef', last_name: 'Said' },
    { id: 4, email: 'noran@test.com', password, first_name: 'Noran', last_name: 'Nabil' },
    { id: 5, email: 'rewan@test.com', password, first_name: 'Rewan', last_name: 'Hamed' },
  ]);
  await knex.raw("select setval('user_account_id_seq', max(id)) from user_account");

  //? HERE  PROFILE
  await knex('profile').insert([{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }]);

  //? HERE  EMPLOYER
  await knex('employer').insert([
    { id: 1, email: 'jobify@company.com', password, name: 'Jobify' },
    { id: 2, email: 'Portal@company.com', password, name: 'Portal' },
  ]);
  await knex.raw("select setval('employer_id_seq', max(id)) from employer");

  //? HERE  JOB
  await knex('job').insert([
    {
      id: 1,
      title: 'DevOps',
      description: 'Expert Devops',
      location: 'Cairo',
      type: 'Part-time',
      category: 'Development',
      employer_id: 1,
    },
    {
      id: 2,
      title: 'Node',
      description: 'Expert Node',
      location: 'Ismailia',
      type: 'Full-time',
      category: 'Development',
      employer_id: 2,
    },
    {
      id: 3,
      title: 'React',
      description: 'Expert React',
      location: 'Port Said',
      type: 'Full-time',
      category: 'Development',
      employer_id: 1,
    },
  ]);
  await knex.raw("select setval('job_id_seq', max(id)) from job");

  //? HERE  APPLICATION
  await knex('application').insert([
    { id: 1, user_id: 1, job_id: 3, status: 'submitted', additional_info: 'pew pew' },
    { id: 2, user_id: 2, job_id: 2, status: 'submitted', additional_info: 'pew pew' },
  ]);
  await knex.raw("select setval('application_id_seq', max(id)) from application");
}
