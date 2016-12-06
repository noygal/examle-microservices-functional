const core = require('../core')
const endpoints = require('../endpoints')

const logger = core.utils.logger.init()

logger.info('Getting settings')

core.utils.discovery.create(process.ENV)
.then(discovery => discovery.get())
.then(settings => Promise.all([
  core.utils.server.init(settings.posts),
  core.utils.logger.init(settings.logger),
  core.utils.collection.create(settings.mongoDB),
  settings.posts
]))
.then(([app, logger, collection, settings]) => {
  logger.info(`Starting server - ${settings.name}`)
  app.use('/', core.middlewares.logs.init(logger))
  app.routeMapper({
    base: settings.base,
    routes: endpoints.posts.init(collection)
  })
  app.use('*', core.middlewares.errors.init(logger))
  app.listen(settings.port, err => err ? logger.error(err)
    : logger.info(`Server Started: ${core.utils.server.getUrl(settings)}`))
})
.catch(err => logger.error('Mayday Mayday mayday, server down!', err))

