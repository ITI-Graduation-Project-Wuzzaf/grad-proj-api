import type { Knex } from 'knex';

import dotenv from 'dotenv';
dotenv.config();

// Update with your config settings.

const { POSTGRES_HOST, POSTGRES_PORT, POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DATABASE, POSTGRES_DATABASE_TEST } =
  process.env;

const config: { [key: string]: Knex.Config } = {
  development: {
    client: 'pg',
    connection: {
      host: POSTGRES_HOST,
      port: Number(POSTGRES_PORT),
      user: POSTGRES_USER,
      password: POSTGRES_PASSWORD,
      database: POSTGRES_DATABASE,
    },
    migrations: {
      directory: __dirname + '/db/migrations',
    },
    seeds: {
      directory: __dirname + '/db/seeds/development',
    },
    acquireConnectionTimeout: 10000,
  },

  test: {
    client: 'pg',
    connection: {
      host: POSTGRES_HOST,
      port: Number(POSTGRES_PORT),
      user: POSTGRES_USER,
      password: POSTGRES_PASSWORD,
      database: POSTGRES_DATABASE_TEST,
    },
    migrations: {
      directory: __dirname + '/db/migrations',
    },
    seeds: {
      directory: __dirname + '/db/seeds/test',
    },
    acquireConnectionTimeout: 10000,
  },

  // production: {
  //   client: "postgresql",
  //   connection: {
  //     database: "my_db",
  //     user: "username",
  //     password: "password"
  //   },
  //   pool: {
  //     min: 2,
  //     max: 10
  //   },
  //   migrations: {
  //     tableName: "knex_migrations"
  //   }
  // }
};

export default config;
