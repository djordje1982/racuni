const Sequelize = require("sequelize");
const sequelize = require("../util/database");

const Placanje = sequelize.define(
  "placanje",
  {
    placanjeId: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    racunId: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    iznosPlacanja: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
    },
    datumPlacanja: {
      type: Sequelize.DATEONLY,
      allowNull: true,
    },
  },
  {
    tableName: "placanja",
  }
);

module.exports = Placanje;
