import { Client } from '@elastic/elasticsearch';

const { ES_USER, ES_PASS } = process.env;

export const client = new Client({
  node: 'http://localhost:9200',
  auth: {
    username: ES_USER + '',
    password: ES_PASS + '',
  },
});
