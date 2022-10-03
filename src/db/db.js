const db = new require('better-sqlite3')('orss.db', { timeout: 2500 })
const migrations = require('./migrations')

module.exports = {
  db,

  findAllOfTable: (table) => {
    if (!table) throw Error('Table cannot be undefined')
    return db.prepare(`SELECT * FROM ${table.toString()}`).all()
  },

  migrate: async () => {
    let down = []
    migrations.forEach((m) => {
      try {
        // We need to keep track of what is run, so if we fail we can do the opposite
        db.exec(m.up)
        down.push(db.down)
      } catch (e) {
        down.forEach((t) => db.exec(t.down))
        throw Error('Could not perform migrations on database. Exiting.')
      }
    })
  }
}