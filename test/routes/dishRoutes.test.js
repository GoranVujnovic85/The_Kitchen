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
const { publicRouter, privateRouter } = require('../../routes/dishRoutes'); 
const { dishControllerInstance, upload } = require('../../controllers/dishController');
const { authenticateToken, isAdmin } = require('../../middlewares/authMiddleware');

// Mock controller
jest.mock('../../controllers/dishController', () => {
    const mockDishController = {
        getAllDishes: jest.fn(),
        getDishById: jest.fn(),
        createDish: jest.fn(),
        updateDish: jest.fn(),
        deleteDish: jest.fn(),
    };
    return {
        dishControllerInstance: mockDishController,
        upload: {
            single: jest.fn(() => (req, res, next) => next()), 
        },
    };
});

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

describe('Dish Routes', () => {
    describe('Public Routes', () => {
        test('GET /public/dishes - successful retrieval of all dishes', async () => {
            const mockDishes = [
                { id: 1, name: 'Beans in suc', price: 543.55 },
                { id: 2, name: 'Podvarak in suc', price: 788.99 },
            ];
            dishControllerInstance.getAllDishes.mockImplementation((req, res) =>
                res.status(200).json(mockDishes)
            );

            const res = await request(app).get('/public/dishes');

            expect(res.status).toBe(200);
            expect(res.body).toEqual(mockDishes);
        });

        test('GET /public/dishes/:id - successful retrieval of dish by ID', async () => {
            const mockDish = { id: 1, name: 'Beans in suc', price: 543.55 };
            dishControllerInstance.getDishById.mockImplementation((req, res) =>
                res.status(200).json(mockDish)
            );

            const res = await request(app).get('/public/dishes/1');

            expect(res.status).toBe(200);
            expect(res.body).toEqual(mockDish);
        });

        test('GET /public/dishes/:id - dish not found', async () => {
            dishControllerInstance.getDishById.mockImplementation((req, res) =>
                res.status(404).json({ error: 'Dish not found' })
            );

            const res = await request(app).get('/public/dishes/999');

            expect(res.status).toBe(404);
            expect(res.body.error).toBe('Dish not found');
        });
    });

    describe('Private Routes', () => {
        test('POST /private/dishes - successful dish creation by admin', async () => {
            const mockDish = { id: 1, name: 'Beans in suc', price: 543.55, image: 'Beans in suc.png' };
            dishControllerInstance.createDish.mockImplementation((req, res) =>
                res.status(201).json(mockDish)
            );
            const reqBody = { name: 'Beans in suc', price: 543.55 };

            const res = await request(app)
                .post('/private/dishes')
                .field('name', 'Beans in suc') 
                .field('price', 543.55)
                .attach('image', Buffer.from('fake-image'), 'Beans in suc.png'); // Simulate image upload

            expect(res.status).toBe(201);
            expect(res.body).toEqual(mockDish);
        });

        test('PUT /private/dishes/:id - successful dish update by admin', async () => {
            const mockUpdatedDish = { id: 1, name: 'Updated Beans in suc', price: 543.55, image: 'Beans in suc.png' };
            dishControllerInstance.updateDish.mockImplementation((req, res) =>
                res.status(200).json(mockUpdatedDish)
            );
            const reqBody = { name: 'Updated Beans in suc', price: 543.55 };

            const res = await request(app)
                .put('/private/dishes/1')
                .field('name', 'Updated Beans in suc')
                .field('price', 543.55)
                .attach('image', Buffer.from('new-fake-image'), 'Beans in suc.png');

            expect(res.status).toBe(200);
            expect(res.body).toEqual(mockUpdatedDish);
        });

        test('DELETE /private/dishes/:id - successful dish deletion by admin', async () => {
            dishControllerInstance.deleteDish.mockImplementation((req, res) =>
                res.status(200).json({ message: 'Dish deleted' })
            );

            const res = await request(app).delete('/private/dishes/1');

            expect(res.status).toBe(200);
            expect(res.body.message).toBe('Dish deleted');
        });

        test('POST /private/dishes - authentication failure', async () => {
            authenticateToken.mockImplementation((req, res) =>
                res.status(401).json({ error: 'Unauthorized' })
            );
            const reqBody = { name: 'Beans in suc', price: 543.55 };

            const res = await request(app)
                .post('/private/dishes')
                .field('name', 'Beans in suc')
                .field('price', 543.55)
                .attach('image', Buffer.from('fake-image'), 'Beans in suc.png');

            expect(res.status).toBe(401);
            expect(res.body.error).toBe('Unauthorized');
        });

        test('DELETE /private/dishes/:id - unauthorized admin access', async () => {

            authenticateToken.mockImplementation((req, res, next) => next());
            isAdmin.mockImplementation((req, res, next) => next());

            isAdmin.mockImplementation((req, res) =>
                res.status(403).json({ error: 'Forbidden' })
            );

            const res = await request(app).delete('/private/dishes/1');

            expect(res.status).toBe(403);
            expect(res.body.error).toBe('Forbidden');
        });

        test('PUT /private/dishes/:id - server error', async () => {

            authenticateToken.mockImplementation((req, res, next) => next());
            isAdmin.mockImplementation((req, res, next) => next());

            dishControllerInstance.updateDish.mockImplementation((req, res) =>
                res.status(500).json({ error: 'Server error' })
            );
            const reqBody = { name: 'Updated Beans in suc', price: 543.55 };

            const res = await request(app)
                .put('/private/dishes/1')
                .field('name', 'Updated Beans in suc')
                .field('price', 543.55)
                .attach('image', Buffer.from('new-fake-image'), 'Beans in suc.png');

            expect(res.status).toBe(500);
            expect(res.body.error).toBe('Server error');
        });
    });
});