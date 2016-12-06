const express = require('express')
const routeMapper = require('expressjs-route-mapper')
const compression = require('compression')
/**
 *  @param {Object} options options object
 *  @param {boolean} options.useMapper console transport
 *  @returns {Object} - express app
 */
const init = (options = {noMapper: false}) => {
  const app = express()
  app.use(compression())
  if (!options.noMapper) routeMapper.use(app)
  return app
}

module.exports = { init }
