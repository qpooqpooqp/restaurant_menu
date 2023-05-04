const express = require('express')
const User = require('../../models/user')
const passport = require('passport')
const router = express.Router()
router.get('/login', (req, res) => {
  res.render('login')
})

router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/users/login'
}))

router.get('/register', (req, res) => {
  res.render('register')
})

router.post('/register', (req, res) => {
  const { name, email, password, confirmPassword } = req.body
  const errors = []
  if (!email || !password || !confirmPassword) {
    errors.push({ message: '姓名以外的欄位都給我填一填再送出!' })
  }
  if (password !== confirmPassword) {
    errors.push({ message: '密碼兩次打一樣的可以嗎?' })
  }
  if (errors.length) {
    return res.render('register', {
      errors,
      name,
      email,
      password,
      confirmPassword
    })
  }
  User.findOne({ email }).then(user => {
    if (user) {
      errors.push({ message: '要建立分身帳號請用不一樣的Email，還要人家教?' })
      return res.render('register', {
        errors,
        name,
        email,
        password,
        confirmPassword
      })
    }
    return User.create({
      name,
      email,
      password
    })
      .then(() => res.redirect('/'))
      .catch(err => console.log(err))
  })
})

router.get('/logout', (req, res) => {
  req.logout()
  req.flash('success_msg', '希望你的人生沒跟你的帳號一樣被登出了QQ')
  res.redirect('/users/login')
})
module.exports = router