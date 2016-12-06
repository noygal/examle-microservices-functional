const Datastore = require('nedb-promise')
const MongoClient = require('mongodb').MongoClient

/**
 *  @param {Object} options options object
 *  @param {string} options.type 'local'|'remote'
 *  @param {string} options.url remote mongodb url - https://docs.mongodb.com/manual/reference/connection-string/
 *  @param {string} options.name
 *  @param {Object} options.mongodbOptions options mongodb client - http://mongodb.github.io/node-mongodb-native/2.2/api/MongoClient.html
 *  @param {Object} options.nedbOptions options nedb client - https://github.com/louischatriot/nedb#creatingloading-a-database
 *  @returns {Promise} - resolved to collection
 */
const create = (options = { type: 'local' }) => new Promise((resolve, reject) => {
  if (options.type === 'local') return resolve(new Datastore(Object.assign({}, options.nedbOptions)))
  if (options.type === 'mongodb') {
    return MongoClient.connect(options.url,
      Object.assign({
        server: {
          poolSize: 3
        }
      }, options.mongodbOptions))
        .then(db => db.collection(options.name))
  }
})

module.exports = { create }
