/*=============================================================================================================*/
/*----------------------------------------- API routes for dailyMenu ------------------------------------------*/
/*=============================================================================================================*/

const { Router } = require('express');
const dailyMenuController = require('../controllers/dailyMenuController');

const router = Router();

router.post('/daily-menus', dailyMenuController.createDailyMenu.bind(dailyMenuController));
router.get('/daily-menus', dailyMenuController.getAllDailyMenus.bind(dailyMenuController));
router.get('/daily-menus/:id', dailyMenuController.getDailyMenuById.bind(dailyMenuController));
router.put('/daily-menus/:id', dailyMenuController.updateDailyMenu.bind(dailyMenuController));
router.delete('/daily-menus/:id', dailyMenuController.deleteDailyMenu.bind(dailyMenuController));

module.exports = router;