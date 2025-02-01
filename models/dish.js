/*=====================================================================*/
/*---------------------- Dish model definition ------------------------*/
/*=====================================================================*/

'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Dish extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Dish.belongsToMany(models.DailyMenu, { through: 'DailyMenuDishes', foreignKey: 'dishId' });
      Dish.hasMany(models.OrderItem, { foreignKey: 'dishId', onDelete: 'CASCADE' });
      Dish.hasMany(models.Feedback, { foreignKey: 'dishId', onDelete: 'SET NULL' });
    }
  }
  Dish.init({
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    price: DataTypes.FLOAT,
    image: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Dish',
  });
  return Dish;
};