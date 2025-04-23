const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const User = require("./models/User.model");
const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const authRoutes = require("./routes/auth.route.js");
const songRoutes = require("./routes/song.js");
const app = express();
const port = 8000;

mongoose
  .connect(process.env.DB_URL)
  .then((x) => {
    console.log("Connected to MONGODB");
  })
  .catch((err) => {
    console.log("Error while connecting to mongodb");
  });

app.use(express.json());
//jwt password authentication

let opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.JWT_SECRET;
passport.use(
  new JwtStrategy(opts, function (jwt_payload, done) {
    User.findOne({ id: jwt_payload.sub }, function (err, user) {
      if (err) {
        return done(err, false);
      }
      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
        // or you could create a new account
      }
    });
  })
);

//end auth
app.use("/auth", authRoutes);
app.use("/song", songRoutes);

app.get("/", (req, res) => {
  res.send("Tanay hero of this world");
});

app.listen(port, (req, res) => {
  console.log("App running on port : ", port);
});
