const { db } = require('./db');
const { startServer } = require('./server');

exports.start = async function() {
  await checkDatabaseConnection();
  await startServer();
};

async function checkDatabaseConnection() {
  const { rows: [ { result } ] } = await db.raw('select 1 + 2 as result;');
  if (result !== 3) {
    throw new Error('Could not query the database');
  }
}
