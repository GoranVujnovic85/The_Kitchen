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
const PaymentModel = require('../../models/payment'); 

describe('Payment Model', () => {
  let sequelize;
  let Payment;

  beforeAll(() => {
    try {
      sequelize = new Sequelize('sqlite::memory:', {
        logging: false, 
      });
    } catch (error) {
        throw error;
    }
    //console.log('Calling PaymentModel with sequelize and DataTypes');
    Payment = PaymentModel(sequelize, DataTypes);
    //console.log('Payment model initialized:', Payment !== undefined);

    // Mock belongsTo for testing associations
    Payment.belongsTo = jest.fn();
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
      const attributes = Payment.rawAttributes;

      expect(attributes).toHaveProperty('orderId');
      expect(attributes.orderId.type.key).toBe('INTEGER');
      
      expect(attributes).toHaveProperty('method');
      expect(attributes.method.type.key).toBe('STRING');
      
      expect(attributes).toHaveProperty('status');
      expect(attributes.status.type.key).toBe('STRING');
    
      expect(attributes).toHaveProperty('paymentDate');
      expect(attributes.paymentDate.type.key).toBe('DATE');
      
      expect(attributes).toHaveProperty('id');
      expect(attributes.id.primaryKey).toBe(true);
    });

    test('should create a payment instance', async () => {
      const paymentData = {
        orderId: 1,
        method: 'Credit Card',
        status: 'completed',
        paymentDate: new Date('2025-03-05T10:00:00Z')
      };
      console.log('Payment data prepared:', paymentData);

      const payment = await Payment.create(paymentData);

      expect(payment).toBeDefined();
      expect(payment.id).toBeDefined();
      expect(payment.orderId).toBe(1);
      expect(payment.method).toBe('Credit Card');
      expect(payment.status).toBe('completed');
      expect(payment.paymentDate).toEqual(new Date('2025-03-05T10:00:00Z'));
    });
  });

  describe('Associations', () => {
    test('should define association with Order model', () => {
      const mockModels = {
        Order: 'mockOrderModel',
      };
    
      Payment.associate(mockModels);

      expect(Payment.belongsTo).toHaveBeenCalledWith('mockOrderModel', {
        foreignKey: 'orderId'
      });
      //console.log('Order association verified');
    });
  });
});