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
const OrderModel = require('../../models/order'); 

describe('Order Model', () => {
  let sequelize;
  let Order;

  beforeAll(() => {
    try {
      sequelize = new Sequelize('sqlite::memory:', {
        logging: false,
      });
    } catch (error) {
      throw error;
    }
    Order = OrderModel(sequelize, DataTypes);

    Order.belongsTo = jest.fn();
    Order.hasMany = jest.fn();
    Order.hasOne = jest.fn();
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
      const attributes = Order.rawAttributes;

      expect(attributes).toHaveProperty('userId');
      expect(attributes.userId.type.key).toBe('INTEGER');

      expect(attributes).toHaveProperty('date');
      expect(attributes.date.type.key).toBe('DATE');

      expect(attributes).toHaveProperty('status');
      expect(attributes.status.type.key).toBe('STRING');

      expect(attributes).toHaveProperty('totalPrice');
      expect(attributes.totalPrice.type.key).toBe('FLOAT');

      expect(attributes).toHaveProperty('id');
      expect(attributes.id.primaryKey).toBe(true);
    });

    test('should create an order instance', async () => {
      const orderData = {
        userId: 1,
        date: new Date('2025-03-07T12:00:00Z'),
        status: 'pending',
        totalPrice: 4500.50
      };
      console.log('Order data prepared:', orderData);

      const order = await Order.create(orderData);

      expect(order).toBeDefined();
      expect(order.id).toBeDefined();
      expect(order.userId).toBe(1);
      expect(order.date).toEqual(new Date('2025-03-07T12:00:00Z'));
      expect(order.status).toBe('pending');
      expect(order.totalPrice).toBe(4500.50);
    });
  });

  describe('Associations', () => {
    test('should define association with User model', () => {
      const mockModels = {
        User: 'mockUserModel',
        OrderItem: 'mockOrderItemModel',
        Payment: 'mockPaymentModel'
      };

      Order.associate(mockModels);

      expect(Order.belongsTo).toHaveBeenCalledWith('mockUserModel', {
        foreignKey: 'userId'
      });
    });

    test('should define association with OrderItem model', () => {
      const mockModels = {
        User: 'mockUserModel',
        OrderItem: 'mockOrderItemModel',
        Payment: 'mockPaymentModel'
      };

      Order.associate(mockModels);

      expect(Order.hasMany).toHaveBeenCalledWith('mockOrderItemModel', {
        foreignKey: 'orderId',
        onDelete: 'CASCADE'
      });
    });

    test('should define association with Payment model', () => {
      const mockModels = {
        User: 'mockUserModel',
        OrderItem: 'mockOrderItemModel',
        Payment: 'mockPaymentModel'
      };

      Order.associate(mockModels);

      expect(Order.hasOne).toHaveBeenCalledWith('mockPaymentModel', {
        foreignKey: 'orderId',
        onDelete: 'CASCADE'
      });
    });
  });
});