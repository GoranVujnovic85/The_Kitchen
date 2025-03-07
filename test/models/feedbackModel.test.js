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
const FeedbackModel = require('../../models/feedback'); 

describe('Feedback Model', () => {
  let sequelize;
  let Feedback;

  beforeAll(() => {
    try {
      sequelize = new Sequelize('sqlite::memory:', {
        logging: false,
      });
    } catch (error) {
      throw error;
    }
    Feedback = FeedbackModel(sequelize, DataTypes);

    Feedback.belongsTo = jest.fn();
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
      const attributes = Feedback.rawAttributes;

      expect(attributes).toHaveProperty('userId');
      expect(attributes.userId.type.key).toBe('INTEGER');

      expect(attributes).toHaveProperty('dishId');
      expect(attributes.dishId.type.key).toBe('INTEGER');

      expect(attributes).toHaveProperty('rating');
      expect(attributes.rating.type.key).toBe('INTEGER');

      expect(attributes).toHaveProperty('comment');
      expect(attributes.comment.type.key).toBe('TEXT');

      expect(attributes).toHaveProperty('id');
      expect(attributes.id.primaryKey).toBe(true);
    });

    test('should create a feedback instance', async () => {
      const feedbackData = {
        userId: 1,
        dishId: 2,
        rating: 4,
        comment: 'Everiything is cool!'
      };
      console.log('Feedback data prepared:', feedbackData);

      const feedback = await Feedback.create(feedbackData);

      expect(feedback).toBeDefined();
      expect(feedback.id).toBeDefined();
      expect(feedback.userId).toBe(1);
      expect(feedback.dishId).toBe(2);
      expect(feedback.rating).toBe(4);
      expect(feedback.comment).toBe('Everiything is cool!');
    });

    test('should allow null userId and dishId', async () => {
      const feedbackData = {
        rating: 3,
        comment: 'Pay attention here.'
      };
      console.log('Feedback data with null foreign keys prepared:', feedbackData);

      const feedback = await Feedback.create(feedbackData);

      expect(feedback).toBeDefined();
      expect(feedback.id).toBeDefined();
      //expect(feedback.userId).toBeNull();  // if you were to change in the model allowNull: true, then we could leave this
      //expect(feedback.dishId).toBeNull();  // if you were to change in the model allowNull: true, then we could leave this
       expect(feedback.userId).toBeUndefined();
      expect(feedback.dishId).toBeUndefined();
      expect(feedback.rating).toBe(3);
      expect(feedback.comment).toBe('Pay attention here.');
    });
  });

  describe('Associations', () => {
    test('should define association with User model', () => {
      const mockModels = {
        User: 'mockUserModel',
        Dish: 'mockDishModel'
      };

      Feedback.associate(mockModels);

      expect(Feedback.belongsTo).toHaveBeenCalledWith('mockUserModel', {
        foreignKey: 'userId',
        allowNull: true
      });
    });

    test('should define association with Dish model', () => {
      const mockModels = {
        User: 'mockUserModel',
        Dish: 'mockDishModel'
      };

      Feedback.associate(mockModels);

      expect(Feedback.belongsTo).toHaveBeenCalledWith('mockDishModel', {
        foreignKey: 'dishId',
        allowNull: true
      });
    });
  });
});