/*===============================================================================================*/
/*---- CLI (Command Line Interface) tool for initializing the basic structure of the project ----*/ 
/*------------- create config.json, remade config.json to config.js to be able to ---------------*/
/*------------------------------ retrieve DATABASE_URL from .env --------------------------------*/
/*===============================================================================================*/

require('dotenv').config();                                    // Load .env variables
const { sequelize } = require('./database');                   // Import sequelize from database.js

module.exports = {
  development: {
    use_env_variable: 'DATABASE_URL',
    dialect: 'mysql'
  },
  test: {
    use_env_variable: 'DATABASE_URL',
    dialect: 'mysql'
  },
  production: {
    use_env_variable: 'DATABASE_URL',
    dialect: 'mysql'
  }
};