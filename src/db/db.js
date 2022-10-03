const db = new require('better-sqlite3')('orss.db', { timeout: 2500 })
const migrations = require('./migrations')

db.exec(`
  CREATE TABLE IF NOT EXISTS orss_migrations (
    id INT PRIMARY KEY,
    hash TEXT NOT NULL
  )
`)

module.exports = {
  prepare: (t) => db.prepare(t),

  findAllOfTable: (table) => {
    if (!table) throw Error('Table cannot be undefined')
    return db.prepare(`SELECT * FROM ${table.toString()}`).all()
  },

  migrate: async () => {
    migrations.forEach((m) => {
      const id = m.id
      const hash = require('crypto').createHash('sha256').update(m.up + m.down, 'utf8').digest('hex')

      // We don't want to re-run migrations we've already run
      const elem = db.prepare('SELECT * FROM orss_migrations WHERE id = ?').all(m.id)
      if (elem.length === 1) {
        if (elem[0].hash !== hash) {
          throw Error(`Migration ${id} has changed, reconcile these changes`)
        }
        return
      }

      try {
        db.exec(m.up)
        db.prepare('INSERT INTO orss_migrations (id, hash) VALUES (?, ?)').run(id, hash)
      } catch (e) {
        console.error(e)
        db.exec(m.down)
        throw Error('Could not perform migrations on database. Exiting.')
      }
    })
  }
}