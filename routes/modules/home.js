const express = require('express')
const router = express.Router()

const RestaurantList = require('../../models/restaurant')

router.get('/', (req, res) => {
  RestaurantList.find()
    .lean()
    .then(restaurants => res.render('index', { restaurants }))
    .catch(error => console.error(error))
})

router.get('/search', (req, res) => {
  const keyword = req.query.keyword.trim()
  const array = keyword.toLowerCase().split('')
  const array2 = keyword.toLowerCase().split(' ')
  RestaurantList.find()
    .lean()
    .then(restaurants => {
      let resultsArr = []
      resultsArr = restaurants.filter(restaurant => {
        const name = restaurant.name.toLowerCase()
        const category = restaurant.category.toLowerCase()
        const name_en = restaurant.name_en.toLowerCase()
        const location = restaurant.location.toLowerCase()
        return array2.some(keyword =>
          name.includes(keyword) ||
          category.includes(keyword) ||
          name_en.includes(keyword) ||
          location.includes(keyword))
      })
      console.log(resultsArr)
      res.render('index', { restaurants: resultsArr, keyword })
    })
    .catch(error => console.log(error))
})

module.exports = router