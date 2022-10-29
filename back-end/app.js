require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const sequelize = require("./util/database");
const billRouter = require("./routers/bill-router");
const userRouter = require("./routers/user-router");

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});
app.use(express.json());
app.use("/api/bills/", billRouter);
app.use("/api/users/", userRouter);

const Period = require("./models/Period");
const Placanje = require("./models/Placanje");
const Poverilac = require("./models/Poverilac");
const Racun = require("./models/Racun");
const User = require("./models/User");

Poverilac.hasMany(Racun, {
  foreignKey: "poverilacId",
});
Period.hasMany(Racun, {
  foreignKey: "periodId",
});
User.hasMany(Racun, {
  foreignKey: "userId",
});
User.hasMany(Poverilac, {
  foreignKey: "userId",
});
Racun.hasMany(Placanje, {
  foreignKey: "racunId",
});

sequelize
  .sync({
    force: false,
  })
  .then((result) => {
    app.listen(port, () => {
      console.log(`Database connected. Server is running on port ${port}...`);
    });
  })
  .catch((e) => console.log(e));
