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