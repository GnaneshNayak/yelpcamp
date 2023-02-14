const { campgroundSchema } = require("../schema");
const ExpressErorr = require("../utlits/expressErorr");
const Campground = require("../models/campground");
const Review = require("../models/review");
const { reviewSchema } = require("../schema");

module.exports.isLoggedIn = (req, res, next) => {
  req.session.returnTo = req.originalUrl;
  if (!req.isAuthenticated()) {
    req.flash("error", "You must be signed in frist");
    return res.redirect("/login");
  }
  next();
};

module.exports.validateCampgrounds = (req, res, next) => {
  const { error } = campgroundSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((e) => e.message).join(",");
    throw new ExpressErorr(msg, 400);
  } else {
    next();
  }
};
module.exports.isAuthor = async (req, res, next) => {
  const { id } = req.params;
  const campground = await Campground.findByIdAndUpdate(id);
  if (!campground.author.equals(req.user._id)) {
    req.flash("error", "You dont have permission to do that");
    return res.redirect(`/campgrounds/${id}`);
  } else {
    next();
  }
};
module.exports.isReviewAuthor = async (req, res, next) => {
  const { id, reviewId } = req.params;
  const review = await Review.findByIdAndUpdate(reviewId);
  if (!review.author.equals(req.user._id)) {
    req.flash("error", "You dont have permission to do that");
    return res.redirect(`/campgrounds/${id}`);
  } else {
    next();
  }
};
module.exports.validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((e) => e.message).join(",");
    throw new ExpressErorr(msg, 400);
  } else {
    next();
  }
};

module.exports.checkReturnTo = (req, res, next) => {
  if (req.session.returnTo) {
    res.locals.returnTo = req.session.returnTo;
  }
  next();
};
