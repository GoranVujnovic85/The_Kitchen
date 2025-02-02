/*=============================================================================================================*/
/*-------------------------------------------- API routes for Dish --------------------------------------------*/
/*=============================================================================================================*/

const { Router } = require('express');
const { dishControllerInstance, upload } = require('../controllers/dishController');

const router = Router();

router.post('/dishes', dishControllerInstance.createDish.bind(dishControllerInstance));
router.get('/dishes', dishControllerInstance.getAllDishes.bind(dishControllerInstance));
router.get('/dishes/:id', upload.single('image'), dishControllerInstance.getDishById.bind(dishControllerInstance));
router.put('/dishes/:id', upload.single('image'),dishControllerInstance.updateDish.bind(dishControllerInstance));
router.delete('/dishes/:id', dishControllerInstance.deleteDish.bind(dishControllerInstance));

module.exports = router;