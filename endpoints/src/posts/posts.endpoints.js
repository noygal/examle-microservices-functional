const init = (collection) => ({
  '/:userId': {
    'post': (req, res, next) => {
      const {userId} = req.params
      const {subject = '', message = ''} = req.body
      const post = {userId, subject, message, createDate: new Date()}
      collection.insert(post)
      .then(doc => res.status(201).json(doc))
      .catch(err => {
        res.status(500)
        next(new Error('DB_ERROR', err))
      })
    },
    'get': (req, res, next) => {
      const {userId} = req.params
      collection.find({userId})
      .then(docs => res.json(docs))
      .catch(err => {
        res.status(500)
        next(new Error('DB_ERROR', err))
      })
    }
  }

})

module.exports = { init }
