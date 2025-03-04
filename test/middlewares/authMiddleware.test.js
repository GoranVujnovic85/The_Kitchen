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

const authMiddleware = require('../../middlewares/authMiddleware');
const jwt = require('jsonwebtoken');

// Mock JWT functionality
jest.mock('jsonwebtoken'); 

describe('Auth Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = { headers: {} };
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    next = jest.fn();
  });

  describe('authenticateToken', () => {
    it('should return 401 if no token is provided', () => {

      console.log('Test: should return 401 if no token is provided');

      authMiddleware.authenticateToken(req, res, next);

      //console.log('Response status after no token check:', res.status.mock.calls);
      //console.log('Response body after no token check:', res.json.mock.calls);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'Unauthorized: No token provided.' });
    });

    it('should return 403 if token is blacklisted', () => {

      console.log('Test: should return 403 if token is blacklisted');

      const token = 'blacklistedToken';
      req.headers.authorization = `Bearer ${token}`;
      authMiddleware.blacklistToken(token);                 // Add the token to the blacklist

      authMiddleware.authenticateToken(req, res, next);

      //console.log('Response status after blacklisted token check:', res.status.mock.calls);
      //console.log('Response body after blacklisted token check:', res.json.mock.calls);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ message: 'Forbidden: Token is blacklisted.' });
    });

    it('should return 403 if token is invalid', () => {
      req.headers.authorization = 'Bearer invalidToken';
      jwt.verify.mockImplementation((token, secret, callback) => {
        callback(new Error('Invalid token'), null);
      });

      authMiddleware.authenticateToken(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ message: 'Forbidden: Invalid token.' });
    });

    it('should call next() if token is valid', () => {
      req.headers.authorization = 'Bearer validToken';
      jwt.verify.mockImplementation((token, secret, callback) => {
        callback(null, { id: 1, role: 'customer' });                 // Mock valid user
      });

      authMiddleware.authenticateToken(req, res, next);

      expect(req.user).toEqual({ id: 1, role: 'customer' });
      expect(next).toHaveBeenCalled();
    });
  });

  describe('isCustomer', () => {
    it('should return 403 if user is not a customer', () => {
      req.user = { role: 'admin' };

      authMiddleware.isCustomer(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ message: 'Forbidden: Customers only.' });
    });

    it('should call next() if user is a customer', () => {
      req.user = { role: 'customer' };

      authMiddleware.isCustomer(req, res, next);

      expect(next).toHaveBeenCalled();
    });
  });

  describe('isAdmin', () => {
    it('should return 403 if user is not an admin', () => {
      req.user = { role: 'customer' };

      authMiddleware.isAdmin(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ message: 'Forbidden: Admins only.' });
    });

    it('should call next() if user is an admin', () => {
      req.user = { role: 'admin' };

      authMiddleware.isAdmin(req, res, next);

      expect(next).toHaveBeenCalled();
    });
  });

  describe('blacklistToken', () => {
    it('should add token to blacklist', () => {
      const token = 'someToken';

      authMiddleware.blacklistToken(token);

      expect(authMiddleware.blacklistToken).toBeDefined();
    });
  });
});