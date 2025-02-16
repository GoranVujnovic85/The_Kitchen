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