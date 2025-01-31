/*===================================================================================================================*/
/*---------------------------------------- Sequelize database configuration -----------------------------------------*/
/*===================================================================================================================*/

const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'mysql',
  logging: false,                                                 // Turn off the display of SQL queries in the console
});

// Function to test the connection
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('Successfully connected to the database!');
  } catch (error) {
    console.error(' Connection failed:', error);
  }
};

// Export the Sequelize instance and the testConnection function
module.exports = { sequelize, testConnection };