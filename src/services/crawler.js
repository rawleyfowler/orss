const axios = require('axios')
const { XMLParser } = require('fast-xml-parser')

const postRepository = require('../db/repos/post')
const site = require('../db/repos/site')
const siteRepository = require('../db/repos/site')
const groupBy = require('../utils/groupBy')

const get = async (page) => {
  return axios.get(page).then(t => t.data)
}

const parseXml = (xml) => new XMLParser().parse(xml)

const crawl = async () => {
  console.log(siteRepository.findAll())
  const sites = siteRepository
    .findAll()
    .filter(t => t.active === 1)
    .reduce(groupBy('uri'), {})
  const posts = postRepository
    .findAll()
    .reduce(groupBy('uri'), {})

  console.log("POSTS", posts)

  Object.keys(sites).forEach(async uri => {
  })
}

module.exports = {
  crawl,
  lastCrawl: Date.now().valueOf()
}