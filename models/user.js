const { Sequelize, Model } = require("sequelize");
const sequelize = require("../config/db_connection");

class User extends Model {}

User.init(
  {
    firstName: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    lastName: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    gender: {
      type: Sequelize.ENUM("male", "female", "other"),
      allowNull: false,
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      primaryKey: true,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    phoneNumber: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    otp: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    otpExpiry: {
      type: Sequelize.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "user",
  }
);

module.exports = User;
