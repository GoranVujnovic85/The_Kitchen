/*==============================================================================================================================================*/
/*---------------------- The index.js file in the models folder is a key part for integrating all models into Sequelize ORM.  ------------------*/ 
/*------------------------------ This file is used to dynamically load all models from the folder and link them --------------------------------*/
/*----------------------------------------------- instance, enabling the use of those models. --------------------------------------------------*/
/*==============================================================================================================================================*/

'use strict';

const fs = require('fs');
const path = require('path');
const { sequelize } = require('../config/database');                                 // Instead of config.json, we take sequelize from database.js
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const db = {};                                                                       // Creating an empty object for models                                                            

// Load models from files in this folder
fs.readdirSync(__dirname)                                                            // Loads all files in the current directory (folder models)

   // Filtrira fajlove
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

// Set associations between models if they exist
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;                                                             // Export the sequelize instance
db.Sequelize = Sequelize;                                                             // Export the Sequelize library

module.exports = db;