const app = require('express').Router()

const postRepository = require('../db/repos/post')

app.get('/:post', (req, res) => {
  const post = postRepository.findById(req.params.post)
  res.render('post', { post })
})

module.exports = app
