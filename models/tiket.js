"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Tiket extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Tiket.belongsTo(models.Event, { foreignKey: "EventId" });
      Tiket.belongsTo(models.User, { foreignKey: "UserId" });
    }
  }
  Tiket.init(
    {
      UserId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: {
            msg: "UserId is required",
          },
        },
      },
      EventId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: {
            msg: "UserId is required",
          },
        },
      },
      status: {
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      modelName: "Tiket",
    }
  );
  return Tiket;
};
