const express = require('express')
const router = express.Router()

const RestaurantList = require('../../models/restaurant')

router.post('/', (req, res) => {
  const userId = req.user._id
  const newRestaurant = req.body
  // console.log(req.body)
  // console.log(newRestaurant)
  return RestaurantList.create(newRestaurant, userId)
    // const restaurant = new RestaurantList({ newRestaurant })
    // return restaurant.save()
    // RestaurantList.create(req.body)
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

router.get('/new', (req, res) => {
  return res.render('new')
})
//搜尋還沒做
router.get('/search', (req, res) => {
  const userId = req.user._id
  const keyword = req.query.keyword.trim()
  const array = keyword.toLowerCase().split('')
  const array2 = keyword.toLowerCase().split(' ')
  RestaurantList.find({ userId })
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
      res.render('index', { restaurants: resultsArr, keyword })
    })
    .catch(error => console.log(error))
})

router.get('/AtoZ', (req, res) => {
  const userId = req.user._id
  RestaurantList.find({ userId })
    .lean()
    .sort({ name: 'asc' })
    .then(restaurants => res.render('index', { restaurants }))
    .catch(error => console.error(error))
})

router.get('/ZtoA', (req, res) => {
  const userId = req.user._id
  RestaurantList.find({ userId })
    .lean()
    .sort({ name: 'desc' })
    .then(restaurants => res.render('index', { restaurants }))
    .catch(error => console.error(error))
})
router.get('/category', (req, res) => {
  const userId = req.user._id
  RestaurantList.find({ userId })
    .lean()
    .sort({ category: 'asc' })
    .then(restaurants => res.render('index', { restaurants }))
    .catch(error => console.error(error))
})
router.get('/location', (req, res) => {
  const userId = req.user._id
  RestaurantList.find({ userId })
    .lean()
    .sort({ location: 'asc' })
    .then(restaurants => res.render('index', { restaurants }))
    .catch(error => console.error(error))
})

router.get('/:id', (req, res) => {
  const userId = req.user._id
  const _id = req.params.id
  return RestaurantList.findOne({  _id, userId })
    .lean()
    .then((restaurant) => res.render('show', { restaurant }))
    .catch(error => console.log(error))
})

router.get('/:id/edit', (req, res) => {
  const userId = req.user._id
  const _id = req.params.id
  return RestaurantList.findOne({  _id, userId })
    .lean()
    .then((restaurant) => res.render('edit', { restaurant }))
    .catch(error => console.log(error))
})

router.put('/:id', (req, res) => {
  const userId = req.user._id
  const _id = req.params.id
  const { name, name_en, category, image, location, phone, google_map, rating, description } = req.body
    // modify restaurant, and save to data
  return RestaurantList.findOne({ _id, userId })
    .then(restaurant => {
      restaurant.name = name,
      restaurant.name_en = name_en,
      restaurant.category = category,
      restaurant.image = image,
      restaurant.location = location,
      restaurant.phone = phone,
      restaurant.google_map = google_map,
      restaurant.rating = rating,
      restaurant.description = description,
      restaurant.save()
    })
    .then(() => {
      res.redirect(`/restaurants/${_id}/`)
    })
    .catch(error => {
      console.log(error)
    })

})
router.delete('/:id', (req, res) => {
  const userId = req.user._id
  const _id = req.params.id
  RestaurantList.findOne({ _id, userId })
    .then(restaurant => restaurant.remove())
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})



module.exports = router