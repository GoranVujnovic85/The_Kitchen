/*=============================================================================================================*/
/*-------------------------------------------- API routes for Order -------------------------------------------*/
/*=============================================================================================================*/

const { Router } = require('express');
const orderController = require('../controllers/orderController');
const { authenticateToken, isAdmin } = require('../middlewares/authMiddleware');

const publicRouter = Router();
const privateRouter = Router();

// Public routes (anyone can view orders)
publicRouter.get("/orders", orderController.getAllOrders.bind(orderController));
publicRouter.get("/orders/:id", orderController.getOrderById.bind(orderController));

// Private routes (only admin can manage orders)
privateRouter.post("/orders", authenticateToken, orderController.createOrder.bind(orderController));
privateRouter.put("/orders/:id", authenticateToken, orderController.updateOrder.bind(orderController));
privateRouter.delete("/orders/:id", authenticateToken, isAdmin, orderController.deleteOrder.bind(orderController));

module.exports = { publicRouter, privateRouter };