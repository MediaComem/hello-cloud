const express = require('express');

const { version } = require('../package.json');

const router = express.Router();

router.get('/', function(req, res) {
  res.json({
    version
  });
});

module.exports = router;
