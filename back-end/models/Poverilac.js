const Sequelize = require("sequelize");
const sequelize = require("../util/database");

const Poverilac = sequelize.define(
  "poverilac",
  {
    poverilacId: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    poverilacNaziv: {
      type: Sequelize.STRING(100),
      allowNull: false,
    },
    poverilacKrace: {
      type: Sequelize.STRING(50),
      allowNull: false,
    },
    modelPlacanja: {
      type: Sequelize.STRING(2),
      allowNull: true,
    },
    tekRacun: {
      type: Sequelize.STRING(20),
      allowNull: true,
    },
    userId: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "poverioci",
  }
);

module.exports = Poverilac;
