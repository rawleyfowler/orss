const axios = require('axios')
const { XMLParser } = require('fast-xml-parser')

const postRepository = require('../db/repos/post')
const siteRepository = require('../db/repos/site')
const groupBy = require('../utils/groupBy')

const get = async (page) => {
  return axios.get(page)
    .then(t => t.data)
    .catch(siteRepository.deactivate)
}

const parseXml = (xml) => new XMLParser().parse(xml)

const crawlPosts = async (posts, siteUri) => {
  posts
    .map(async ({description, title, link}) => ({uri: link, title, description, content: await get(link)}))
    .forEach(async t => {
      const post = await t
      postRepository.insert({...post, siteUri})
    })
}

const crawl = async () => {
  console.log(siteRepository.findAll())
  const sites = siteRepository
    .findAll()
    .filter(t => t.active === 1)
    .reduce(groupBy('uri'), {})
  const posts = postRepository
    .findAll()
    .reduce(groupBy('uri'), {})

  Object.keys(sites)
    .forEach(async t => {
      const channel = parseXml(await get(t)).rss.channel

      if (!channel) {
        siteRepository.deactivate(t.uri)
        return
      }

      if (channel.title && 
          channel.title.length && 
          channel.description &&
          channel.description.length &&
          !siteRepository.update(t, channel.title, channel.description)) {
        console.error('Failed to update sites description and title')
      }

      if (channel.item && channel.item.length) {
        crawlPosts(channel.item, t)
      }
    })
}

module.exports = {
  crawl,
  lastCrawl: Date.now().valueOf()
}