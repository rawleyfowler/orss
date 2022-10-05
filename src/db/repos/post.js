const db = require('../db')

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

  insert: ({ uri, title, content, description, siteUri }) => {
    return db.prepare('INSERT INTO post (uri, title, content, description, site_uri) VALUES (?, ?, ?, ?, ?)')
      .run(uri, title, content, description, siteUri).changes === 1
  },

  findAllBySiteUri: (uri) => {
    return db.prepare('SELECT * FROM post WHERE site_uri = ?').all(uri)
  }
}