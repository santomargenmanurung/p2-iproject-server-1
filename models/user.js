"use strict";
const { Model } = require("sequelize");
const { hashingPassword } = require("../helpers/bcrypt");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.hasOne(models.Tiket, { foreignKey: "UserId" });
    }
  }
  User.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "name is required",
          },
          notEmpty: {
            msg: "name is required",
          },
        },
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "username is required",
          },
          notEmpty: {
            msg: "username is required",
          },
        },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "email is required",
          },
          notEmpty: {
            msg: "email is required",
          },
        },
      },
      no_Identity: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "no_Identity is required",
          },
          notEmpty: {
            msg: "no_Identity is required",
          },
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "password is required",
          },
          notEmpty: {
            msg: "password is required",
          },
        },
      },
    },
    {
      hooks: {
        beforeCreate: (user) => {
          user.password = hashingPassword(user.password);
        },
      },
      sequelize,
      modelName: "User",
    }
  );
  return User;
};
