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

const request = require('supertest');
const express = require('express');
const { publicRouter, privateRouter } = require('../../routes/contactMessageRoutes'); 
const contactMessageController = require('../../controllers/contactMessageController');
const { authenticateToken, isAdmin } = require('../../middlewares/authMiddleware');

// Mock controller
jest.mock('../../controllers/contactMessageController', () => ({
    createMessage: jest.fn(),
    getAllMessages: jest.fn(),
    getMessageById: jest.fn(),
    updateMessageStatus: jest.fn(),
    deleteMessage: jest.fn(),
}));

// Mock middleware
jest.mock('../../middlewares/authMiddleware', () => ({
    authenticateToken: jest.fn((req, res, next) => next()),
    isAdmin: jest.fn((req, res, next) => next()),
}));

// Setup the Express application for testing
const app = express();
app.use(express.json());
app.use('/public', publicRouter);
app.use('/private', privateRouter);

describe('Contact Message Routes', () => {
    describe('Public Routes', () => {
        test('POST /public/messages - successful message creation', async () => {
            const mockMessage = { id: 1, name: 'James Anderson', email: 'jemes.anderson@gmail.com', message: 'Hello, I would like to know more about your catering services.', status: 'new' };
            contactMessageController.createMessage.mockImplementation((req, res) =>
                res.status(201).json(mockMessage)
            );
            const reqBody = { name: 'James Anderson', email: 'jemes.anderson@gmail.com', message: 'Hello, I would like to know more about your catering services.' };

            const res = await request(app)
                .post('/public/messages')
                .send(reqBody);

            expect(res.status).toBe(201);
            expect(res.body).toEqual(mockMessage);
        });
    });

    describe('Private Routes', () => {
        test('GET /private/messages - successful retrieval of all messages by admin', async () => {
            const mockMessages = [
                { id: 1, name: 'James Anderson', email: 'jemes.anderson@gmail.com', message: 'Hello, I would like to know more about your catering services.', status: 'new' },
                { id: 2, name: 'Oliver Smith', email: 'osmith@nis.rs', message: 'My order arrived late. Can you assist me?', status: 'pending' },
            ];
            contactMessageController.getAllMessages.mockImplementation((req, res) =>
                res.status(200).json(mockMessages)
            );

            const res = await request(app).get('/private/messages');

            expect(res.status).toBe(200);
            expect(res.body).toEqual(mockMessages);
        });

        test('GET /private/messages/:id - successful retrieval of message by ID by admin', async () => {
            const mockMessage = { id: 1, name: 'James Anderson', email: 'jemes.anderson@gmail.com', message: 'Hello, I would like to know more about your catering services.', status: 'new' };
            contactMessageController.getMessageById.mockImplementation((req, res) =>
                res.status(200).json(mockMessage)
            );

            const res = await request(app).get('/private/messages/1');

            expect(res.status).toBe(200);
            expect(res.body).toEqual(mockMessage);
        });

        test('GET /private/messages/:id - message not found', async () => {
            contactMessageController.getMessageById.mockImplementation((req, res) =>
                res.status(404).json({ error: 'Message not found' })
            );

            const res = await request(app).get('/private/messages/999');

            expect(res.status).toBe(404);
            expect(res.body.error).toBe('Message not found');
        });

        test('PUT /private/messages/:id - successful message status update by admin', async () => {
            const mockUpdatedMessage = { id: 1, name: 'James Anderson', email: 'jemes.anderson@gmail.com', message: 'Hello, I would like to know more about your catering services.', status: 'new' };
            contactMessageController.updateMessageStatus.mockImplementation((req, res) =>
                res.status(200).json(mockUpdatedMessage)
            );
            const reqBody = { status: 'read' };

            const res = await request(app)
                .put('/private/messages/1')
                .send(reqBody);

            expect(res.status).toBe(200);
            expect(res.body).toEqual(mockUpdatedMessage);
        });

        test('DELETE /private/messages/:id - successful message deletion by admin', async () => {
            contactMessageController.deleteMessage.mockImplementation((req, res) =>
                res.status(200).json({ message: 'Message deleted' })
            );

            const res = await request(app).delete('/private/messages/1');

            expect(res.status).toBe(200);
            expect(res.body.message).toBe('Message deleted');
        });

        test('GET /private/messages - authentication failure', async () => {
            authenticateToken.mockImplementation((req, res) =>
                res.status(401).json({ error: 'Unauthorized' })
            );

            const res = await request(app).get('/private/messages');

            expect(res.status).toBe(401);
            expect(res.body.error).toBe('Unauthorized');
        });

        test('DELETE /private/messages/:id - unauthorized admin access', async () => {

            authenticateToken.mockImplementation((req, res, next) => next());

            isAdmin.mockImplementation((req, res) =>
                res.status(403).json({ error: 'Forbidden' })
            );

            const res = await request(app).delete('/private/messages/1');

            expect(res.status).toBe(403);
            expect(res.body.error).toBe('Forbidden');
        });

        test('PUT /private/messages/:id - server error', async () => {

            authenticateToken.mockImplementation((req, res, next) => next());
            isAdmin.mockImplementation((req, res, next) => next());

            contactMessageController.updateMessageStatus.mockImplementation((req, res) =>
                res.status(500).json({ error: 'Server error' })
            );
            const reqBody = { status: 'read' };

            const res = await request(app)
                .put('/private/messages/1')
                .send(reqBody);

            expect(res.status).toBe(500);
            expect(res.body.error).toBe('Server error');
        });
    });
});