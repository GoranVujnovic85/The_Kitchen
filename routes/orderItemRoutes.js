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