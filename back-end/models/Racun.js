const Sequelize = require("sequelize");
const sequelize = require("../util/database");

const Racun = sequelize.define(
  "racun",
  {
    racunId: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    pozivNaBroj: {
      type: Sequelize.STRING(50),
      allowNull: false,
    },
    iznosRacuna: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
    },
    poverilacId: {
      type: Sequelize.INTEGER,
    },
    periodId: {
      type: Sequelize.INTEGER,
    },
    userId: {
      type: Sequelize.INTEGER,
    },
  },
  {
    tableName: "racuni",
  }
);

module.exports = Racun;
