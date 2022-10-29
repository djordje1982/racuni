const Sequelize = require("sequelize");
const sequelize = require("../util/database");

const Period = sequelize.define(
  "period",
  {
    periodId: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    periodMesec: {
      type: Sequelize.STRING(15),
      allowNull: false,
    },
    periodGodina: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    periodDatum: {
      type: Sequelize.DATEONLY,
      allowNull: true,
    },
  },
  {
    tableName: "periodi",
  }
);

module.exports = Period;
