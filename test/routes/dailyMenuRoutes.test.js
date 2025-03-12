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
const { publicRouter, privateRouter } = require('../../routes/dailyMenuRoutes'); 
const dailyMenuController = require('../../controllers/dailyMenuController');
const { authenticateToken, isAdmin } = require('../../middlewares/authMiddleware');

// Mock controller
jest.mock('../../controllers/dailyMenuController', () => ({
    getAllDailyMenus: jest.fn(),
    getDailyMenuById: jest.fn(),
    createDailyMenu: jest.fn(),
    updateDailyMenu: jest.fn(),
    deleteDailyMenu: jest.fn(),
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

describe('Daily Menu Routes', () => {
    describe('Public Routes', () => {
        test('GET /public/daily-menus - successful retrieval of all daily menus', async () => {
            const mockDailyMenus = [
                { id: 1, date: '2025-03-05', dishIds: [1, 2] },
                { id: 2, date: '2025-03-06', dishIds: [3, 4] },
            ];
            dailyMenuController.getAllDailyMenus.mockImplementation((req, res) =>
                res.status(200).json(mockDailyMenus)
            );

            const res = await request(app).get('/public/daily-menus');

            expect(res.status).toBe(200);
            expect(res.body).toEqual(mockDailyMenus);
        });

        test('GET /public/daily-menus/:id - successful retrieval of daily menu by ID', async () => {
            const mockDailyMenu = { id: 1, date: '2025-03-05', dishIds: [1, 2] };
            dailyMenuController.getDailyMenuById.mockImplementation((req, res) =>
                res.status(200).json(mockDailyMenu)
            );

            const res = await request(app).get('/public/daily-menus/1');

            expect(res.status).toBe(200);
            expect(res.body).toEqual(mockDailyMenu);
        });

        test('GET /public/daily-menus/:id - daily menu not found', async () => {
            dailyMenuController.getDailyMenuById.mockImplementation((req, res) =>
                res.status(404).json({ error: 'Daily menu not found' })
            );

            const res = await request(app).get('/public/daily-menus/999');

            expect(res.status).toBe(404);
            expect(res.body.error).toBe('Daily menu not found');
        });
    });

    describe('Private Routes', () => {
        test('POST /private/daily-menus - successful daily menu creation by admin', async () => {
            const mockDailyMenu = { id: 1, date: '2025-03-05', dishIds: [1, 2] };
            dailyMenuController.createDailyMenu.mockImplementation((req, res) =>
                res.status(201).json(mockDailyMenu)
            );
            const reqBody = { date: '2025-03-05', dishIds: [1, 2] };

            const res = await request(app)
                .post('/private/daily-menus')
                .send(reqBody);

            expect(res.status).toBe(201);
            expect(res.body).toEqual(mockDailyMenu);
        });

        test('PUT /private/daily-menus/:id - successful daily menu update by admin', async () => {
            const mockUpdatedDailyMenu = { id: 1, date: '2025-03-05', dishIds: [1, 2, 3] };
            dailyMenuController.updateDailyMenu.mockImplementation((req, res) =>
                res.status(200).json(mockUpdatedDailyMenu)
            );
            const reqBody = { dishIds: [1, 2, 3] };

            const res = await request(app)
                .put('/private/daily-menus/1')
                .send(reqBody);

            expect(res.status).toBe(200);
            expect(res.body).toEqual(mockUpdatedDailyMenu);
        });

        test('DELETE /private/daily-menus/:id - successful daily menu deletion by admin', async () => {
            dailyMenuController.deleteDailyMenu.mockImplementation((req, res) =>
                res.status(200).json({ message: 'Daily menu deleted' })
            );

            const res = await request(app).delete('/private/daily-menus/1');

            expect(res.status).toBe(200);
            expect(res.body.message).toBe('Daily menu deleted');
        });

        test('POST /private/daily-menus - authentication failure', async () => {
            authenticateToken.mockImplementation((req, res) =>
                res.status(401).json({ error: 'Unauthorized' })
            );
            const reqBody = { date: '2025-03-05', dishIds: [1, 2] };

            const res = await request(app)
                .post('/private/daily-menus')
                .send(reqBody);

            expect(res.status).toBe(401);
            expect(res.body.error).toBe('Unauthorized');
        });

        test('DELETE /private/daily-menus/:id - unauthorized admin access', async () => {

            authenticateToken.mockImplementation((req, res, next) => next());

            isAdmin.mockImplementation((req, res) =>
                res.status(403).json({ error: 'Forbidden' })
            );

            const res = await request(app).delete('/private/daily-menus/1');

            expect(res.status).toBe(403);
            expect(res.body.error).toBe('Forbidden');
        });

        test('PUT /private/daily-menus/:id - server error', async () => {

            authenticateToken.mockImplementation((req, res, next) => next());
            isAdmin.mockImplementation((req, res, next) => next());

            dailyMenuController.updateDailyMenu.mockImplementation((req, res) =>
                res.status(500).json({ error: 'Server error' })
            );
            const reqBody = { dishIds: [1, 2, 3] };

            const res = await request(app)
                .put('/private/daily-menus/1')
                .send(reqBody);

            expect(res.status).toBe(500);
            expect(res.body.error).toBe('Server error');
        });
    });
});