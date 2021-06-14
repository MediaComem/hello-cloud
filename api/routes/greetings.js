const express = require('express');
const { body } = require('express-validator');

const { createLogger, maxGreetings } = require('../config');
const { db } = require('../db');
const { route, validate } = require('./utils');

const router = express.Router();
const logger = createLogger('greetings');

// Create a greeting.
router.post(
  '/',
  validate(
    body('name')
      .isString()
      .withMessage('must be a string')
      .trim()
      .isLength({ min: 3, max: 50 })
      .withMessage('must be between 3 and 50 characters long'),
    { status: 422 }
  ),
  route(async (req, res) => {
    const { name } = req.body;

    const [ insertedGreeting ] = await db
      .insert({ name })
      .into('greetings')
      .returning('*');

    logger.info(`Successfully created greeting ${insertedGreeting.id}`);
    res.status(201).send(serializeGreeting(insertedGreeting));

    await cleanUpOldGreetings();
  })
);

// List all greetings.
router.get(
  '/',
  route(async (req, res) => {
    const greetings = await db
      .select('*')
      .from('greetings')
      .orderBy('created_at', 'desc')
      .orderBy('id', 'asc');

    res.send(greetings.map(serializeGreeting));
  })
);

module.exports = router;

function serializeGreeting({ id, name, created_at }) {
  return {
    id,
    name,
    createdAt: created_at
  };
}

async function cleanUpOldGreetings() {
  const [ oldestGreetingToKeep ] = await db
    .select('created_at')
    .from('greetings')
    .orderBy('created_at', 'desc')
    .orderBy('id', 'asc')
    .offset(maxGreetings - 1)
    .limit(1);

  if (!oldestGreetingToKeep) {
    return;
  }

  await db
    .table('greetings')
    .where('created_at', '<', oldestGreetingToKeep.created_at)
    .del();

  logger.debug(`Successfully cleaned up greetings older than the last ${maxGreetings}`);
}
