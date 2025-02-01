/*=====================================================================*/
/*---------------- Migration for dailyMenuDishes table ----------------*/
/*----The DailyMenuDishes table serves as a pivot (junction) table ----*/
/*----------- to establish a many-to-many relationship between --------*/
/*----------------------- DailyMenus and Dishes. ----------------------*/
/*=====================================================================*/

'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('DailyMenuDishes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      dailyMenuId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'DailyMenus',       // Pay attention to the table name!
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      dishId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Dishes',           // Pay attention to the table name!
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('DailyMenuDishes');
  }
};