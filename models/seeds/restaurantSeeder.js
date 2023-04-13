const mongoose = require('mongoose')
const Restaurant = require('../restaurant')
const restaurantList =require('../../restaurant.json').results
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })

const db = mongoose.connection


db.on('error', () => {
  console.log('喔幹!連線失敗啦...')
})

db.once('open', () => {
  console.log('唷呼~連線成功!')
  Restaurant.create(restaurantList)
  console.log('Done')
})