'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addConstraint('Users', {
      fields: ['email'],
      type: 'unique',
      name: 'unique_user_email' 
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeConstraint('Users', 'unique_user_email');
  }
};
