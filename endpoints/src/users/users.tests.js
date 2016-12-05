const test = require('tape')
const Datastore = require('nedb-promise')
const endpoints = require('./users.endpoints')

const req = {
  params: {userId: '123'},
  body: {
    name: 'Mr Micro',
    address: 'Service St'
  }
}

const compareUsers = (a, b, t) => {
  t.equal(a.name, b.name)
  t.equal(a.address, b.address)
}

const collection = new Datastore()
const controller = endpoints.init(collection)

test('POST new user', function (t) {
  t.plan(2)
  controller['/'].post(req, {
    json: data => {
      compareUsers(data, req.body, t)
      req.params.userId = data._id
    },
    status: code => t.equal(code, 201, 'should return 201')
  })
})

test('GET user - by userId', function (t) {
  t.plan(2)
  controller['/:userId'].get(req, {
    json: data => compareUsers(data, req.body, t)
  })
})

test('PUT user - by userId', function (t) {
  t.plan(2)
  const newReq = {
    params: {userId: req.params.userId},
    body: {
      name: 'Mr Macro',
      address: 'Monolithic St'
    }
  }
  controller['/:userId'].put(newReq, {
    json: data => compareUsers(data, newReq.body, t)
  })
})

test('DELETE user - by userId', function (t) {
  t.plan(2)
  controller['/:userId'].delete(req, {
    sendStatus: code => {
      t.equal(code, 204, 'should return 201')
      collection.find({})
      .then(docs => t.equal(docs.length, 0, 'should delete user'))
    }
  })
})
