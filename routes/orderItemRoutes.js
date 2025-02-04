/*=============================================================================================================*/
/*---------------------------------------- API routes for orderItem -------------------------------------------*/
/*=============================================================================================================*/

const { Router } = require('express');
const orderItemController = require('../controllers/orderItemController');
const { isAdmin } = require('../middlewares/authMiddleware');

const router = Router();

router.post('/order-items', isAdmin, orderItemController.create.bind(orderItemController));
router.get('/order-items', orderItemController.getAll.bind(orderItemController));
router.get('/order-items/:id', orderItemController.getById.bind(orderItemController));
router.put('/order-items/:id', isAdmin, orderItemController.update.bind(orderItemController));
router.delete('/order-items/:id', isAdmin, orderItemController.delete.bind(orderItemController));

module.exports = router;