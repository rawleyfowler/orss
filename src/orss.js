const path = require('path')
const app = require('express')()

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'hbs')

const ORSS_PORT = process.env.ORSS_PORT

app.get('/', (req, res) => {
  res.render('index')
})

module.exports = () =>
  app.listen(ORSS_PORT, () => console.log(`Listening on port ${ORSS_PORT}`))
