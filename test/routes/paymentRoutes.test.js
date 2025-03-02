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
const { publicRouter, privateRouter } = require('../../routes/paymentRoutes');
const paymentController = require('../../controllers/paymentController');
const { authenticateToken, isAdmin } = require('../../middlewares/authMiddleware');

jest.mock('../../controllers/paymentController', () => ({
    createPayment: jest.fn(),
    getPaymentById: jest.fn(),
    getAllPayments: jest.fn(),
    updatePayment: jest.fn(),
    deletePayment: jest.fn(),
}));

jest.mock('../../middlewares/authMiddleware', () => ({
    authenticateToken: jest.fn((req, res, next) => next()),
    isAdmin: jest.fn((req, res, next) => next()),
}));

const app = express();
app.use(express.json());
app.use('/public', publicRouter);
app.use('/private', privateRouter);

describe('Private Payment Routes', () => {
    test('POST /private/payments - successful payment creation', async () => {
        paymentController.createPayment.mockImplementation((req, res) => res.status(201).json({ id: 1, status: 'success' }));

        const res = await request(app)
            .post('/private/payments')
            .send({ amount: 100, method: 'Credit Card' });

            //console.log("Response status:", res.status);
            //console.log("Response body:", res.body);

        expect(res.status).toBe(201);
        expect(res.body).toEqual({ id: 1, status: 'success' });
    });

    test('GET /public/payments/:id - payment not found', async () => {
        paymentController.getPaymentById.mockImplementation((req, res) => res.status(404).json({ error: 'Payment not found' }));

        const res = await request(app).get('/public/payments/999');

        expect(res.status).toBe(404);
        expect(res.body.error).toBe('Payment not found');
    });
});

describe('Public Payment Routes', () => {
    test('GET /public/payments - get all payments', async () => {
        paymentController.getAllPayments.mockImplementation((req, res) => res.status(200).json([{ id: 1, amount: 100 }]));

        const res = await request(app).get('/public/payments');

        expect(res.status).toBe(200);
        expect(res.body).toEqual([{ id: 1, amount: 100 }]);
    });

    test('DELETE /private/payments/:id - unauthorized admin access', async () => {
        isAdmin.mockImplementation((req, res) => res.status(403).json({ error: 'Forbidden' }));

        const res = await request(app).delete('/private/payments/1');

        expect(res.status).toBe(403);
        expect(res.body.error).toBe('Forbidden');
    });

    test('PUT /private/payments/:id - server error', async () => {
        paymentController.updatePayment.mockImplementation((req, res) => res.status(500).json({ error: 'Server error' }));

        const res = await request(app)
            .put('/private/payments/1')
            .send({ amount: 150 });

        expect(res.status).toBe(500);
        expect(res.body.error).toBe('Server error');
    });
});
