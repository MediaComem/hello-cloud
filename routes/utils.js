const { compose } = require('compose-middleware');
const { validationResult } = require('express-validator');

exports.route = callback => {
  return (req, res, next) => {
    Promise
      .resolve()
      .then(() => callback(req, res, next))
      .catch(next);
  };
};

exports.validate = (validations, options = {}) => {
  return compose([
    ...toArray(validations),
    ensureValid(options)
  ]);
};

function ensureValid(options = {}) {
  const status = options.status;
  if (status === undefined) {
    throw new Error('Validation error status is required');
  } else if (!Number.isInteger(status) || status < 400 || status > 599) {
    throw new Error(`Validation error status must be between 400 and 599 but its value is ${JSON.stringify(status)}`);
  }

  return (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    next();
  };
}

function toArray(value) {
  if (value === undefined) {
    return [];
  }

  return Array.isArray(value) ? value : [ value ];
}
