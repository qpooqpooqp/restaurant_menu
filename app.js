const express = require('express')
const mongoose = require('mongoose')
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const app = express()
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
const port = 3000
const exphbs = require('express-handlebars')
const db = mongoose.connection

db.on('error', () => {
  console.log('喔幹!連線失敗啦...')
})

db.once('open', () => {
  console.log('唷呼~連線成功!')
})
const restaurantList = require('./restaurant.json')

app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')

app.get('/', (req, res) => {
  res.render('index', { restaurants: restaurantList.results })
})

app.get('/restaurants/:restaurants_id', (req, res) => {
  const restaurants = restaurantList.results.find(
    restaurants => restaurants.id.toString() === req.params.restaurants_id
  )
  res.render('show', { restaurants: restaurants })
})

app.get('/search', (req, res) => {
  const keyword = req.query.keyword
  function search(){
    return restaurantList.results.filter(restaurant => restaurant.name.toLowerCase().includes(keyword.toLowerCase()) || restaurant.name_en.toLowerCase().includes(keyword.toLowerCase()) || restaurant.category.toLowerCase().includes(keyword.toLowerCase())
      )
  }
  const restaurants = search()
  res.render('index', { restaurants: restaurants, keyword: keyword })
})

app.use(express.static('public'))


app.listen(port, () => {
  console.log('App is running on http://localhost:3000')
})