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
      //  Insert Users
      const hashedUsers = await Promise.all(
        mockData.users.map(async (user) => ({
          username: user.username,
          email: user.email,
          password: await bcrypt.hash(user.password, 10),
          role: user.role,
          createdAt: new Date(),
          updatedAt: new Date()
        }))
      );
      await queryInterface.bulkInsert('Users', hashedUsers);

      // Insert Orders (Users must exist first)
      await queryInterface.bulkInsert('Orders', mockData.orders.map(order => ({
        userId: order.userId, 
        date: new Date(order.date),
        status: order.status,
        totalPrice: order.totalPrice,
        createdAt: new Date(),
        updatedAt: new Date()
      })));

      // Insert Payments (Orders must exist first)
      await queryInterface.bulkInsert('Payments', mockData.payments.map(payment => ({
        orderId: payment.orderId,
        method: payment.method,
        status: payment.status,
        paymentDate: new Date(payment.paymentDate),
        createdAt: new Date(),
        updatedAt: new Date()
      })));

      // Insert Dishes
      await queryInterface.bulkInsert('Dishes', mockData.dishes.map(dish => ({
        name: dish.name,
        description: dish.description,
        price: dish.price,
        image: dish.image,
        createdAt: new Date(),
        updatedAt: new Date()
      })));

      // Insert DailyMenus
      await queryInterface.bulkInsert('DailyMenus', mockData.dailyMenus.map(menu => ({
        date: new Date(menu.date).toISOString().slice(0, 10),
        createdAt: new Date(),
        updatedAt: new Date()
      })));

      // Insert DailyMenuDishes (after DailyMenus and Dishes)
      const dishesFromDB = await queryInterface.sequelize.query('SELECT id, name FROM `Dishes`;');
      const menusFromDB = await queryInterface.sequelize.query('SELECT id, date FROM `DailyMenus`;');

      const dishMap = {};
      dishesFromDB[0].forEach(dish => {
        dishMap[dish.name] = dish.id;
      });

      const menuMap = {};
      menusFromDB[0].forEach(menu => {
        const formattedDate = menu.date.toISOString().slice(0, 10);
        menuMap[formattedDate] = menu.id;
      });

      const dailyMenuDishRelations = [];
      mockData.dailyMenus.forEach(menu => {
        menu.dishes.forEach(dishIndex => {
          const dishName = mockData.dishes[dishIndex - 1].name;
          if (dishMap[dishName] && menuMap[menu.date]) {
            dailyMenuDishRelations.push({
              dailyMenuId: menuMap[menu.date],
              dishId: dishMap[dishName],
              createdAt: new Date(),
              updatedAt: new Date()
            });
          }
        });
      });

      await queryInterface.bulkInsert('DailyMenuDishes', dailyMenuDishRelations);

      // Insert Contact Messages
      await queryInterface.bulkInsert('ContactMessages', mockData.contactMessages.map(msg => ({
        name: msg.name,
        email: msg.email,
        subject: msg.subject,
        message: msg.message,
        status: msg.status,
        createdAt: new Date(),
        updatedAt: new Date()
      })));

      // Insert OrderItems
      await queryInterface.bulkInsert('OrderItems', mockData.orders.map(order => ({
        orderId: order.id,
        dishId: Math.floor(Math.random() * mockData.dishes.length) + 1,                // Assign a random dish
        quantity: Math.floor(Math.random() * 5) + 1,
        price: (Math.random() * 500).toFixed(2),
        createdAt: new Date(),
        updatedAt: new Date()
      })));

      // Insert Feedbacks (Users and Dishes must exist first)
      await queryInterface.bulkInsert('Feedbacks', mockData.feedbacks.map(feedback => ({
        userId: feedback.userId,
        dishId: feedback.dishId,
        rating: feedback.rating,
        comment: feedback.comment,
        createdAt: new Date(),
        updatedAt: new Date()
      })));

    } catch (error) {
      console.error("Error during seeding: ", error);
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Feedbacks', null, {});
    await queryInterface.bulkDelete('OrderItems', null, {});
    await queryInterface.bulkDelete('DailyMenuDishes', null, {});
    await queryInterface.bulkDelete('DailyMenus', null, {});
    await queryInterface.bulkDelete('Dishes', null, {});
    await queryInterface.bulkDelete('ContactMessages', null, {});
    await queryInterface.bulkDelete('Payments', null, {});
    await queryInterface.bulkDelete('Orders', null, {});
    await queryInterface.bulkDelete('Users', null, {});
  }
};