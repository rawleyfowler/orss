const db = require('../db')

module.exports = {
  findAll: () => {
    return db.findAllOfTable('site').filter(t => t.active === 1)
  },

  insert: (uri) => {
    const id = require('uuid').v4()
    return db.prepare('INSERT INTO site (id, uri) VALUES ( ?, ? )').run(id, uri).changes === 1
  },

  update: (uri, title, description) => {
    return db.prepare('UPDATE site SET title = ?, description = ? WHERE uri = ?').run(title, description, uri).changes === 1
  },

  deactivate: (uri) => {
    return db.prepare('UPDATE site SET active = 0 WHERE uri = ?').run(uri).changes === 1
  },

  findById: (id) => {
    return db.prepare('SELECT * FROM site WHERE id = ?').get(id)
  }
}