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
/*----------------------------------------- API routes for dailyMenu ------------------------------------------*/
/*=============================================================================================================*/

const { Router } = require('express');
const dailyMenuController = require('../controllers/dailyMenuController');
const { authenticateToken, isAdmin } = require('../middlewares/authMiddleware');

const publicRouter = Router();
const privateRouter = Router();

// Public routes (anyone can view daily menus)
publicRouter.get('/daily-menus', dailyMenuController.getAllDailyMenus.bind(dailyMenuController));
publicRouter.get('/daily-menus/:id', dailyMenuController.getDailyMenuById.bind(dailyMenuController));

// Private routes (only admin can create, update, or delete daily menus)
privateRouter.post('/daily-menus', authenticateToken, isAdmin, dailyMenuController.createDailyMenu.bind(dailyMenuController));
privateRouter.put('/daily-menus/:id', authenticateToken, isAdmin, dailyMenuController.updateDailyMenu.bind(dailyMenuController));
privateRouter.delete('/daily-menus/:id', authenticateToken, isAdmin, dailyMenuController.deleteDailyMenu.bind(dailyMenuController));

module.exports = { publicRouter, privateRouter };