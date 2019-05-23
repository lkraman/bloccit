const bcrypt = require("bcryptjs");

module.exports = {

// #1
  ensureAuthenticated(req, res, next) {
    console.log('REACHED AUTHENTICATION')
    if (!req.user){
      console.log('NO USER EXISTED')
      req.flash("notice", "You must be signed in to do that.")
      return res.redirect("/users/sign_in");
    } else {
      console.log('USER EXISTED')
      next();
    }
  },

// #2
  comparePass(userPassword, databasePassword) {
    return bcrypt.compareSync(userPassword, databasePassword);
  }
}
