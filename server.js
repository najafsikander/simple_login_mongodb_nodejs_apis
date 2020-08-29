const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const User = require("./models/User");
const { has } = require("lodash");
const { response } = require("express");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(
  "mongodb+srv://najafsk23:Najaf5886983@cluster0.te6ko.mongodb.net/login",
  { useNewUrlParser: true },
  () => {
    console.log("Database is connected");
  }
);

const port = 6969;

app.post("/register", (request, response) => {
  const user = new User();
  user.email = request.body.email;
  user.password = request.body.password;

  bcrypt.genSalt(10, (error, salt) => {
    console.info("salt", salt);
    bcrypt.hash(user.password, salt, (error, hash) => {
      console.info("hash", hash);
      if (error) {
        return error;
      }
      user.password = hash;

      user
        .save()
        .then((result) => {
          response.status(200).send("Record saved");
        })
        .catch((error) => {
          response.status(500).send("Error");
        });
    });
  });
});

app.get("/login", (request, response) => {
  User.findOne({ email: request.body.email })
    .then((user) => {
      if (user) {
        bcrypt.compare(
          request.body.password,
          user.password,
          (error, matched) => {
            if (matched) {
              response.status(200).send("Logged in");
            } else {
              response.status(200).send("Record not found");
            }
          }
        );
      } else {
        response.status(200).send("Record not found");
      }
    })
    .catch((error) => {
      response.status(500).send(error);
    });
});
app.listen(port, () => {
  console.info("Server is running on port: ", port);
});
