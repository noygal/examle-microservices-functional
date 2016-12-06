const init = (collection) => ({
  '/': {
    'post': (req, res, next) => collection.insert(req.body)
      .then(doc => res.status(201).json(doc))
      .catch(err => {
        res.status(500)
        next(new Error('DB_ERROR', err))
      })
  },
  '/:userId': {
    'get': (req, res, next) => collection.find({_id: req.params.userId})
      .then(docs => docs.length ? res.json(docs[0]) : res.sendStatus(404))
      .catch(err => {
        res.status(500)
        next(new Error('DB_ERROR', err))
      }),
    'put': (req, res, next) => collection.update({_id: req.params.userId}, {$set: req.body})
      .then(doc => doc ? res.json(Object.assign({_id: req.params.userId}, req.body)) : res.sendStatus(404))
      .catch(err => {
        res.status(500)
        next(new Error('DB_ERROR', err))
      }),
    'delete': (req, res, next) => collection.remove({_id: req.params.userId})
      .then(doc => doc ? res.sendStatus(204) : res.sendStatus(404))
      .catch(err => {
        res.status(500)
        next(new Error('DB_ERROR', err))
      })
  }

})

module.exports = { init }
