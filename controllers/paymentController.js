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
/*=======================================================================================*/
/*------------------------------- CRUD operations for Payment ---------------------------*/
/*=======================================================================================*/

const { Payment, Order } = require('../models');
const responseHandler = require('../utils/responseHandler');

class PaymentController {

    async createPayment(req, res) {
        
        try {
            const { orderId, method, status, paymentDate } = req.body;

            // Check if the order exists
            const order = await Order.findByPk(orderId);
            if (!order) {
                return responseHandler.errorResponse(res, 'Order not found', 404);
            }

            const payment = await Payment.create({ orderId, method, status, paymentDate });
            return responseHandler.successResponse(res, 'Payment created successfully', payment, 201);
        } catch (error) {
            return responseHandler.errorResponse(res, 'Error creating payment', 500, error.message);
        }

    }


    async getAllPayments(req, res) {

        try {
            const payments = await Payment.findAll({ include: Order });
            return responseHandler.successResponse(res, 'Payments retrieved successfully', payments);
        } catch (error) {
            return responseHandler.errorResponse(res, 'Error retrieving payments', 500, error.message);
        }

    }


    async getPaymentById(req, res) {

        try {
            const { id } = req.params;
            const payment = await Payment.findByPk(id, { include: Order });

            if (!payment) {
                return responseHandler.errorResponse(res, 'Payment not found', 404);
            }

            return responseHandler.successResponse(res, 'Payment retrieved successfully', payment);
        } catch (error) {
            return responseHandler.errorResponse(res, 'Error retrieving payment', 500, error.message);
        }

    }


    async updatePayment(req, res) {

        try {
            const { id } = req.params;
            const { method, status, paymentDate } = req.body;

            const payment = await Payment.findByPk(id);
            if (!payment) {
                return responseHandler.errorResponse(res, 'Payment not found', 404);
            }

            await payment.update({ method, status, paymentDate });
            return responseHandler.successResponse(res, 'Payment updated successfully', payment);
        } catch (error) {
            return responseHandler.errorResponse(res, 'Error updating payment', 500, error.message);
        }

    }


    async deletePayment(req, res) {

        try {
            const { id } = req.params;
            const payment = await Payment.findByPk(id);

            if (!payment) {
                return responseHandler.errorResponse(res, 'Payment not found', 404);
            }

            await payment.destroy();
            return responseHandler.successResponse(res, 'Payment deleted successfully');
        } catch (error) {
            return responseHandler.errorResponse(res, 'Error deleting payment', 500, error.message);
        }
        
    }
}

// Create an instance of the class
module.exports = new PaymentController();