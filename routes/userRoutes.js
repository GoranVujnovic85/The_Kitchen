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
/*-------------------------------------------- API routes for User --------------------------------------------*/
/*=============================================================================================================*/

const { Router } = require('express');
const userController = require('../controllers/userController');
const { authenticateToken, isAdmin } = require('../middlewares/authMiddleware');


const publicRouter = Router();
const privateRouter = Router();

// Public routes (anyone can login, register)
publicRouter.post('/login', userController.loginUser.bind(userController));
publicRouter.post('/register', userController.createUser.bind(userController)); 
publicRouter.get('/users/:id', userController.getUserById.bind(userController));

// Private routes (authentication required)
privateRouter.get('/users', authenticateToken, userController.getAllUsers.bind(userController)); 
privateRouter.put('/users/:id', authenticateToken, userController.updateUser.bind(userController));
privateRouter.delete('/users/:id', authenticateToken, isAdmin, userController.deleteUser.bind(userController));

module.exports = { publicRouter, privateRouter };