module.exports = {
  authenticator: (req, res, next) => {
    if (req.isAuthenticated()) {
      return next()
    }
    req.flash('warning_msg', '你沒登入就別想用!') 
    res.redirect('/users/login')
  }
}