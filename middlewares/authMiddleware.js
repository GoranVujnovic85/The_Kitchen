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