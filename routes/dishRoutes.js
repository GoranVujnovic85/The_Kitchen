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
