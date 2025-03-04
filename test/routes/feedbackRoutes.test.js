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
const { publicRouter, privateRouter } = require('../../routes/feedbackRoutes'); 
const feedbackController = require('../../controllers/feedbackController');
const { authenticateToken, isAdmin } = require('../../middlewares/authMiddleware');

// Mock controller
jest.mock('../../controllers/feedbackController', () => ({
    create: jest.fn(),
    getById: jest.fn(),
    getAll: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
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

describe('Feedback Routes', () => {
    describe('Public Routes', () => {
        test('POST /public/feedbacks - successful feedback creation', async () => {
            const mockFeedback = { id: 1, userId: 1, message: 'Great service!' };
            feedbackController.create.mockImplementation((req, res) =>
                res.status(201).json(mockFeedback)
            );
            const reqBody = { userId: 1, message: 'Great service!' };

            const res = await request(app)
                .post('/public/feedbacks')
                .send(reqBody);

            expect(res.status).toBe(201);
            expect(res.body).toEqual(mockFeedback);
        });

        test('GET /public/feedbacks/:id - successful retrieval of feedback by ID', async () => {
            const mockFeedback = { id: 1, userId: 1, message: 'Great service!' };
            feedbackController.getById.mockImplementation((req, res) =>
                res.status(200).json(mockFeedback)
            );

            const res = await request(app).get('/public/feedbacks/1');

            expect(res.status).toBe(200);
            expect(res.body).toEqual(mockFeedback);
        });

        test('GET /public/feedbacks/:id - feedback not found', async () => {
            feedbackController.getById.mockImplementation((req, res) =>
                res.status(404).json({ error: 'Feedback not found' })
            );

            const res = await request(app).get('/public/feedbacks/999');

            expect(res.status).toBe(404);
            expect(res.body.error).toBe('Feedback not found');
        });

        test('GET /public/feedbacks - successful retrieval of all feedback', async () => {
            const mockFeedbacks = [
                { id: 1, userId: 1, message: 'Great service!' },
                { id: 2, userId: 2, message: 'Needs improvement.' },
            ];
            feedbackController.getAll.mockImplementation((req, res) =>
                res.status(200).json(mockFeedbacks)
            );

            const res = await request(app).get('/public/feedbacks');

            expect(res.status).toBe(200);
            expect(res.body).toEqual(mockFeedbacks);
        });
    });

    describe('Private Routes', () => {
        test('PUT /private/feedbacks/:id - successful feedback update by admin', async () => {
            const mockUpdatedFeedback = { id: 1, userId: 1, message: 'Updated feedback' };
            feedbackController.update.mockImplementation((req, res) =>
                res.status(200).json(mockUpdatedFeedback)
            );
            const reqBody = { message: 'Updated feedback' };

            const res = await request(app)
                .put('/private/feedbacks/1')
                .send(reqBody);

            expect(res.status).toBe(200);
            expect(res.body).toEqual(mockUpdatedFeedback);
        });

        test('DELETE /private/feedbacks/:id - successful feedback deletion by admin', async () => {
            feedbackController.delete.mockImplementation((req, res) =>
                res.status(200).json({ message: 'Feedback deleted' })
            );

            const res = await request(app).delete('/private/feedbacks/1');

            expect(res.status).toBe(200);
            expect(res.body.message).toBe('Feedback deleted');
        });

        test('PUT /private/feedbacks/:id - authentication failure', async () => {
            authenticateToken.mockImplementation((req, res) =>
                res.status(401).json({ error: 'Unauthorized' })
            );
            const reqBody = { message: 'Updated feedback' };

            const res = await request(app)
                .put('/private/feedbacks/1')
                .send(reqBody);

            expect(res.status).toBe(401);
            expect(res.body.error).toBe('Unauthorized');
        });

        test('DELETE /private/feedbacks/:id - unauthorized admin access', async () => {

            authenticateToken.mockImplementation((req, res, next) => next());
            
            isAdmin.mockImplementation((req, res) =>
                res.status(403).json({ error: 'Forbidden' })
            );

            const res = await request(app).delete('/private/feedbacks/1');

            expect(res.status).toBe(403);
            expect(res.body.error).toBe('Forbidden');
        });

        test('PUT /private/feedbacks/:id - server error', async () => {

            authenticateToken.mockImplementation((req, res, next) => next());
            isAdmin.mockImplementation((req, res, next) => next());

            feedbackController.update.mockImplementation((req, res) =>
                res.status(500).json({ error: 'Server error' })
            );
            const reqBody = { message: 'Updated feedback' };

            const res = await request(app)
                .put('/private/feedbacks/1')
                .send(reqBody);

            expect(res.status).toBe(500);
            expect(res.body.error).toBe('Server error');
        });
    });
});