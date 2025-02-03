/*=============================================================================================================*/
/*-------------------------------------------- API routes for User --------------------------------------------*/
/*=============================================================================================================*/

const { Router } = require('express');
const userController = require('../controllers/userController');

const router = Router();

router.post('/users', userController.createUser.bind(userController));
router.get('/users', userController.getAllUsers.bind(userController));
router.get('/users/:id', userController.getUserById.bind(userController));
router.put('/users/:id', userController.updateUser.bind(userController));
router.delete('/users/:id', userController.deleteUser.bind(userController));

module.exports = router;