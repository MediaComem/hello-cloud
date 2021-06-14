const express = require('express');
const { connectLogger } = require('log4js');

const { baseUrlPath, createLogger } = require('./config');
const indexRoutes = require('./routes/index');
const greetingsRoutes = require('./routes/greetings');

const app = express();

app.use(connectLogger(
  createLogger('http'),
  { level: 'debug' }
));

app.use(express.json());

const apiRouter = express.Router();

apiRouter.use('/', indexRoutes);
apiRouter.use('/greetings', greetingsRoutes);

app.use(baseUrlPath, apiRouter);

if (baseUrlPath !== '/') {
  app.get('/', (req, res) => res.redirect(baseUrlPath));
}

module.exports = app;
