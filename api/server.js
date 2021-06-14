const http = require('http');

const app = require('./app');
const { createLogger, port } = require('./config');

const logger = createLogger('http');

app.set('port', port);

const server = http.createServer(app);

exports.startServer = () => {
  return new Promise((resolve, reject) => {
    server.listen(port);

    server.on('error', err => reject(toUserFriendlyError(err)));

    server.on('listening', () => {
      onListening();
      resolve();
    });
  });
}

function toUserFriendlyError(error) {
  if (error.syscall !== 'listen') {
    return error;
  }

  switch (error.code) {
    case 'EACCES':
      return new Error(`Port ${port} requires elevated privileges`);
    case 'EADDRINUSE':
      return new Error(`Port ${port} is already in use`);
    default:
      return error;
  }
}

function onListening() {
  logger.info(`Listening on port ${port}`);
}
