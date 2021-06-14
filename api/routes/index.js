const express = require('express');

const { maxGreetings } = require('../config');
const { version } = require('../package.json');

const router = express.Router();

router.get('/', function(req, res) {
  res.send({
    version
  });
});

router.get('/config', function(req, res) {
  res.send({
    maxGreetings,
    version
  });
});

module.exports = router;
