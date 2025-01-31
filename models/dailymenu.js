'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class DailyMenu extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  DailyMenu.init({
    date: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'DailyMenu',
  });
  return DailyMenu;
};