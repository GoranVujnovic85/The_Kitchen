'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addConstraint('Dishes', {
      fields: ['name'],
      type: 'unique',
      name:'unique_dish_name'  // Constraint name 
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeConstraint('Dishes', 'unique_dish_name');
  }
};
