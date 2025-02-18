/**
 * The_Kitchen - Node.js backend for food ordering system
 *
 * @license MIT
 * @author Goran Vujnović
 * @year 2025
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED.
 */
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
  }, { sequelize });
  
  return Feedback;
};