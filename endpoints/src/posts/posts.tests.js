const test = require('tape')
const Datastore = require('nedb-promise')
const endpoints = require('./posts.endpoints')

const req = {
  params: {userId: '123'},
  body: {
    subject: 'Post Subject',
    message: 'Post Message'
  }
}

test('GET posts - by userId', function (t) {
  t.plan(1)
  const collection = new Datastore()
  collection.insert([{userId: '123'}, {userId: '123'}])
  .then(() =>
    endpoints.init(collection)['/:userId']
    .get(req, {json: data => t.equal(data.length, 2, 'found 2 posts')})
  )
})

test('POST posts - by userId', function (t) {
  t.plan(4)
  const collection = new Datastore()
  endpoints.init(collection)['/:userId']
  .post(req,
    {
      json: data => {
        t.equal(data.subject, req.body.subject, 'correct subject in response')
        t.equal(data.message, req.body.message, 'correct message in response')
        collection.findOne({userId: req.params.userId})
        .then(doc => {
          t.equal(doc.subject, req.body.subject, 'correct subject in collection')
          t.equal(doc.message, req.body.message, 'correct message in collection')
        })
      }
    }
  )
})
