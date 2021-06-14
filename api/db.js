const Knex = require('knex');

const { databaseUrl } = require('./config');

const config = {
  client: 'pg',
  connection: databaseUrl
};

const db = Knex(config);

exports.config = config;
exports.db = db;
