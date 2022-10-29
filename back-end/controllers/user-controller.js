const { QueryTypes } = require("sequelize");
const sequelize = require("../util/database");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

exports.postSignUp = (req, res) => {
  const userFirstName = req.body.userFirstName;
  const userLastName = req.body.userLastName;
  const userEmail = req.body.userEmail;
  const userPass = req.body.userPass;
  const userConfirmPass = req.body.userConfirmPass;
  const jezik = req.body.jezik;

  if (userPass !== userConfirmPass && this.jezik == 2) {
    return res.json({
      status: 401,
      message: "Lozinke se ne poklapaju!",
    });
  }

  if (userPass !== userConfirmPass && this.jezik == 1) {
    return res.json({
      status: 401,
      message: "Passwords must match!",
    });
  }

  User.findOne({
    where: {
      userEmail: userEmail,
    },
  })
    .then((found) => {
      if (found) {
        if (jezik == 1) {
          return res.json({
            status: 401,
            message: `User ${userEmail} already exists!`,
          });
        } else {
          return res.json({
            status: 401,
            message: `Korisnik ${userEmail} već postoji!`,
          });
        }
      }
      return bcrypt
        .hash(userPass, 12)
        .then((hashedPass) => {
          User.create({
            userFirstName,
            userLastName,
            userEmail,
            userPass: hashedPass,
          })
            .then((created) => {
              if (jezik == 1) {
                res.json({
                  status: 201,
                  message: `User ${created.userEmail} created!`,
                });
              } else {
                res.json({
                  status: 201,
                  message: `Korisnik ${created.userEmail} uspešno kreiran!`,
                });
              }
            })
            .catch((e) => console.log(e));
        })
        .catch((e) => console.log(e));
    })
    .catch((e) => console.log(e));
};

exports.postLogIn = (req, res) => {
  const userEmail = req.body.userEmail;
  const userPass = req.body.userPass;
  const jezik = req.body.jezik;
  let user;

  User.findOne({
    where: {
      userEmail,
    },
  })
    .then((foundUser) => {
      if (!foundUser) {
        if (jezik == 1) {
          return res.json({
            status: 400,
            message: `User ${userEmail} doesn't exists`,
          });
        } else {
          return res.json({
            status: 400,
            message: `Korisnik ${userEmail} ne postoji`,
          });
        }
      }
      user = foundUser;
      return bcrypt.compare(userPass, foundUser.userPass);
    })
    .then((isValid) => {
      if (!isValid) {
        if (jezik == 1) {
          return res.json({
            status: 401,
            message: "Wrong password!",
          });
        } else {
          return res.json({
            status: 401,
            message: "Pogrešna lozinka!",
          });
        }
      }
      const token = jwt.sign(
        {
          userId: user.userId,
        },
        process.env.TOKEN_HASH,
        { expiresIn: "600s" }
      );
      let message;
      if (jezik == 1) {
        message = "Login successful";
      } else {
        message = `Welcome ${user.userFirstName}`;
      }
      res.json({
        message: message,
        status: 200,
        token: token,
        userId: user.userId,
        userName: `${user.userFirstName} ${user.userLastName}`,
        logout: parseInt(Date.now() + 600000),
      });
    })
    .catch((e) => console.log(e));
};

exports.getUser = (req, res) => {
  const userId = req.params.userId;
  {
    User.findOne({
      where: {
        userId,
      },
    })
      .then((user) => {
        res.json({
          userId: user.userId,
          userFirstName: user.userFirstName,
          userLastName: user.userLastName,
          userEmail: user.userEmail,
        });
      })
      .catch((e) => console.log(e));
  }
};
