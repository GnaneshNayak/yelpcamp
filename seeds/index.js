const mongoose = require("mongoose");
const path = require("path");
const cities = require("./cities");
const lat = require("./indian");
const Campground = require("../models/campground");
const { descriptors, places } = require("./seedHelper");

mongoose.set("strictQuery", true);
mongoose.connect("mongodb://localhost:27017/yelp-camp");

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

const sample = (arr) => {
  return arr[Math.floor(Math.random() * arr.length)];
};

const seedDB = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < 50; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 50) + 10;
    const camp = new Campground({
      author: "63e4d2e4f619b4741487d504",
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      geometry: {
        type: "Point",
        coordinates: [
          cities[random1000].longitude,
          cities[random1000].latitude,
        ],
      },
      images: [
        {
          url: "https://res.cloudinary.com/dld6fmuoj/image/upload/v1676118547/sample.jpg",
          filename: "Yelpcamp/uh2qbvej7gxnpg5phgke",
        },
        {
          url: "https://res.cloudinary.com/dld6fmuoj/image/upload/v1676118572/cld-sample-2.jpg",
          filename: "Yelpcamp/wvl0ciwdpisoxomehewv",
        },
      ],
      description:
        "Lorem ipsum dolor sit amet, consectetur adipisicing elit. In cum dolorem,pariatur officia commodi maiores magni nemo, voluptatem doloremque consequatur,nostrum fuga ducimus? Dolor dicta, explicabo eius quisquam perspiciatis libero.",
      price,
    });

    await camp.save();
  }
};

seedDB().then(() => {
  db.close();
  console.log("database connection closed");
});
