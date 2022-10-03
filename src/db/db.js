const db = new require('better-sqlite3')('orss.db', { timeout: 2500 })
const migrations = require('./migrations')

module.exports = {
  prepare: (t) => db.prepare(t),

  findAllOfTable: (table) => {
    if (!table) throw Error('Table cannot be undefined')
    return db.prepare(`SELECT * FROM ${table.toString()}`).all()
  },

  migrate: async () => {
    migrations.forEach((m) => {
      try {
        db.exec(m.up)
      } catch (e) {
        db.exec(m.down)
        throw Error('Could not perform migrations on database. Exiting.')
      }
    })
  }
}