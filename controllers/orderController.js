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
/*=========================================================================================================*/
/*----------------------------------------- CRUD operations for Order -------------------------------------*/
/*=========================================================================================================*/

const { Order, User, OrderItem, Payment } = require('../models');
const responseHandler = require('../utils/responseHandler');

class OrderController {

    // Create a new order
    async createOrder(req, res) {
        
        try {
            const { userId, date, status, totalPrice } = req.body;
            
            // Check if the user exists
            const user = await User.findByPk(userId);
            if (!user) {
                return responseHandler.errorResponse(res, 'User not found', 404);
            }
            
            const order = await Order.create({ userId, date, status, totalPrice });
            return responseHandler.successResponse(res, 'Order created successfully', order, 201);
        } catch (error) {
            return responseHandler.errorResponse(res, 'Error creating order', 500, error);
        }

    }

    // Fetch all orders
    async getAllOrders(req, res) {
        try {
            const orders = await Order.findAll({ include: [User, OrderItem, Payment] });
            return responseHandler.successResponse(res, 'Orders retrieved successfully', orders);
        } catch (error) {
            return responseHandler.errorResponse(res, 'Error retrieving orders', 500, error);
        }

    }

    // Retrieve one order by ID
    async getOrderById(req, res) {
        try {
            const { id } = req.params;
            const order = await Order.findByPk(id, { include: [User, OrderItem, Payment] });
            
            if (!order) {
                return responseHandler.errorResponse(res, 'Order not found', 404);
            }
            
            return responseHandler.successResponse(res, 'Order retrieved successfully', order);
        } catch (error) {
            return responseHandler.errorResponse(res, 'Error retrieving order', 500, error);
        }

    }

    // Update order
    async updateOrder(req, res) {
        try {
            const { id } = req.params;
            const { status, totalPrice } = req.body;
            
            const order = await Order.findByPk(id);
            if (!order) {
                return responseHandler.errorResponse(res, 'Order not found', 404);
            }
            
            await order.update({ status, totalPrice });
            return responseHandler.successResponse(res, 'Order updated successfully', order);
        } catch (error) {
            return responseHandler.errorResponse(res, 'Error updating order', 500, error);
        }

    }

    // Delete the order
    async deleteOrder(req, res) {
        try {
            const { id } = req.params;
            const order = await Order.findByPk(id);
            
            if (!order) {
                return responseHandler.errorResponse(res, 'Order not found', 404);
            }
            
            await order.destroy();
            return responseHandler.successResponse(res, 'Order deleted successfully');
        } catch (error) {
            return responseHandler.errorResponse(res, 'Error deleting order', 500, error);
        }
        
    }
}

// Create an instance of the class
module.exports = new OrderController();