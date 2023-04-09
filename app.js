const express = require('express')
const app = express()
const port = 3000
const exphbs = require('express-handlebars')
const restaurantList = require('./restaurant.json')

app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

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
  console.log(`Express is listening on localhost:${port}`)
})