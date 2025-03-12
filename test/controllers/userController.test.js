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

const UserController = require('../../controllers/userController');
const { User } = require('../../models');
const { successResponse, errorResponse } = require('../../utils/responseHandler');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { blacklistToken } = require('../../middlewares/authMiddleware');

// jest.mock to create mocks
jest.mock('../../models', () => ({
    User: {
        findOne: jest.fn(),
        create: jest.fn(),
        findAll: jest.fn(),
        findByPk: jest.fn(),
        destroy: jest.fn(),
    },
}));

jest.mock('../../utils/responseHandler', () => ({
    successResponse: jest.fn(),
    errorResponse: jest.fn(),
}));

jest.mock('bcrypt', () => ({
    compare: jest.fn(),
    hash: jest.fn(),
}));

jest.mock('jsonwebtoken', () => ({
    sign: jest.fn(),
}));

jest.mock('../../middlewares/authMiddleware', () => ({
    blacklistToken: jest.fn(),
}));

describe('UserController', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    // authenticateUser
    describe('authenticateUser', () => {
        it('should throw error if email or password is missing', async () => {
            await expect(UserController.authenticateUser('', 'pass')).rejects.toThrow('Email and password are required.');
            await expect(UserController.authenticateUser('test@example.com', '')).rejects.toThrow('Email and password are required.');
        });

        it('should throw error if user is not found', async () => {
            User.findOne.mockResolvedValue(null);
            await expect(UserController.authenticateUser('test@example.com', 'pass')).rejects.toThrow('Invalid credentials.');
        });

        it('should throw error if password does not match', async () => {
            const user = { email: 'test@example.com', password: 'hashedPass' };
            User.findOne.mockResolvedValue(user);
            bcrypt.compare.mockResolvedValue(false);
            await expect(UserController.authenticateUser('test@example.com', 'wrongPass')).rejects.toThrow('Invalid credentials.');
        });

        it('should return user if credentials are valid', async () => {
            const user = { id: 1, email: 'test@example.com', password: 'hashedPass', role: 'user' };
            User.findOne.mockResolvedValue(user);
            bcrypt.compare.mockResolvedValue(true);
            const result = await UserController.authenticateUser('test@example.com', 'pass');
            expect(result).toEqual(user);
        });
    });

    // loginUser
    describe('loginUser', () => {
        it('should return error if authentication fails', async () => {
            const req = { body: { email: '', password: '' } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            //console.log('Starting test: should return error if authentication fails');
        
            await UserController.loginUser(req, res);

            expect(errorResponse).toHaveBeenCalledWith(res, 'Email and password are required.', 401);
        });

        it('should return token for valid credentials', async () => {
            const user = { id: 1, role: 'user' };
            User.findOne.mockResolvedValue(user);
            bcrypt.compare.mockResolvedValue(true);
            jwt.sign.mockReturnValue('mockToken');
            const req = { body: { email: 'test@example.com', password: 'pass' } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            //console.log('Mocked user:', user);

            await UserController.loginUser(req, res);

            expect(successResponse).toHaveBeenCalledWith(res, 'Login successful.', { token: 'mockToken' });
        });
    });

    // logoutUser
    describe('logoutUser', () => {
        it('should return error if no token provided', async () => {
            const req = { headers: {} };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            //console.log('Starting test: should return error if authentication fails');
            
            await UserController.logoutUser(req, res);

            expect(errorResponse).toHaveBeenCalledWith(res, 'No token provided', 400);
        });
    
        it('should blacklist token and return success', async () => {
            const req = { headers: { authorization: 'Bearer token123' } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            await UserController.logoutUser(req, res);

            expect(blacklistToken).toHaveBeenCalledWith('token123');
            expect(successResponse).toHaveBeenCalledWith(res, 'Logout successful.');
        });
    
        it('should return error if blacklistToken fails', async () => {
            blacklistToken.mockImplementationOnce(() => {
                throw new Error('Blacklist error');
            });
            const req = { headers: { authorization: 'Bearer token123' } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            await UserController.logoutUser(req, res);

            expect(blacklistToken).toHaveBeenCalledWith('token123');
            expect(errorResponse).toHaveBeenCalledWith(res, 'Error during logout.', 500, 'Blacklist error');
        });
    });

    // createUser
    describe('createUser', () => {
        it('should return error if username is missing', async () => {
            const req = { body: { email: 'test@example.com', password: 'pass' } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            await UserController.createUser(req, res);

            expect(errorResponse).toHaveBeenCalledWith(res, 'Name, email, and password are required.', 400);
        });
    
        it('should return error if email is missing', async () => {
            const req = { body: { username: 'test', password: 'pass' } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            await UserController.createUser(req, res);

            expect(errorResponse).toHaveBeenCalledWith(res, 'Name, email, and password are required.', 400);
        });
    
        it('should return error if password is missing', async () => {
            const req = { body: { username: 'test', email: 'test@example.com' } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            await UserController.createUser(req, res);

            expect(errorResponse).toHaveBeenCalledWith(res, 'Name, email, and password are required.', 400);
        });
    
        it('should return error if username and email are missing', async () => {
            const req = { body: { password: 'pass' } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            await UserController.createUser(req, res);

            expect(errorResponse).toHaveBeenCalledWith(res, 'Name, email, and password are required.', 400);
        });
    
        it('should return error if username and password are missing', async () => {
            const req = { body: { email: 'test@example.com' } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            await UserController.createUser(req, res);

            expect(errorResponse).toHaveBeenCalledWith(res, 'Name, email, and password are required.', 400);
        });
    
        it('should return error if email and password are missing', async () => {
            const req = { body: { username: 'test' } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            await UserController.createUser(req, res);

            expect(errorResponse).toHaveBeenCalledWith(res, 'Name, email, and password are required.', 400);
        });
    
        it('should return error if all fields are missing', async () => {
            const req = { body: {} };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            await UserController.createUser(req, res);

            expect(errorResponse).toHaveBeenCalledWith(res, 'Name, email, and password are required.', 400);
        });
    
        it('should create user and return success', async () => {
            bcrypt.hash.mockResolvedValue('hashedPass');
            User.create.mockResolvedValue({ id: 1, username: 'test', email: 'test@example.com' });
            const req = { body: { username: 'test', email: 'test@example.com', password: 'pass' } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            await UserController.createUser(req, res);

            expect(successResponse).toHaveBeenCalledWith(res, 'User created successfully.', expect.any(Object), 201);
        });
    
        it('should return error if creation fails', async () => {
            bcrypt.hash.mockResolvedValue('hashedPass');
            User.create.mockRejectedValue(new Error('DB error'));
            const req = { body: { username: 'test', email: 'test@example.com', password: 'pass' } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            await UserController.createUser(req, res);

            expect(errorResponse).toHaveBeenCalledWith(res, 'Error creating user.', 500, 'DB error');
        });
    });

    // getAllUsers
    describe('getAllUsers', () => {
        it('should return all users without passwords', async () => {
            User.findAll.mockResolvedValue([{ id: 1, username: 'test' }]);
            const req = {};
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            await UserController.getAllUsers(req, res);

            expect(successResponse).toHaveBeenCalledWith(res, 'Users retrieved successfully.', [{ id: 1, username: 'test' }]);
        });

        it('should return error if retrieval fails', async () => {
            User.findAll.mockRejectedValue(new Error('DB error'));
            const req = {};
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            await UserController.getAllUsers(req, res);

            expect(errorResponse).toHaveBeenCalledWith(res, 'Error retrieving users.', 500, 'DB error');
        });
    });

    // getUserById
    describe('getUserById', () => {
        it('should return error if user not found', async () => {
            User.findByPk.mockResolvedValue(null);
            const req = { params: { id: 1 } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            await UserController.getUserById(req, res);

            expect(errorResponse).toHaveBeenCalledWith(res, 'User not found.', 404);
        });

        it('should return user without password', async () => {
            User.findByPk.mockResolvedValue({ id: 1, username: 'test' });
            const req = { params: { id: 1 } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            await UserController.getUserById(req, res);

            expect(successResponse).toHaveBeenCalledWith(res, 'User retrieved successfully.', { id: 1, username: 'test' });
        });

        it('should return error if retrieval fails', async () => {
            User.findByPk.mockRejectedValue(new Error('DB error'));
            const req = { params: { id: 1 } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            await UserController.getUserById(req, res);

            expect(errorResponse).toHaveBeenCalledWith(res, 'Error retrieving user.', 500, 'DB error');
        });
    });

    // updateUser
    describe('updateUser', () => {
        it('should return error if user not found', async () => {
            User.findByPk.mockResolvedValue(null);
            const req = { params: { id: 1 }, body: { name: 'New Name' } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            await UserController.updateUser(req, res);

            expect(errorResponse).toHaveBeenCalledWith(res, 'User not found.', 404);
        });
    
        it('should update all fields and return success', async () => {
            const mockUser = {
                id: 1,
                name: 'Old Name',
                email: 'old@example.com',
                password: 'oldPass',
                role: 'user',
                save: jest.fn().mockResolvedValue(),
            };
            User.findByPk.mockResolvedValue(mockUser);
            const req = {
                params: { id: 1 },
                body: { name: 'New Name', email: 'new@example.com', password: 'newPass', role: 'admin' },
            };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            await UserController.updateUser(req, res);

            expect(mockUser.name).toBe('New Name');
            expect(mockUser.email).toBe('new@example.com');
            expect(mockUser.password).toBe('newPass');
            expect(mockUser.role).toBe('admin');
            expect(mockUser.save).toHaveBeenCalledTimes(1);
            expect(successResponse).toHaveBeenCalledWith(res, 'User updated successfully.', mockUser);
        });
    
        it('should update other fields without name and return success', async () => {
            const mockUser = {
                id: 1,
                name: 'Old Name',
                email: 'old@example.com',
                password: 'oldPass',
                role: 'user',
                save: jest.fn().mockResolvedValue(),
            };
            User.findByPk.mockResolvedValue(mockUser);
            const req = {
                params: { id: 1 },
                body: { email: 'new@example.com', password: 'newPass', role: 'admin' }, 
            };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            await UserController.updateUser(req, res);

            expect(mockUser.name).toBe('Old Name'); 
            expect(mockUser.email).toBe('new@example.com');
            expect(mockUser.password).toBe('newPass');
            expect(mockUser.role).toBe('admin');
            expect(mockUser.save).toHaveBeenCalledTimes(1);
            expect(successResponse).toHaveBeenCalledWith(res, 'User updated successfully.', mockUser);
        });
    
        it('should return error if update fails', async () => {
            const mockUser = {
                id: 1,
                name: 'Old Name',
                save: jest.fn().mockRejectedValue(new Error('DB error')),
            };
            User.findByPk.mockResolvedValue(mockUser);
            const req = { params: { id: 1 }, body: { name: 'New Name' } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            await UserController.updateUser(req, res);

            expect(errorResponse).toHaveBeenCalledWith(res, 'Error updating user.', 500, 'DB error');
        });
    });

    // deleteUser
    describe('deleteUser', () => {
        it('should return error if user not found', async () => {
            User.findByPk.mockResolvedValue(null);
            const req = { params: { id: 1 } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            await UserController.deleteUser(req, res);

            expect(errorResponse).toHaveBeenCalledWith(res, 'User not found.', 404);
        });

        it('should delete user and return success', async () => {
            const mockUser = { id: 1, destroy: jest.fn().mockResolvedValue() };
            User.findByPk.mockResolvedValue(mockUser);
            const req = { params: { id: 1 } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            await UserController.deleteUser(req, res);

            expect(mockUser.destroy).toHaveBeenCalledTimes(1);
            expect(successResponse).toHaveBeenCalledWith(res, 'User deleted successfully.');
        });

        it('should return error if deletion fails', async () => {
            const mockUser = { id: 1, destroy: jest.fn().mockRejectedValue(new Error('DB error')) };
            User.findByPk.mockResolvedValue(mockUser);
            const req = { params: { id: 1 } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            await UserController.deleteUser(req, res);
            
            expect(errorResponse).toHaveBeenCalledWith(res, 'Error deleting user.', 500, 'DB error');
        });
    });
});