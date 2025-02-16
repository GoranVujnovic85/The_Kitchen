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
/*-------------------------------------------- API routes for Dish --------------------------------------------*/
/*=============================================================================================================*/

const { Router } = require('express');
const { dishControllerInstance, upload } = require('../controllers/dishController');
const { authenticateToken, isAdmin } = require('../middlewares/authMiddleware');

const publicRouter = Router();
const privateRouter = Router();

// Public routes (anyone can view dishes)
publicRouter.get('/dishes', dishControllerInstance.getAllDishes.bind(dishControllerInstance));
publicRouter.get('/dishes/:id', dishControllerInstance.getDishById.bind(dishControllerInstance));

// Private routes (only admin can manage dishes)
privateRouter.post('/dishes', authenticateToken, isAdmin, upload.single('image'), dishControllerInstance.createDish.bind(dishControllerInstance));
privateRouter.put('/dishes/:id', authenticateToken, isAdmin, upload.single('image'), dishControllerInstance.updateDish.bind(dishControllerInstance));
privateRouter.delete('/dishes/:id', authenticateToken, isAdmin, dishControllerInstance.deleteDish.bind(dishControllerInstance));

module.exports = { publicRouter, privateRouter };
