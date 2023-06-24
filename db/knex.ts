import Knex from 'knex';

import config from '../knexfile';

const environment = process.env.NODE_ENV || 'development';
const dbConfig = config[environment];

export default Knex(dbConfig);
