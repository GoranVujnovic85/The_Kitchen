/*=====================================================================*/
/*--------------------- Order model definition ------------------------*/
/*=====================================================================*/

'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Order.belongsTo(models.User, { foreignKey: 'userId' });
      Order.hasMany(models.OrderItem, { foreignKey: 'orderId', onDelete: 'CASCADE' });
      Order.hasOne(models.Payment, { foreignKey: 'orderId', onDelete: 'CASCADE' });
    }
  }
  Order.init({
    userId: DataTypes.INTEGER,
    date: DataTypes.DATE,
    status: DataTypes.STRING,
    totalPrice: DataTypes.FLOAT
  }, {
    sequelize,
    modelName: 'Order',
  });
  return Order;
};