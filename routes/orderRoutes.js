/*=============================================================================================================*/
/*-------------------------------------------- API routes for Order -------------------------------------------*/
/*=============================================================================================================*/

const { Router } = require('express');
const orderController = require('../controllers/orderController');
const { isAdmin } = require('../middlewares/authMiddleware');

const router = Router();

router.post('/orders', orderController.createOrder.bind(orderController));
//router.get('/orders', isAdmin, orderController.getAllOrders.bind(orderController));      // during testing  
router.get('/orders', orderController.getAllOrders.bind(orderController));
router.get('/orders/:id', orderController.getOrderById.bind(orderController));
router.put('/orders/:id', orderController.updateOrder.bind(orderController));
router.delete('/orders/:id', isAdmin, orderController.deleteOrder.bind(orderController));

module.exports = router;