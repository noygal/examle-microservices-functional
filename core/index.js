module.exports = {
  middlewares: {
    errors: require('./src/middlewares/errors'),
    logs: require('./src/middlewares/logs')
  },
  utils: {
    collection: require('./src/utils/collection'),
    discovery: require('./src/utils/discovery'),
    logger: require('./src/utils/logger'),
    server: require('./src/utils/server')
  }
}
