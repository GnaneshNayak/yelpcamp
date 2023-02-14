if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const ejs = require("ejs");
const ejsMate = require("ejs-mate");
const ExpressErorr = require("./utlits/expressErorr");
const methodOverRide = require("method-override");
const Joi = require("joi");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const localStrategy = require("passport-local");
const User = require("./models/user");

const userRoutes = require("./routes/user");
const campgroundRoutes = require("./routes/campground");
const reviewRoutes = require("./routes/review");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const dbUrl = process.env.DB_URL || "mongodb://localhost:27017/yelp-camp";

const MongoStore = require("connect-mongo");
const app = express();
// "mongodb://localhost:27017/yelp-camp";
mongoose.set("strictQuery", true);
mongoose.connect(dbUrl);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverRide("_method"));
app.use(express.static(path.join(__dirname, "public")));
app.use(
  mongoSanitize({
    replaceWith: "_",
  })
);

const secret = process.env.SECRET || "thisissecret";

const store = MongoStore.create({
  mongoUrl: dbUrl,
  touchAfter: 24 * 60 * 60,
  crypto: {
    secret,
  },
});

store.on("error", function (e) {
  console.log("session store error ", e);
});

const sessionConfig = {
  store,
  name: "session",
  secret,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    // secure: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};
app.use(session(sessionConfig));
app.use(flash());
// app.use(helmet());

// const fontSrcUrls = ["https://res.cloudinary.com/dld6fmuoj/"];

//
const scriptSrcUrls = [
  "https://stackpath.bootstrapcdn.com/",
  "https://api.tiles.mapbox.com/",
  "https://api.mapbox.com/",
  "https://kit.fontawesome.com/",
  "https://cdnjs.cloudflare.com/",
  "https://cdn.jsdelivr.net/",
  "https://res.cloudinary.com/dld6fmuoj/",
];
const styleSrcUrls = [
  "https://kit-free.fontawesome.com/",
  "https://stackpath.bootstrapcdn.com/",
  "https://api.mapbox.com/",
  "https://api.tiles.mapbox.com/",
  "https://fonts.googleapis.com/",
  "https://use.fontawesome.com/",
  "https://cdn.jsdelivr.net/",
  "https://res.cloudinary.com/dld6fmuoj/",
];
const connectSrcUrls = [
  "https://*.tiles.mapbox.com",
  "https://api.mapbox.com",
  "https://events.mapbox.com",
  "https://res.cloudinary.com/dld6fmuoj/",
];
const fontSrcUrls = ["https://res.cloudinary.com/dld6fmuoj/"];

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: [],
      connectSrc: ["'self'", ...connectSrcUrls],
      scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
      styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
      workerSrc: ["'self'", "blob:"],
      objectSrc: [],
      imgSrc: [
        "'self'",
        "blob:",
        "data:",
        "https://res.cloudinary.com/dld6fmuoj/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT!
        "https://images.unsplash.com/",
      ],
      fontSrc: ["'self'", ...fontSrcUrls],
      mediaSrc: ["https://res.cloudinary.com/dld6fmuoj/"],
      childSrc: ["blob:"],
    },
  })
);
app.use(
  helmet.crossOriginEmbedderPolicy({
    policy: "credentialless",
  })
);

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

app.use("/", userRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/reviews", reviewRoutes);

app.get("/", (req, res) => {
  res.render("home");
});

app.all("*", (req, res, next) => {
  next(new ExpressErorr("page not found", 404));
});
app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "something went wrong ";
  res.status(statusCode).render("error", { err });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`listening on ${port}`));
