const { getLogger } = require('log4js');

let loadDotenvFile = () => undefined;
try {
  loadDotenvFile = require('dotenv').config;
} catch (err) {
  // Ignore missing dotenv.
}

loadDotenvFile();

const logLevels = [ 'fatal', 'error', 'warn', 'info', 'debug', 'trace' ];
const logLevel = parseEnvLogLevel('LOG_LEVEL', 'info');

exports.baseUrlPath = process.env.BASE_URL_PATH || '/';

exports.createLogger = createLogger;

exports.databaseUrl = process.env.DATABASE_URL || 'postgresql://localhost/hello-cloud';

exports.maxGreetings = parseEnvInt('MAX_GREETINGS', 10, 1, 10000);

exports.port = parseEnvInt('PORT', 3000, 1, 65535);

function createLogger(category) {
  const logger = getLogger(category);
  logger.level = logLevel;
  return logger;
}

function parseEnvInt(name, defaultValue, min, max) {
  const value = process.env[name];
  if (value === undefined) {
    return defaultValue;
  }

  const parsed = parseInt(value, 10);
  if (!Number.isInteger(parsed)) {
    throw new Error(`Environment variable $${name} must be an integer`);
  } else if ((min !== undefined && parsed < min) || (max !== undefined && parsed > max)) {
    throw new Error(`Environment variable $${name} must be an integer between ${min || '-Infinity'} and ${max || 'Infinity'}`);
  }

  return parsed;
}

function parseEnvLogLevel(name, defaultValue) {
  const value = process.env[name];
  if (value === undefined) {
    return defaultValue;
  } else if (!logLevels.includes(value.toLowerCase())) {
    throw new Error(`Environment variable $${name} must be a valid log level (one of ${logLevels.join(', ')}), but its value is ${JSON.stringify(value)}`);
  }

  return value;
}
