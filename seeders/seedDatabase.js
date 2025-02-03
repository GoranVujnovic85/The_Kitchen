/*=============================================================================================================*/
/*----------------------------- Script to seed database using mockData.json -----------------------------------*/
/*=============================================================================================================*/

'use strict';
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
const mockData = JSON.parse(fs.readFileSync(path.join(__dirname, 'mockData.json'), 'utf-8'));

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {

      // Insert users
      const hashedUsers = await Promise.all(
        mockData.users.map(async (user) => ({
          username: user.username,
          email: user.email,
          password: await bcrypt.hash(user.password, 10), // Hash lozinke
          role: user.role,
          createdAt: new Date(),
          updatedAt: new Date()
        }))
      );

      await queryInterface.bulkInsert('Users', hashedUsers);
      console.log("Inserted Users:", hashedUsers); 

      // Insert dishes data
      const insertedDishes = await queryInterface.bulkInsert(
        'Dishes',
        mockData.dishes.map(dish => ({
          name: dish.name,
          description: dish.description,
          price: dish.price,
          image: dish.image,
          createdAt: new Date(),
          updatedAt: new Date()
        })),
        { returning: true }
      );

      console.log("Inserted Dishes:", insertedDishes);                                           // Check input

      // If bulkInsert doesn't return an array, pull the data manually
      const dishesFromDB = await queryInterface.sequelize.query('SELECT id, name FROM `Dishes`;');
      const dishMap = {};
      dishesFromDB[0].forEach(dish => {
        dishMap[dish.name] = dish.id;
      });

      console.log("Dish Map:", dishMap);                                                   // Check the mapping

      // Insert daily menus data
      const insertedMenus = await queryInterface.bulkInsert(
        'DailyMenus',
        mockData.dailyMenus.map(menu => ({
          date: new Date(menu.date).toISOString().slice(0, 10),                          // Correct date format
          createdAt: new Date(),
          updatedAt: new Date()
        })),
        { returning: true }
      );

      console.log("Inserted Menus:", insertedMenus);                                             // Check input

     // If bulkInsert doesn't return an array, pull the data
      const menusFromDB = await queryInterface.sequelize.query('SELECT id, date FROM `DailyMenus`;');
      const menuMap = {};
      menusFromDB[0].forEach(menu => {
      const formattedDate = menu.date.toISOString().slice(0, 10);                      // Ensure the same format
      menuMap[formattedDate] = menu.id;
      });

      console.log("Menu Map:", menuMap);                                                   // Check the mapping

      // Insert DailyMenu-Dish relations
      const dailyMenuDishRelations = [];
      mockData.dailyMenus.forEach(menu => {
        menu.dishes.forEach(dishIndex => {
          const dishName = mockData.dishes[dishIndex - 1].name;   // Get the name of the dish based on the index
          if (dishMap[dishName]) {
            console.log(`Looking for menuId with date: ${menu.date}, found: ${menuMap[menu.date]}`);
            dailyMenuDishRelations.push({
              dailyMenuId: menuMap[menu.date],
              dishId: dishMap[dishName],
              createdAt: new Date(),
              updatedAt: new Date()
            });
          }
        });
      });

      console.log("DailyMenuDishes Relations:", dailyMenuDishRelations);                  // Relationship check

      await queryInterface.bulkInsert('DailyMenuDishes', dailyMenuDishRelations);

      // Insert contact messages
      await queryInterface.bulkInsert('ContactMessages', mockData.contactMessages.map(msg => ({
        name: msg.name,
        email: msg.email,
        subject: msg.subject,
        message: msg.message,
        status: msg.status,
        createdAt: new Date(),
        updatedAt: new Date()
      })));

    } catch (error) {
      console.error("Error during seeding: ", error);
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {});
    await queryInterface.bulkDelete('DailyMenuDishes', null, {});
    await queryInterface.bulkDelete('DailyMenus', null, {});
    await queryInterface.bulkDelete('Dishes', null, {});
    await queryInterface.bulkDelete('ContactMessages', null, {});
  }
};