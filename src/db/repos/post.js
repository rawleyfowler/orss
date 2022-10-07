const db = require('../db')
const uuid = require('uuid')

module.exports = {
  findAll: () => {
    return db.findAllOfTable('post')
  },

  findByUri: (uri) => {
    return db.prepare('SELECT * FROM post WHERE uri = ?').get(uri)
  },

  findAllByUris: (...uris) => {
    return db.prepare('SELECT * FROM post WHERE uri IN ( ? )').all(uris.join(', '))
  },

  findById: (id) => {
    return db.prepare('SELECT * FROM post WHERE id = ?').get(id)
  },

  insert: ({ uri, title, content, description, siteUri }) => {
    const id = uuid.v4()
    return db.prepare('INSERT INTO post (id, uri, title, content, description, site_uri) VALUES (?, ?, ?, ?, ?, ?)')
      .run(id, uri, title, content, description, siteUri).changes === 1
  },

  findAllBySiteUri: (uri) => {
    return db.prepare('SELECT * FROM post WHERE site_uri = ?').all(uri)
  }
}