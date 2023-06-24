"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.client = void 0;
const elasticsearch_1 = require("@elastic/elasticsearch");
const { ES_USER, ES_PASS } = process.env;
exports.client = new elasticsearch_1.Client({
    node: 'http://localhost:9200',
    auth: {
        username: ES_USER + '',
        password: ES_PASS + '',
    },
});
