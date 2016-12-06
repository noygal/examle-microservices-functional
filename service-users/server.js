const core = require('../core')
const endpoints = require('../endpoints')

const app = core.utils.server.init()
const logger = core.utils.logger.init()
const collectionP = core.utils.collection.create()

logger.info('Starting server')
Promise.all([collectionP])
.then(([collection]) => {
  logger.info('Promises resolved')
  app.use('/', core.middlewares.logs.init(logger))
  app.routeMapper({
    base: '/users',
    routes: endpoints.users.init(collection)
  })
  app.use('*', core.middlewares.errors.init(logger))
  app.listen(3001, err => err ? logger.error(err) : logger.info('listen localhost:3001'))
})
