const Sequelize = require("sequelize");
const sequelize = require("../util/database");

const User = sequelize.define(
  "user",
  {
    userId: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userFirstName: {
      type: Sequelize.STRING(20),
      allowNull: false,
    },
    userLastName: {
      type: Sequelize.STRING(20),
      allowNull: false,
    },
    userEmail: {
      type: Sequelize.STRING(100),
      allowNull: false,
    },
    userPass: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "users",
  }
);

module.exports = User;
