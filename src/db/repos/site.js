const db = require('../db')

module.exports = {
  findAll: () => {
    return db.findAllOfTable('site')
  },

  insert: (uri) => {
    return db.prepare('INSERT INTO site (uri) VALUES ( ? )').run(uri).changes === 1
  }
}