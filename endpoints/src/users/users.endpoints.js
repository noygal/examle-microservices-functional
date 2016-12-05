const init = (collection) => ({
  '/': {
    'post': (req, res, next) => {}
  },
  '/:userId': {
    'get': (req, res, next) => {},
    'put': (req, res, next) => {},
    'delete': (req, res, next) => {}
  }

})

module.exports = { init }
