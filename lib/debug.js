const debug = require('debug');

const loggers = {
  app: debug('app:main'),
  contract: debug('app:contract'),
  tx: debug('app:transaction'),
  error: debug('app:error')
};

const debugLog = (namespace, message, data = null) => {
  if (data) {
    loggers[namespace](`${message}:`, data);
  } else {
    loggers[namespace](message);
  }
};


module.exports = { debugLog }; 