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
const { publicRouter, privateRouter } = require('../../routes/userRoutes');
const userController = require('../../controllers/userController');
const { authenticateToken, isAdmin } = require('../../middlewares/authMiddleware');

// Mock controller
jest.mock('../../controllers/userController', () => ({
    loginUser: jest.fn(),
    createUser: jest.fn(),
    getUserById: jest.fn(),
    logoutUser: jest.fn(),
    getAllUsers: jest.fn(),
    updateUser: jest.fn(),
    deleteUser: jest.fn(),
}));

// Mock middleware
jest.mock('../../middlewares/authMiddleware', () => ({
    authenticateToken: jest.fn((req, res, next) => next()),
    isAdmin: jest.fn((req, res, next) => next()),
}));

const app = express();
app.use(express.json());
app.use('/public', publicRouter);
app.use('/private', privateRouter);

// PUBLIC ROUTES TESTS 
describe('Public Routes', () => {
    test('POST /public/login - successful login', async () => {
        userController.loginUser.mockImplementation((req, res) => res.status(200).json({ token: 'fakeToken' }));

        //console.log("Sending login request...");

        const res = await request(app)
            .post('/public/login')
            .send({ email: 'test@example.com', password: 'password123' });

            //console.log("Response received:", res.body);

        expect(res.status).toBe(200);
        expect(res.body.token).toBe('fakeToken');
    });

    test('GET /public/users/:id - user not found', async () => {
        userController.getUserById.mockImplementation((req, res) => res.status(404).json({ error: 'User not found' }));

        const res = await request(app).get('/public/users/999');

        expect(res.status).toBe(404);
        expect(res.body.error).toBe('User not found');
    });
});

// PRIVATE ROUTES TESTS 
describe('Private Routes', () => {
    test('GET /private/users - get all users', async () => {
        userController.getAllUsers.mockImplementation((req, res) => res.status(200).json([{ id: 1, name: 'Goran Vujnovic' }]));

        const res = await request(app).get('/private/users');

        //console.log("Sending GET request to /private/users...");

        expect(res.status).toBe(200);
        expect(res.body).toEqual([{ id: 1, name: 'Goran Vujnovic' }]);
    });

    test('DELETE /private/users/:id - unauthorized admin access', async () => {
        isAdmin.mockImplementation((req, res) => res.status(403).json({ error: 'Forbidden' }));

        //console.log("Sending DELETE request to /private/users/1...");

        const res = await request(app).delete('/private/users/1');

        console.log("Response status:", res.status);
        console.log("Response body:", res.body);
        
        expect(res.status).toBe(403);
        expect(res.body.error).toBe('Forbidden');
    });

    test('PUT /private/users/:id - server error', async () => {
        userController.updateUser.mockImplementation((req, res) => res.status(500).json({ error: 'Server error' }));

        const res = await request(app)
            .put('/private/users/1')
            .send({ name: 'Updated Name' });

        expect(res.status).toBe(500);
        expect(res.body.error).toBe('Server error');
    });
});
