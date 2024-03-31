const { DataTypes } = require("sequelize");
const { sequelize, Sequelize } = require("../../db");

const User = sequelize.define(
    "User",
    {
      id_pelanggan: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      username : {type: DataTypes.STRING},
      alamat : { type: DataTypes.STRING },
      no_hp : { type: DataTypes.STRING },
      masalah_kulit : { type: DataTypes.STRING },
      password : { type: DataTypes.STRING },
    },
    {
      tableName: "info_pelanggan",
      timestamps: false,
    }
  );

module.exports = User;