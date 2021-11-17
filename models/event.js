"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Event extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Event.hasMany(models.Tiket, { foreignKey: "EventId" });
    }
  }
  Event.init(
    {
      title: DataTypes.STRING,
      date: DataTypes.STRING,
      posterUrl: DataTypes.STRING,
      capacity: DataTypes.INTEGER,
      held_In: DataTypes.STRING,
      description: DataTypes.TEXT,
      status: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Event",
    }
  );
  return Event;
};
