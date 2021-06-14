exports.up = async function(knex) {
  await knex.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');

  await knex.schema.createTable('greetings', t => {
    t.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    t.string('name', 50);
    t.timestamp('created_at', { precision: 6, useTz: false }).defaultTo(knex.raw('now()'));
  });
};

exports.down = async function(knex) {
  await knex.schema.dropTable('greetings');
  await knex.raw('DROP EXTENSION "uuid-ossp";');
};
