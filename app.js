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
const RestaurantList = require('./models/restaurant')
const bodyParser = require('body-parser')
const restaurant = require('./models/restaurant')
db.on('error', () => {
  console.log('喔幹!連線失敗啦...')
})

db.once('open', () => {
  console.log('唷呼~連線成功!')
})

app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')


app.use(bodyParser.urlencoded({ extended: true }))
app.get('/', (req, res) => {
  RestaurantList.find()
    .lean()
    .then(restaurants => res.render('index', {restaurants}))
    .catch(error => console.error(error))  
})

app.get('/restaurants/new', (req,res) => {
  return res.render('new')
})

app.post('/restaurants', (req, res) =>{
  const newRestaurant = req.body
  // console.log(newRestaurant)
  return RestaurantList.create(newRestaurant)
  // const restaurant = new RestaurantList({ newRestaurant })
  // return restaurant.save()
  // RestaurantList.create(req.body)
  .then(() => res.redirect('/'))
  .catch(error => console.log(error))
})

app.get('/restaurants/:id', (req, res) => {
  const id = req.params.id
  return RestaurantList.findById(id)
  .lean()
  .then((restaurant) => res.render('show', { restaurant }))
  .catch(error => console.log(error))
})

app.get('/restaurants/:id/edit', (req, res) => {
  const id = req.params.id
  
  return RestaurantList.findById(id)
    .lean()
    .then((restaurant) => res.render('edit', { restaurant }))
    .catch(error => console.log(error))
})

app.post('/restaurants/:id/edit', (req, res) => {
  const id = req.params.id
  const data = req.body
  ":id"
  // modify restaurant, and save to data
  return RestaurantList.findById(id)
    .then(restaurant => {
      restaurant.name = data.name,
        restaurant.name_en = data.name_en,
        restaurant.category = data.category,
        restaurant.image = data.image,
        restaurant.location = data.location,
        restaurant.phone = data.phone,
        restaurant.google_map = data.google_map,
        restaurant.rating = data.rating,
        restaurant.description = data.description,
        restaurant.save()
    })
    .then(() => {
      res.redirect(`/restaurants/${id}/`)
    })
    .catch(error => {
      console.log(error)
    })

})
app.post('/restaurants/:id/delete', (req, res) =>{
  const id = req.params.id
  RestaurantList.findById(id)
  .then(restaurant => restaurant.remove())
  .then(() => res.redirect('/'))
  .catch(error => console.log(error))
})
app.get('/search', (req, res) => {
  const keyword = req.query.keyword.trim()
  const array = keyword.toLowerCase().split('')
  const array2 = keyword.toLowerCase().split(' ')
  RestaurantList.find()
    .lean()
    .then(restaurants => {
      let resultsArr = []
      resultsArr = restaurants.filter(restaurant =>{
        const name = restaurant.name.toLowerCase()
        const category = restaurant.category.toLowerCase()
        const name_en = restaurant.name_en.toLowerCase()
        const location = restaurant.location.toLowerCase()
        return array2.some(keyword => 
          name.includes(keyword)||
          category.includes(keyword)||
          name_en.includes(keyword)||
          location.includes(keyword))
      })
      console.log(resultsArr)
      res.render('index',{ restaurants: resultsArr, keyword })
    })
    .catch(error => console.log(error))
})

app.use(express.static('public'))


app.listen(port, () => {
  console.log('App is running on http://localhost:3000')
})