/*=============================================================================================================*/
/*-------------------------------------------- API routes for Payment -----------------------------------------*/
/*=============================================================================================================*/

const { Router } = require('express');
const paymentController = require('../controllers/paymentController');
const { authenticateToken, isAdmin } = require('../middlewares/authMiddleware');

const publicRouter = Router();
const privateRouter = Router();

// Public routes (anyone can view payments)
publicRouter.get("/payments", paymentController.getAllPayments.bind(paymentController));
publicRouter.get("/payments/:id", paymentController.getPaymentById.bind(paymentController));

// Private routes (authentication required for creation and deletion)
privateRouter.post("/payments", authenticateToken, paymentController.createPayment.bind(paymentController));
privateRouter.put("/payments/:id", authenticateToken, paymentController.updatePayment.bind(paymentController));
privateRouter.delete("/payments/:id", authenticateToken, isAdmin, paymentController.deletePayment.bind(paymentController));

module.exports = { publicRouter, privateRouter };