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
const DailyMenuModel = require('../../models/dailyMenu'); 

describe('DailyMenu Model', () => {
  let sequelize;
  let DailyMenu;

  beforeAll(() => {
    try {
      sequelize = new Sequelize('sqlite::memory:', {
        logging: false,
      });
    } catch (error) {
      throw error;
    }
    DailyMenu = DailyMenuModel(sequelize, DataTypes);

    DailyMenu.belongsToMany = jest.fn();
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
      const attributes = DailyMenu.rawAttributes;

      expect(attributes).toHaveProperty('date');
      expect(attributes.date.type.key).toBe('DATE');

      expect(attributes).toHaveProperty('id');
      expect(attributes.id.primaryKey).toBe(true);
    });

    test('should create a daily menu instance', async () => {
      const dailyMenuData = {
        date: new Date('2025-03-08T00:00:00Z')
      };
      console.log('DailyMenu data prepared:', dailyMenuData);

      const dailyMenu = await DailyMenu.create(dailyMenuData);

      expect(dailyMenu).toBeDefined();
      expect(dailyMenu.id).toBeDefined();
      expect(dailyMenu.date).toEqual(new Date('2025-03-08T00:00:00Z'));
    });
  });

  describe('Associations', () => {
    test('should define association with Dish model through DailyMenuDishes', () => {
      const mockModels = {
        Dish: 'mockDishModel'
      };

      DailyMenu.associate(mockModels);

      expect(DailyMenu.belongsToMany).toHaveBeenCalledWith('mockDishModel', {
        through: 'DailyMenuDishes',
        foreignKey: 'dailyMenuId',
        as: 'dishes'
      });
    });
  });
});