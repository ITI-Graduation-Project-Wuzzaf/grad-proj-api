import { Knex, knex as knexInstance } from 'knex';

const config: Knex.Config = {
  client: 'pg',
  connection: {
    host: '127.0.0.1',
    port: 5432,
    user: 'postgres',
    password: '2053',
    database: 'jobify',
  },
  acquireConnectionTimeout: 10000,
};

export const knex = knexInstance(config);
