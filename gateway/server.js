require('isomorphic-fetch')
const core = require('../core')

const logger = core.utils.logger.init()

const headers = {
  'Content-Type': 'application/json'
}

logger.info('Getting settings')

core.utils.discovery.create(process.ENV)
.then(discovery => discovery.get())
.then(settings => {
  const app = core.utils.server.init()

  app.use('/', core.middlewares.logs.init(logger))

  app.post(`${settings.gateway.base}/users`, (req, res, next) => fetch(core.utils.server.getUrl(settings.users), {
    method: 'POST',
    headers,
    body: JSON.stringify(req.body)
  })
    .then(response => {
      res.status(response.status)
      if (response.status >= 400) return next(new Error('USER_SERVICE_ERROR'))
      response.json().then(data => res.json(data))
    })
    .catch(err => {
      res.status(500)
      next(new Error('NETWORK_ERROR', err))
    })
  )

  app.get(`${settings.gateway.base}/users/:userId`, (req, res, next) => Promise.all([
    fetch(`${core.utils.server.getUrl(settings.users)}/${req.params.userId}`),
    fetch(`${core.utils.server.getUrl(settings.posts)}/${req.params.userId}`)
  ])
    .then(([userRes, postsRes]) => {
      res.status(userRes.status)
      if (userRes.status >= 400) return next(new Error('USER_SERVICE_ERROR'))
      Promise.all([userRes.json(), postsRes.json()])
      .then(([userData, postsData]) => res.json(Object.assign(userData, {posts: postsData})))
    })
    .catch(err => {
      res.status(500)
      next(new Error('NETWORK_ERROR', err))
    })
  )

  app.post(`${settings.gateway.base}/users/:userId/posts`, (req, res, next) =>
    fetch(`${core.utils.server.getUrl(settings.posts)}/${req.params.userId}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(req.body)
    })
    .then(response => {
      res.status(response.status)
      if (response.status >= 400) return next(new Error('USER_SERVICE_ERROR'))
      response.json().then(data => res.json(data))
    })
    .catch(err => {
      res.status(500)
      next(new Error('NETWORK_ERROR', err))
    })
  )

  app.use('*', core.middlewares.errors.init(logger))

  app.listen(settings.gateway.port, err => err ? logger.error(err)
    : logger.info(`Server Started: ${core.utils.server.getUrl(settings.gateway)}`))
})
.catch(err => logger.error('Mayday Mayday mayday, server down!', err))
