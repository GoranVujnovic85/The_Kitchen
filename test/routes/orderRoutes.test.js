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
const { publicRouter, privateRouter } = require('../../routes/orderRoutes');
const orderController = require('../../controllers/orderController');
const { authenticateToken, isAdmin } = require('../../middlewares/authMiddleware');

// Mock controller
jest.mock('../../controllers/orderController', () => ({
    createOrder: jest.fn(),
    getOrderById: jest.fn(),
    getAllOrders: jest.fn(),
    updateOrder: jest.fn(),
    deleteOrder: jest.fn(),
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

describe('Order Routes', () => {
    describe('Public Routes', () => {
        test('GET /public/orders - successful retrieval of all orders', async () => {
            const mockOrders = [
                { id: 1, userId: 1, total: 50.00 },
                { id: 2, userId: 2, total: 75.00 },
            ];
            orderController.getAllOrders.mockImplementation((req, res) =>
                res.status(200).json(mockOrders)
            );

            const res = await request(app).get('/public/orders');

            expect(res.status).toBe(200);
            expect(res.body).toEqual(mockOrders);
        });

        test('GET /public/orders/:id - successful retrieval of order by ID', async () => {
            const mockOrder = { id: 1, userId: 1, total: 50.00 };
            orderController.getOrderById.mockImplementation((req, res) =>
                res.status(200).json(mockOrder)
            );

            const res = await request(app).get('/public/orders/1');

            expect(res.status).toBe(200);
            expect(res.body).toEqual(mockOrder);
        });

        test('GET /public/orders/:id - order not found', async () => {
            orderController.getOrderById.mockImplementation((req, res) =>
                res.status(404).json({ error: 'Order not found' })
            );

            const res = await request(app).get('/public/orders/999');

            expect(res.status).toBe(404);
            expect(res.body.error).toBe('Order not found');
        });
    });

    describe('Private Routes', () => {
        test('POST /private/orders - successful order creation', async () => {
            const mockOrder = { id: 1, userId: 1, total: 50.00 };
            orderController.createOrder.mockImplementation((req, res) =>
                res.status(201).json(mockOrder)
            );
            const reqBody = { userId: 1, total: 50.00 };

            const res = await request(app)
                .post('/private/orders')
                .send(reqBody);

            expect(res.status).toBe(201);
            expect(res.body).toEqual(mockOrder);
        });

        test('PUT /private/orders/:id - successful order update', async () => {
            const mockUpdatedOrder = { id: 1, userId: 1, total: 75.00 };
            orderController.updateOrder.mockImplementation((req, res) =>
                res.status(200).json(mockUpdatedOrder)
            );
            const reqBody = { total: 75.00 };

            const res = await request(app)
                .put('/private/orders/1')
                .send(reqBody);

            expect(res.status).toBe(200);
            expect(res.body).toEqual(mockUpdatedOrder);
        });

        test('DELETE /private/orders/:id - successful order deletion by admin', async () => {
            orderController.deleteOrder.mockImplementation((req, res) =>
                res.status(200).json({ message: 'Order deleted' })
            );

            const res = await request(app).delete('/private/orders/1');

            expect(res.status).toBe(200);
            expect(res.body.message).toBe('Order deleted');
        });

        test('DELETE /private/orders/:id - unauthorized admin access', async () => {
            isAdmin.mockImplementation((req, res) =>
                res.status(403).json({ error: 'Forbidden' })
            );

            const res = await request(app).delete('/private/orders/1');

            expect(res.status).toBe(403);
            expect(res.body.error).toBe('Forbidden');
        });

        test('POST /private/orders - authentication failure', async () => {
            authenticateToken.mockImplementation((req, res) =>
                res.status(401).json({ error: 'Unauthorized' })
            );
            const reqBody = { userId: 1, total: 50.00 };

            const res = await request(app)
                .post('/private/orders')
                .send(reqBody);

            expect(res.status).toBe(401);
            expect(res.body.error).toBe('Unauthorized');
        });

        test('PUT /private/orders/:id - server error', async () => {
            console.log('Starting test: PUT /private/orders/:id - server error');
        
            authenticateToken.mockImplementation((req, res, next) => next());

            orderController.updateOrder.mockImplementation((req, res) => {
                //console.log('Inside updateOrder mock - sending 500');
                return res.status(500).json({ error: 'Server error' });
            });
            const reqBody = { total: 75.00 };
            //console.log('Request body prepared:', reqBody);
        
            //console.log('Sending PUT request to /private/orders/1');
            const res = await request(app)
                .put('/private/orders/1')
                .send(reqBody);
        
            //console.log('Response received - Status:', res.status);
            //console.log('Response body:', res.body);
            expect(res.status).toBe(500);
            expect(res.body.error).toBe('Server error');
        });
    });
});