/*=============================================================================================================*/
/*-------------------------------------------- API routes for Dish --------------------------------------------*/
/*=============================================================================================================*/

const { Router } = require('express');
const { dishControllerInstance, upload } = require('../controllers/dishController');

const router = Router();

router.get('/dishes', dishControllerInstance.getAllDishes.bind(dishControllerInstance));
router.get('/dishes/:id', dishControllerInstance.getDishById.bind(dishControllerInstance));
router.post('/dishes', upload.single('image'), dishControllerInstance.createDish.bind(dishControllerInstance));
router.put('/dishes/:id', upload.single('image'), dishControllerInstance.updateDish.bind(dishControllerInstance));
router.delete('/dishes/:id', dishControllerInstance.deleteDish.bind(dishControllerInstance));

module.exports = router;