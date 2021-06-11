const express = require('express');
const { connectLogger } = require('log4js');

const { createLogger } = require('./config');
const indexRoutes = require('./routes/index');
const greetingsRoutes = require('./routes/greetings');

const app = express();

app.use(connectLogger(
  createLogger('http'),
  { level: 'debug' }
));

app.use(express.json());

app.use('/', indexRoutes);
app.use('/greetings', greetingsRoutes);

module.exports = app;
