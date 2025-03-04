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
const { publicRouter, privateRouter } = require('../../routes/orderItemRoutes'); 
const orderItemController = require('../../controllers/orderItemController');
const { authenticateToken, isAdmin } = require('../../middlewares/authMiddleware');

// Mock controller
jest.mock('../../controllers/orderItemController', () => ({
    getAll: jest.fn(),
    getById: jest.fn(),
    create: jest.fn(),
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

describe('Order Item Routes', () => {
    describe('Public Routes', () => {
        test('GET /public/order-items - successful retrieval of all order items', async () => {
            const mockOrderItems = [
                { id: 1, orderId: 1, productId: 1, quantity: 2 },
                { id: 2, orderId: 2, productId: 2, quantity: 1 },
            ];
            orderItemController.getAll.mockImplementation((req, res) =>
                res.status(200).json(mockOrderItems)
            );

            const res = await request(app).get('/public/order-items');

            expect(res.status).toBe(200);
            expect(res.body).toEqual(mockOrderItems);
        });

        test('GET /public/order-items/:id - successful retrieval of order item by ID', async () => {
            const mockOrderItem = { id: 1, orderId: 1, productId: 1, quantity: 2 };
            orderItemController.getById.mockImplementation((req, res) =>
                res.status(200).json(mockOrderItem)
            );

            const res = await request(app).get('/public/order-items/1');

            expect(res.status).toBe(200);
            expect(res.body).toEqual(mockOrderItem);
        });

        test('GET /public/order-items/:id - order item not found', async () => {
            orderItemController.getById.mockImplementation((req, res) =>
                res.status(404).json({ error: 'Order item not found' })
            );

            const res = await request(app).get('/public/order-items/999');

            expect(res.status).toBe(404);
            expect(res.body.error).toBe('Order item not found');
        });
    });

    describe('Private Routes', () => {
        test('POST /private/order-items - successful order item creation', async () => {
            const mockOrderItem = { id: 1, orderId: 1, productId: 1, quantity: 2 };
            orderItemController.create.mockImplementation((req, res) =>
                res.status(201).json(mockOrderItem)
            );
            const reqBody = { orderId: 1, productId: 1, quantity: 2 };

            const res = await request(app)
                .post('/private/order-items')
                .send(reqBody);

            expect(res.status).toBe(201);
            expect(res.body).toEqual(mockOrderItem);
        });

        test('PUT /private/order-items/:id - successful order item update', async () => {
            const mockUpdatedOrderItem = { id: 1, orderId: 1, productId: 1, quantity: 3 };
            orderItemController.update.mockImplementation((req, res) =>
                res.status(200).json(mockUpdatedOrderItem)
            );
            const reqBody = { quantity: 3 };

            const res = await request(app)
                .put('/private/order-items/1')
                .send(reqBody);

            expect(res.status).toBe(200);
            expect(res.body).toEqual(mockUpdatedOrderItem);
        });

        test('DELETE /private/order-items/:id - successful order item deletion by admin', async () => {
            orderItemController.delete.mockImplementation((req, res) =>
                res.status(200).json({ message: 'Order item deleted' })
            );

            const res = await request(app).delete('/private/order-items/1');

            expect(res.status).toBe(200);
            expect(res.body.message).toBe('Order item deleted');
        });

        test('DELETE /private/order-items/:id - unauthorized admin access', async () => {
            isAdmin.mockImplementation((req, res) =>
                res.status(403).json({ error: 'Forbidden' })
            );

            const res = await request(app).delete('/private/order-items/1');

            expect(res.status).toBe(403);
            expect(res.body.error).toBe('Forbidden');
        });

        test('POST /private/order-items - authentication failure', async () => {
            authenticateToken.mockImplementation((req, res) =>
                res.status(401).json({ error: 'Unauthorized' })
            );
            const reqBody = { orderId: 1, productId: 1, quantity: 2 };

            const res = await request(app)
                .post('/private/order-items')
                .send(reqBody);

            expect(res.status).toBe(401);
            expect(res.body.error).toBe('Unauthorized');
        });

        test('PUT /private/order-items/:id - server error', async () => {

            // I ensure that both middleware functions (authenticateToken and isAdmin) allow the request to pass through so that it reaches orderItemController.update.
            authenticateToken.mockImplementation((req, res, next) => next());
            isAdmin.mockImplementation((req, res, next) => next());

            orderItemController.update.mockImplementation((req, res) =>
                res.status(500).json({ error: 'Server error' })
            );
            const reqBody = { quantity: 3 };
            //console.log('Request body prepared:', reqBody);

            //console.log('Sending PUT request to /private/order-items/1');
            const res = await request(app)
                .put('/private/order-items/1')
                .send(reqBody);

            //console.log('Response received - Status:', res.status);
            //console.log('Response body:', res.body);
            expect(res.status).toBe(500);
            expect(res.body.error).toBe('Server error');
        });
    });
});
