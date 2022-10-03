const axios = require('axios')
const { XMLParser } = require('fast-xml-parser')

const postRepository = require('../db/repos/post')
const siteRepository = require('../db/repos/site')

const get = async (page) => {
  return axios.get(page).then(t => t.data)
}

const parseXml = (xml) => new XMLParser().parse(xml)

const crawl = async () => {
  const sites = siteRepository
    .findAll()
    .filter(t => t.active)
    .reduce((p, acc) => acc[p.uri] = p, {})
  const posts = postRepository
    .findAll()
    .reduce((p, acc) => acc[p.uri] = p, {})

  sites.forEach(async s => {
    const result = parseXml(await get(s.uri))
    console.log(result)
  })
}

module.exports = {
  crawl,
  lastCrawl: Date.now().valueOf()
}