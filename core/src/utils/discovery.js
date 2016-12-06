const localSettings = {
  users: {
    name: 'users',
    base: '/users',
    host: 'localhost',
    port: '3000',
    schemes: ['http']
  },
  posts: {
    name: 'posts',
    base: '/posts',
    host: 'localhost',
    port: '3001',
    schemes: ['http']
  },
  gateway: {
    name: 'gateway',
    base: '/api',
    host: 'localhost',
    port: '8080',
    schemes: ['http']
  },
  mongoDB: {
    type: 'local'
  },
  logger: {
    console: true
  }
}

const create = (env) => new Promise((resolve, reject) => {
  let settings = localSettings
  resolve({
    get: serviceName => serviceName ? Promise.resolve(settings[serviceName]) : settings,
    register: (serviceName, serviceSettings) => Promise.resolve(settings[serviceName] = serviceSettings)
  })
})

module.exports = { create }
