/*=============================================================================================================*/
/*-------------------------------------------- API routes for Payment -----------------------------------------*/
/*=============================================================================================================*/

const { Router } = require('express');
const paymentController = require('../controllers/paymentController');
const { isAdmin } = require('../middlewares/authMiddleware');

const router = Router();

router.post('/payments', paymentController.createPayment.bind(paymentController));
// router.get('/payments', isAdmin, paymentController.getAllPayments.bind(paymentController));  // during testing  
router.get('/payments', paymentController.getAllPayments.bind(paymentController));
router.get('/payments/:id', paymentController.getPaymentById.bind(paymentController));
router.put('/payments/:id', paymentController.updatePayment.bind(paymentController));
router.delete('/payments/:id', isAdmin, paymentController.deletePayment.bind(paymentController));

module.exports = router;