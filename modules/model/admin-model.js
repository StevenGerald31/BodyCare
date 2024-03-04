const { DataTypes } = require("sequelize");
const { sequelize, Sequelize } = require("../../db");

const Admin = sequelize.define(
  "Admin",
  {
    id_user: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    email: { type: DataTypes.STRING, unique: true },
    password: { type: DataTypes.STRING },
    username: { type: DataTypes.STRING },
  },
  {
    tableName: "admin",
    timestamps: false,
  }
);

module.exports = Admin;
