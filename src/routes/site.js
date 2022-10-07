const crawler = require('../services/crawler')

const siteRouter = require('express').Router()

siteRouter.get('/:id', async (req, res) => {
  await crawler.crawlSiteById(req.params.id)
  res.send('success')
})

module.exports = siteRouter