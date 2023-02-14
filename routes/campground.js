const express = require("express");
const router = express.Router();
const campground = require("../controllers/campground");
const catchAsync = require("../utlits/catchAsync");
const multer = require("multer");
const { storage } = require("../cloudinary/index");
const upload = multer({ storage });

const {
  isLoggedIn,
  validateCampgrounds,
  isAuthor,
} = require("../middleware/middleware");

router
  .route("/")
  .get(catchAsync(campground.index))
  .post(
    isLoggedIn,
    upload.array("image"),
    validateCampgrounds,
    catchAsync(campground.createCampground)
  );

router.get("/new", isLoggedIn, catchAsync(campground.renderNewForm));

router
  .route("/:id")
  .get(catchAsync(campground.showCampground))
  .put(
    isLoggedIn,
    isAuthor,
    upload.array("image"),
    validateCampgrounds,
    catchAsync(campground.updateCampground)
  )
  .delete(isLoggedIn, isAuthor, catchAsync(campground.deleteCampground));

router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
  catchAsync(campground.editCampground)
);

module.exports = router;
