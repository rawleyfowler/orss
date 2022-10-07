const router = require('express').Router()
const { body, validationResult } = require('express-validator')

const prettyPrintError = require('../utils/ppError')
const crawler = require('../services/crawler')
const postRepository = require('../db/repos/post')
const siteRepository = require('../db/repos/site')

const getSitesWithPosts = () =>
  siteRepository
    .findAll()
    .map(site => ({...site, posts: postRepository.findAllBySiteUri(site.uri)}))

router.get('/', (req, res) => {
  return res.render('index', { sites: getSitesWithPosts() })
})

router.post('/', 
  body('rss').isString().isURL(),
  (req, res) => {
  const errors = validationResult(req).errors.map(prettyPrintError)

  if (errors.length) {
    return res.render('index', { errors })
  }

  if(!siteRepository.insert(req.body.rss)) {
    return res.render('index', { errors: ['Something went wrong saving that URI!'] })
  }

  return res.render('index', { sites: getSitesWithPosts() })
})

module.exports = router