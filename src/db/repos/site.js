const db = require('../db')

module.exports = {
  findAll: () => {
    return db.findAllOfTable('site')
  },

  insert: (uri) => {
    return db.prepare('INSERT INTO site (uri) VALUES ( ? )').run(uri).changes === 1
  },

  update: (uri, title, description) => {
    return db.prepare('UPDATE site SET title = ?, description = ? WHERE uri = ?').run(title, description, uri).changes === 1
  },

  deactivate: (uri) => {
    return db.prepare('UPDATE site SET active = 0 WHERE uri = ?').run(uri).changes === 1
  }
}