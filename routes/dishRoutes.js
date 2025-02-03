/*=============================================================================================================*/
/*-------------------------------------------- API routes for Dish --------------------------------------------*/
/*=============================================================================================================*/

const { Router } = require('express');
const { dishControllerInstance, upload } = require('../controllers/dishController');
const { isAdmin } = require('../middlewares/authMiddleware');

const router = Router();

router.post('/dishes', isAdmin, dishControllerInstance.createDish.bind(dishControllerInstance));
router.get('/dishes', dishControllerInstance.getAllDishes.bind(dishControllerInstance));
router.get('/dishes/:id', upload.single('image'), dishControllerInstance.getDishById.bind(dishControllerInstance));
router.put('/dishes/:id', isAdmin, upload.single('image'),dishControllerInstance.updateDish.bind(dishControllerInstance));
router.delete('/dishes/:id', isAdmin, dishControllerInstance.deleteDish.bind(dishControllerInstance));

module.exports = router;