/*=================================================================================================*/
/*---------------------------------- CRUD operations for orderItem --------------------------------*/
/*=================================================================================================*/

const { OrderItem } = require('../models');
const responseHandler = require('../utils/responseHandler');

class OrderItemController {
    constructor() {}

    async create(req, res) {
        try {
            const { orderId, dishId, quantity, price } = req.body;
            const orderItem = await OrderItem.create({ orderId, dishId, quantity, price });
            responseHandler.successResponse(res, 'Order item created successfully', orderItem, 201);
        } catch (error) {
            responseHandler.errorResponse(res, 'Error creating order item', 500, error);
        }
    }

    async getAll(req, res) {
        try {
            const orderItems = await OrderItem.findAll();
            responseHandler.successResponse(res, 'All order items retrieved successfully', orderItems);
        } catch (error) {
            responseHandler.errorResponse(res, 'Error retrieving order items', 500, error);
        }
    }

    async getById(req, res) {
        try {
            const { id } = req.params;
            const orderItem = await OrderItem.findByPk(id);
            if (!orderItem) {
                return responseHandler.errorResponse(res, 'Order item not found', 404);
            }
            responseHandler.successResponse(res, 'Order item retrieved successfully', orderItem);
        } catch (error) {
            responseHandler.errorResponse(res, 'Error retrieving order item', 500, error);
        }
    }

    async update(req, res) {
        try {
            const { id } = req.params;
            const { quantity, price } = req.body;
            const orderItem = await OrderItem.findByPk(id);
            if (!orderItem) {
                return responseHandler.errorResponse(res, 'Order item not found', 404);
            }
            await orderItem.update({ quantity, price });
            responseHandler.successResponse(res, 'Order item updated successfully', orderItem);
        } catch (error) {
            responseHandler.errorResponse(res, 'Error updating order item', 500, error);
        }
    }

    async delete(req, res) {
        try {
            const { id } = req.params;
            const orderItem = await OrderItem.findByPk(id);
            if (!orderItem) {
                return responseHandler.errorResponse(res, 'Order item not found', 404);
            }
            await orderItem.destroy();
            responseHandler.successResponse(res, 'Order item deleted successfully');
        } catch (error) {
            responseHandler.errorResponse(res, 'Error deleting order item', 500, error);
        }
    }
}

// Create an instance of the class
module.exports = new OrderItemController();