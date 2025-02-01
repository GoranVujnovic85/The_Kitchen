/*=============================================================================================================*/
/*----------------------------- Script to seed database using mockData.json -----------------------------------*/
/*=============================================================================================================*/

'use strict';
const fs = require('fs');
const path = require('path');
const mockData = JSON.parse(fs.readFileSync(path.join(__dirname, 'mockData.json'), 'utf-8'));

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Insert dishes data from mockData.json
    await queryInterface.bulkInsert('Dishes', mockData.dishes.map(dish => ({
      name: dish.name,
      description: dish.description,
      price: dish.price,
      image: dish.image,
      createdAt: new Date(),
      updatedAt: new Date()
    })));
  },

  down: async (queryInterface, Sequelize) => {
    // Delete the dishes data (for rollback)
    await queryInterface.bulkDelete('Dishes', null, {});
  }
};