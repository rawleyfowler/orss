const app = require('./src/orss')
const db = require('./src/db/db')

db.migrate().then(app)
