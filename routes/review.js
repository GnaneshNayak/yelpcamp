const express = require("express");
const router = express.Router({ mergeParams: true });
const reviews = require("../controllers/review");

const catchAsync = require("../utlits/catchAsync");
const ExpressErorr = require("../utlits/expressErorr");

const {
  validateReview,
  isLoggedIn,
  isReviewAuthor,
} = require("../middleware/middleware");

router.post("/", isLoggedIn, validateReview, catchAsync(reviews.createReview));

router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  catchAsync(reviews.deleteReview)
);

module.exports = router;
