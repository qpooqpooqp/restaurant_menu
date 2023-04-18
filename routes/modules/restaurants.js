const express = require('express')
const router = express.Router()

const RestaurantList = require('../../models/restaurant')

router.post('/', (req, res) => {
  const newRestaurant = req.body
  // console.log(newRestaurant)
  return RestaurantList.create(newRestaurant)
    // const restaurant = new RestaurantList({ newRestaurant })
    // return restaurant.save()
    // RestaurantList.create(req.body)
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

router.get('/new', (req, res) => {
  return res.render('new')
})

router.get('/:id', (req, res) => {
  const id = req.params.id
  return RestaurantList.findById(id)
    .lean()
    .then((restaurant) => res.render('show', { restaurant }))
    .catch(error => console.log(error))
})

router.get('/:id/edit', (req, res) => {
  const id = req.params.id

  return RestaurantList.findById(id)
    .lean()
    .then((restaurant) => res.render('edit', { restaurant }))
    .catch(error => console.log(error))
})

router.put('/:id', (req, res) => {
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
router.delete('/:id', (req, res) => {
  const id = req.params.id
  RestaurantList.findById(id)
    .then(restaurant => restaurant.remove())
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
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