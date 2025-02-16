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
/*=============================================================================================================*/
/*------ Role-based access control (RBAC) – Currently, all users have a role field, but the application -------*/
/*--------- does not know what it means. Authorization should be implemented in controllers so that: ----------*/
/*------------------------- A customer can only create an Order and see their orders. -------------------------*/
/*-------------------------------- Admin can see and edit all orders and users. -------------------------------*/
/*=============================================================================================================*/

const jwt = require('jsonwebtoken');
require('dotenv').config();                                                      // Load variables from .env file

module.exports = {
  authenticateToken: (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];                                   // "Bearer <token>"
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized: No token provided.' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({ message: 'Forbidden: Invalid token.' });
      }
      req.user = user;                                                                 // Add decoded user to req
      next();
    });
  },

  isCustomer: (req, res, next) => {
    if (req.user && req.user.role === 'customer') {
      return next();
    }
    return res.status(403).json({ message: 'Forbidden: Customers only.' });
  },

  isAdmin: (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
      return next();
    }
    return res.status(403).json({ message: 'Forbidden: Admins only.' });
  }
};