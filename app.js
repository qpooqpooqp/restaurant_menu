const express = require('express')
const mongoose = require('mongoose')
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
const routes = require('./routes')
const exphbs = require('express-handlebars')
const RestaurantList = require('./models/restaurant')
const bodyParser = require('body-parser')
const app = express()
const port = 3000
const methodOverride = require('method-override')
const db = mongoose.connection
db.on('error', () => {
  console.log('喔幹!連線失敗啦...')
})

db.once('open', () => {
  console.log('唷呼~連線成功!')
})

app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')

app.use(methodOverride('_method'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use (routes)






app.use(express.static('public'))


app.listen(port, () => {
  console.log('App is running on http://localhost:3000')
})