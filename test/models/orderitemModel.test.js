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
const OrderItemModel = require('../../models/orderItem'); 

describe('OrderItem Model', () => {
  let sequelize;
  let OrderItem;

  beforeAll(() => {
    try {
      sequelize = new Sequelize('sqlite::memory:', {
        logging: false,
      });
    } catch (error) {
      throw error;
    }
    OrderItem = OrderItemModel(sequelize, DataTypes);

    
    OrderItem.belongsTo = jest.fn();
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
      const attributes = OrderItem.rawAttributes;

      expect(attributes).toHaveProperty('orderId');
      expect(attributes.orderId.type.key).toBe('INTEGER');

      expect(attributes).toHaveProperty('dishId');
      expect(attributes.dishId.type.key).toBe('INTEGER');

      expect(attributes).toHaveProperty('quantity');
      expect(attributes.quantity.type.key).toBe('INTEGER');

      expect(attributes).toHaveProperty('price');
      expect(attributes.price.type.key).toBe('FLOAT');

      expect(attributes).toHaveProperty('id');
      expect(attributes.id.primaryKey).toBe(true);
    });

    test('should create an order item instance', async () => {
      const orderItemData = {
        orderId: 1,
        dishId: 2,
        quantity: 5,
        price: 4805.67
      };
      console.log('OrderItem data prepared:', orderItemData);

      const orderItem = await OrderItem.create(orderItemData);

      expect(orderItem).toBeDefined();
      expect(orderItem.id).toBeDefined();
      expect(orderItem.orderId).toBe(1);
      expect(orderItem.dishId).toBe(2);
      expect(orderItem.quantity).toBe(5);
      expect(orderItem.price).toBe(4805.67);
    });
  });

  describe('Associations', () => {
    test('should define association with Order model', () => {
      const mockModels = {
        Order: 'mockOrderModel',
        Dish: 'mockDishModel'
      };

      OrderItem.associate(mockModels);

      expect(OrderItem.belongsTo).toHaveBeenCalledWith('mockOrderModel', {
        foreignKey: 'orderId'
      });
    });

    test('should define association with Dish model', () => {
      const mockModels = {
        Order: 'mockOrderModel',
        Dish: 'mockDishModel'
      };

      OrderItem.associate(mockModels);

      expect(OrderItem.belongsTo).toHaveBeenCalledWith('mockDishModel', {
        foreignKey: 'dishId'
      });
    });
  });
});