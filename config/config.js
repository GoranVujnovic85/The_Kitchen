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
  }
};