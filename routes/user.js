const express = require("express");
const passport = require("passport");
const router = express.Router();

const catchAsync = require("../utlits/catchAsync");
const users = require("../controllers/users");
const { checkReturnTo } = require("../middleware/middleware");

router
  .route("/register")
  .get(users.renderRegister)
  .post(catchAsync(users.register));

router
  .route("/login")
  .get(users.renderLogin)
  .post(
    checkReturnTo,
    passport.authenticate("local", {
      failureFlash: true,
      failureRedirect: "/login",
    }),
    users.login
  );

router.get("/logout", users.logout);

module.exports = router;
