const express = require('express');
const { connectLogger } = require('log4js');

const { baseUrlPath, createLogger } = require('./config');
const indexRoutes = require('./routes/index');
const greetingsRoutes = require('./routes/greetings');

const app = express();
const logger = createLogger('app');

app.use(connectLogger(
  createLogger('http'),
  { level: 'debug' }
));

app.use(express.json());

const apiRouter = express.Router();

apiRouter.use('/', indexRoutes);
apiRouter.use('/greetings', greetingsRoutes);

logger.info(`Mounting API router on path ${JSON.stringify(baseUrlPath)}`);
app.use(baseUrlPath, apiRouter);

if (baseUrlPath !== '/') {
  logger.debug(`Redirecting root requests to ${JSON.stringify(baseUrlPath)}`)
  app.get('/', (req, res) => res.redirect(baseUrlPath));
}

module.exports = app;
