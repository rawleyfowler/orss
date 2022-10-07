const axios = require('axios')
const { XMLParser } = require('fast-xml-parser')

const postRepository = require('../db/repos/post')
const site = require('../db/repos/site')
const siteRepository = require('../db/repos/site')
const groupBy = require('../utils/groupBy')

const get = async (page) => {
  return axios.get(page)
    .then(t => t.data)
    .catch(siteRepository.deactivate)
}

const parseXml = (xml) => new XMLParser().parse(xml)

const crawlPosts = (posts) => {
  const existingPosts = postRepository
    .findAllByUris(posts.map(({link}) => link).join(','))
    .map(({uri}) => uri)
  return async (siteUri) => 
    posts
    .filter(({link}) => !link in existingPosts)
    .map(async ({description, title, link}) => ({uri: link, title, description, content: await get(link)}))
    .forEach(async t => {
      const post = await t
      postRepository.insert({...post, siteUri})
    })
}

const crawlSite = async (uri) => {
  const xml = parseXml(await get(uri))
  const channel = xml.rss.channel

  if (!channel) {
    siteRepository.deactivate(t.uri)
    return
  }

  if (channel.title && 
      channel.title.length && 
      channel.description &&
      channel.description.length &&
      !siteRepository.update(uri, channel.title, channel.description)) {
    console.error('Failed to update sites description and title')
  }

  if (channel.item && channel.item.length) {
    crawlPosts(channel.item)(uri)
  }
}

const crawlSiteById = async (id) => {
  const site = siteRepository.findById(id)

  if (!site) {
    return
  }

  await crawlSite(site.uri)
}

const crawl = async () => {
  const sites = siteRepository
    .findAll()
    .filter(t => t.active === 1)
    .reduce(groupBy('uri'), {})
  const posts = postRepository
    .findAll()
    .reduce(groupBy('uri'), {})

  Object.keys(sites)
    .forEach(crawlSite)
}

module.exports = {
  crawl,
  crawlSiteById,
  lastCrawl: Date.now().valueOf()
}