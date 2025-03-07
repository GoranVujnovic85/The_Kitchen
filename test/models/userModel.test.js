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
const UserModel = require('../../models/user'); 

describe('User Model', () => {
  let sequelize;
  let User;

  beforeAll(() => {
    //console.log('Starting beforeAll: Initializing Sequelize');
    try {
        // Used for fast, efficient, and isolated in-memory testing.
        sequelize = new Sequelize('sqlite::memory:', {
            // Disables SQL logs for cleaner output and better test readability.
            logging: false,
        });
      //console.log('Sequelize instance created successfully');
    } catch (error) {
      console.error('Error creating Sequelize instance:', error.message);
      throw error;
    }
    //console.log('Calling UserModel with sequelize and DataTypes');
    User = UserModel(sequelize, DataTypes);
    //console.log('User model initialized:', User !== undefined);

    // Mock hasMany for testing associations
    User.hasMany = jest.fn();
  });

  beforeEach(async () => {
    //console.log('Starting beforeEach: Syncing database');
    try {
      await sequelize.sync({ force: true });
      //console.log('Database synced successfully');
    } catch (error) {
      console.error('Error syncing database:', error.message);
      throw error;
    }
  });

  afterAll(async () => {
    console.log('Starting afterAll: Closing Sequelize connection');
    if (sequelize) {
      await sequelize.close();
      console.log('Sequelize connection closed successfully');
    } else {
      console.warn('No sequelize instance to close');
    }
  });

  describe('Model Definition', () => {
    test('should have correct attributes', () => {
      //console.log('Starting test: Checking attributes');
      const attributes = User.rawAttributes;
      //console.log('Attributes retrieved:', attributes);

      expect(attributes).toHaveProperty('username');
      //console.log('Username attribute exists');
      expect(attributes.username.type.key).toBe('STRING'); 
      //console.log('Username type is STRING');

      expect(attributes).toHaveProperty('email');
      //console.log('Email attribute exists');
      expect(attributes.email.type.key).toBe('STRING'); 
      //console.log('Email type is STRING');

      expect(attributes).toHaveProperty('password');
      //console.log('Password attribute exists');
      expect(attributes.password.type.key).toBe('STRING'); 
      //console.log('Password type is STRING');

      expect(attributes).toHaveProperty('role');
      //console.log('Role attribute exists');
      expect(attributes.role.type.key).toBe('STRING'); 
      //console.log('Role type is STRING');

      expect(attributes).toHaveProperty('id');
      //console.log('ID attribute exists');
      expect(attributes.id.primaryKey).toBe(true);
      //console.log('ID is primary key');
    });

    test('should create a user instance', async () => {
      //console.log('Starting test: Creating user instance');
      const userData = {
        username: "admin",
        email: "admin@gmail.com",
        password: "admin123",
        role: "admin"
      };
      //console.log('User data prepared:', userData);

      const user = await User.create(userData);
      //console.log('User created:', user.toJSON());

      expect(user).toBeDefined();
      expect(user.id).toBeDefined();
      //console.log('User ID generated:', user.id);
      expect(user.username).toBe('admin');
      expect(user.email).toBe('admin@gmail.com');
      expect(user.password).toBe('admin123');
      expect(user.role).toBe('admin');
      //console.log('All user attributes verified');
    });
  });

  describe('Associations', () => {
    test('should define association with Order model', () => {
      //console.log('Starting test: Checking Order association');
      const mockModels = {
        Order: 'mockOrderModel', 
        Feedback: 'mockFeedbackModel',
      };
      //console.log('Mock models prepared:', mockModels);

      User.associate(mockModels);
      //console.log('Associate method called');

      expect(User.hasMany).toHaveBeenCalledWith('mockOrderModel', {
        foreignKey: 'userId',
        onDelete: 'CASCADE'
      });
      console.log('Order association verified');
    });

    test('should define association with Feedback model', () => {
      //console.log('Starting test: Checking Feedback association');
      const mockModels = {
        Order: 'mockOrderModel',
        Feedback: 'mockFeedbackModel',
      };
      //console.log('Mock models prepared:', mockModels);

      User.associate(mockModels);
      //console.log('Associate method called');

      expect(User.hasMany).toHaveBeenCalledWith('mockFeedbackModel', {
        foreignKey: 'userId',
        onDelete: 'SET NULL'
      });
      //console.log('Feedback association verified');
    });
  });
});