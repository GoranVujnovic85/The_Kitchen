/*=============================================================================================================*/
/*----------------------------------------- API routes for dailyMenu ------------------------------------------*/
/*=============================================================================================================*/

const { Router } = require('express');
const dailyMenuController = require('../controllers/dailyMenuController');
const { isAdmin } = require('../middlewares/authMiddleware');

const router = Router();

router.post('/daily-menus', isAdmin, dailyMenuController.createDailyMenu.bind(dailyMenuController));
router.get('/daily-menus', dailyMenuController.getAllDailyMenus.bind(dailyMenuController));
router.get('/daily-menus/:id', dailyMenuController.getDailyMenuById.bind(dailyMenuController));
router.put('/daily-menus/:id', isAdmin, dailyMenuController.updateDailyMenu.bind(dailyMenuController));
router.delete('/daily-menus/:id', isAdmin, dailyMenuController.deleteDailyMenu.bind(dailyMenuController));

module.exports = router;