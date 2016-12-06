const winston = require('winston')

// Add winston.transports.Logstash
require('winston-logstash')
/**
 *  @param {Object} options options object
 *  @param {boolean} options.console console transport
 *  @param {boolean} options.file file transport
 *  @param {string} options.fileName
 *  @param {boolean} options.logstash logstash transport
 *  @param {Object} options.logstashOptions - https://github.com/jaakkos/winston-logstash#node
 *  @returns {Object} - winston logger
 */
const init = (options = {console: true}) => new (winston.Logger)({
  transports: []
  .concat(options.console ? new (winston.transports.Console)({colorize: true}) : [])
  .concat(options.file ? new (winston.transports.File)({ filename: options.fileName }) : [])
  .concat(options.logstash ? new (winston.transports.Logstash)(options.logstashOptions) : [])
})

module.exports = { init }
