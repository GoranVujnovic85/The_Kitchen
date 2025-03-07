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

'use strict';

const { Sequelize, DataTypes } = require('sequelize');
const DishModel = require('../../models/dish'); 

describe('Dish Model', () => {
  let sequelize;
  let Dish;

  beforeAll(() => {
    try {
      sequelize = new Sequelize('sqlite::memory:', {
        logging: false,
      });
    } catch (error) {
      throw error;
    }
    Dish = DishModel(sequelize, DataTypes);

    Dish.belongsToMany = jest.fn();
    Dish.hasMany = jest.fn();
  });

  beforeEach(async () => {
    console.log('Starting beforeEach: Syncing database');
    try {
      await sequelize.sync({ force: true });
      console.log('Database synced successfully');
    } catch (error) {
      console.error('Error syncing database:', error.message);
      throw error;
    }
  });

  afterAll(async () => {
    if (sequelize) {
      await sequelize.close();
    } else {
      console.warn('No sequelize instance to close');
    }
  });

  describe('Model Definition', () => {
    test('should have correct attributes', () => {
      const attributes = Dish.rawAttributes;

      expect(attributes).toHaveProperty('name');
      expect(attributes.name.type.key).toBe('STRING');

      expect(attributes).toHaveProperty('description');
      expect(attributes.description.type.key).toBe('STRING');

      expect(attributes).toHaveProperty('price');
      expect(attributes.price.type.key).toBe('FLOAT');

      expect(attributes).toHaveProperty('image');
      expect(attributes.image.type.key).toBe('STRING');

      expect(attributes).toHaveProperty('id');
      expect(attributes.id.primaryKey).toBe(true);
    });

    test('should create a dish instance', async () => {
      const dishData = {
        name: 'Beans in suc',
        description: 'Beans in a clay pot',
        price: 499.99,
        image: 'Beans in suc.png'
      };
      console.log('Dish is ready:', dishData);

      const dish = await Dish.create(dishData);

      expect(dish).toBeDefined();
      expect(dish.id).toBeDefined();
      expect(dish.name).toBe('Beans in suc');
      expect(dish.description).toBe('Beans in a clay pot');
      expect(dish.price).toBe(499.99);
      expect(dish.image).toBe('Beans in suc.png');
    });
  });

  describe('Associations', () => {
    test('should define association with DailyMenu model through DailyMenuDishes', () => {
      const mockModels = {
        DailyMenu: 'mockDailyMenuModel',
        OrderItem: 'mockOrderItemModel',
        Feedback: 'mockFeedbackModel'
      };

      Dish.associate(mockModels);

      expect(Dish.belongsToMany).toHaveBeenCalledWith('mockDailyMenuModel', {
        through: 'DailyMenuDishes',
        foreignKey: 'dishId',
        as: 'dailyMenus'
      });
    });

    test('should define association with OrderItem model', () => {
      const mockModels = {
        DailyMenu: 'mockDailyMenuModel',
        OrderItem: 'mockOrderItemModel',
        Feedback: 'mockFeedbackModel'
      };

      Dish.associate(mockModels);

      expect(Dish.hasMany).toHaveBeenCalledWith('mockOrderItemModel', {
        foreignKey: 'dishId',
        onDelete: 'CASCADE'
      });
    });

    test('should define association with Feedback model', () => {
      const mockModels = {
        DailyMenu: 'mockDailyMenuModel',
        OrderItem: 'mockOrderItemModel',
        Feedback: 'mockFeedbackModel'
      };

      Dish.associate(mockModels);

      expect(Dish.hasMany).toHaveBeenCalledWith('mockFeedbackModel', {
        foreignKey: 'dishId',
        onDelete: 'SET NULL'
      });
    });
  });
});