const sqlite = require('sqlite3')
const db = new sqlite.Database('orss.db')
const migrations = require('./migrations')

module.exports = async () =>
  db.serialize(() => {
    let down = []
    migrations.forEach(m => {
      try {
        // We need to keep track of what is run, so if we fail we can do the opposite
        db.run(m.up)
        down.push(db.down)
      } catch (e) {
        down.forEach(t => db.run(t.down))
        throw Error('Could not perform migrations on database. Exiting.')
      }
    })
  })
