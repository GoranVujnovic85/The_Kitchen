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