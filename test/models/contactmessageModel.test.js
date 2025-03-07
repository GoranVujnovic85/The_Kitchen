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
const ContactMessageModel = require('../../models/contactMessage'); 

describe('ContactMessage Model', () => {
  let sequelize;
  let ContactMessage;

  beforeAll(() => {
    try {
      sequelize = new Sequelize('sqlite::memory:', {
        logging: false,
      });
    } catch (error) {
      throw error;
    }
    ContactMessage = ContactMessageModel(sequelize, DataTypes);
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
      const attributes = ContactMessage.rawAttributes;

      expect(attributes).toHaveProperty('name');
      expect(attributes.name.type.key).toBe('STRING');

      expect(attributes).toHaveProperty('email');
      expect(attributes.email.type.key).toBe('STRING');

      expect(attributes).toHaveProperty('subject');
      expect(attributes.subject.type.key).toBe('STRING');

      expect(attributes).toHaveProperty('message');
      expect(attributes.message.type.key).toBe('TEXT');

      expect(attributes).toHaveProperty('status');
      expect(attributes.status.type.key).toBe('STRING');

      expect(attributes).toHaveProperty('id');
      expect(attributes.id.primaryKey).toBe(true);
    });

    test('should create a contact message instance', async () => {
      const contactMessageData = {
        name: 'Oliver Smith',
        email: 'osmith@nis.rs',
        subject: 'Issue with order',
        message: 'My order arrived late. Can you assist me?',
        status: 'pending'
      };
      console.log('ContactMessage data prepared:', contactMessageData);

      const contactMessage = await ContactMessage.create(contactMessageData);

      expect(contactMessage).toBeDefined();
      expect(contactMessage.id).toBeDefined();
      expect(contactMessage.name).toBe('Oliver Smith');
      expect(contactMessage.email).toBe('osmith@nis.rs');
      expect(contactMessage.subject).toBe('Issue with order');
      expect(contactMessage.message).toBe('My order arrived late. Can you assist me?');
      expect(contactMessage.status).toBe('pending');
    });
  });

  describe('Associations', () => {
    test('should have no associations defined', () => {
      const mockModels = {};
      
      // Call associate to ensure it runs without defining any associations
      ContactMessage.associate(mockModels);

      // Since there are no associations, we can simply check that the method exists and runs
      expect(ContactMessage.associate).toBeDefined();
      expect(typeof ContactMessage.associate).toBe('function');
    });
  });
});