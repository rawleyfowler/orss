const db = require('../db')

module.exports = {
  findAll: () => {
    return db.findAllOfTable('post')
  }
}