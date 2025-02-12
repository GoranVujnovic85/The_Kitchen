/**
 * The_Kitchen - Node.js backend for food ordering system
 *
 * @license MIT
 * @author Goran Vujnović
 * @year 2025
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED.
 */
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