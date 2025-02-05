/*=============================================================================================================*/
/*---------------------------------------- API routes for orderItem -------------------------------------------*/
/*=============================================================================================================*/

const { Router } = require('express');
const orderItemController = require('../controllers/orderItemController');
const { authenticateToken, isAdmin } = require('../middlewares/authMiddleware');

const publicRouter = Router();
const privateRouter = Router();

// Public routes (anyone can view order items)
publicRouter.get("/order-items", orderItemController.getAll.bind(orderItemController));
publicRouter.get("/order-items/:id", orderItemController.getById.bind(orderItemController));

// Private routes (only admin can manage order items)
privateRouter.post("/order-items", authenticateToken, isAdmin, orderItemController.create.bind(orderItemController));
privateRouter.put("/order-items/:id", authenticateToken, isAdmin, orderItemController.update.bind(orderItemController));
privateRouter.delete("/order-items/:id", authenticateToken, isAdmin, orderItemController.delete.bind(orderItemController));

module.exports = { publicRouter, privateRouter };