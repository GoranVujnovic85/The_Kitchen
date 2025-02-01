/*=====================================================================*/
/*------------------- Feedback model definition -----------------------*/
/*=====================================================================*/

'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Feedback extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Feedback.belongsTo(models.User, { foreignKey: 'userId', allowNull: true });
      Feedback.belongsTo(models.Dish, { foreignKey: 'dishId', allowNull: true });
    }
  }
  Feedback.init({
    userId: DataTypes.INTEGER,
    dishId: DataTypes.INTEGER,
    rating: DataTypes.INTEGER,
    comment: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Feedback',
  });
  return Feedback;
};