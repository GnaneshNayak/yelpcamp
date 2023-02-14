const User = require("../models/user");

module.exports.renderRegister = (req, res) => {
  res.render("users/register");
};

module.exports.register = async (req, res, err) => {
  try {
    const { username, email, password } = req.body;
    const user = new User({ username, email });
    const registerUser = await User.register(user, password);
    req.login(registerUser, (err) => {
      if (err) {
        return next(err);
      } else {
        req.flash("success", "Welcome to Campgrounds");
        res.redirect("/campgrounds");
      }
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/register");
  }
  // console.log(registerUser);
};
module.exports.renderLogin = (req, res) => {
  if (req.query.returnTo) {
    req.session.returnTo = req.query.returnTo;
  }
  res.render("users/login");
};
module.exports.login = (req, res) => {
  req.flash("success", "Welcome back");
  const redirectUrl = res.locals.returnTo || "/campgrounds";
  // delete req.session.returnTo;
  res.redirect(redirectUrl);
};
module.exports.logout = (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.flash("success", "Goodbye");
    res.redirect("/campgrounds");
  });
};
