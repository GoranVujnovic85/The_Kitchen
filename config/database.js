/*===================================================================================================================*/
/*---------------------------------------- Sequelize database configuration -----------------------------------------*/
/*===================================================================================================================*/

const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'mysql',
 //logging: false,                                                 // Turn off the display of SQL queries in the console
});

// Export the Sequelize instance 
module.exports = { sequelize };

