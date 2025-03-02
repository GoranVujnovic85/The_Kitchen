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

const OrderItemController = require('../../controllers/orderItemController');
const { OrderItem } = require('../../models');
const { successResponse, errorResponse } = require('../../utils/responseHandler');

// jest.mock to create mocks
jest.mock('../../models', () => ({
    OrderItem: {
        create: jest.fn(),
        findAll: jest.fn(),
        findByPk: jest.fn(),
        update: jest.fn(),
        destroy: jest.fn(),
    },
}));

jest.mock('../../utils/responseHandler', () => ({
    successResponse: jest.fn(),
    errorResponse: jest.fn(),
}));

describe('OrderItemController', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    // createOrderItem
    describe('createOrderItem', () => {
        it('should create order item and return success', async () => {
            const mockOrderItem = { id: 1, orderId: 1, dishId: 1, quantity: 2, price: 10.99 };
            OrderItem.create.mockResolvedValue(mockOrderItem);
            const req = { body: { orderId: 1, dishId: 1, quantity: 2, price: 10.99 } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            await OrderItemController.create(req, res);

            expect(OrderItem.create).toHaveBeenCalledWith({ orderId: 1, dishId: 1, quantity: 2, price: 10.99 });
            expect(successResponse).toHaveBeenCalledWith(res, 'Order item created successfully', mockOrderItem, 201);
        });

        it('should return error if creation fails', async () => {
            OrderItem.create.mockRejectedValue(new Error('DB error'));
            const req = { body: { orderId: 1, dishId: 1, quantity: 2, price: 10.99 } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            await OrderItemController.create(req, res);

            expect(errorResponse).toHaveBeenCalledWith(res, 'Error creating order item', 500, expect.any(Error));
        });
    });

    // getAllOrderItem
    describe('getAllOrderItem', () => {
        it('should return all order items', async () => {
            const mockOrderItems = [
                { id: 1, orderId: 1, dishId: 1, quantity: 2, price: 10.99 },
                { id: 2, orderId: 2, dishId: 2, quantity: 1, price: 5.99 },
            ];
            OrderItem.findAll.mockResolvedValue(mockOrderItems);
            const req = {};
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            await OrderItemController.getAll(req, res);

            expect(successResponse).toHaveBeenCalledWith(res, 'All order items retrieved successfully', mockOrderItems);
        });

        it('should return error if retrieval fails', async () => {
            OrderItem.findAll.mockRejectedValue(new Error('DB error'));
            const req = {};
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            await OrderItemController.getAll(req, res);
            
            expect(errorResponse).toHaveBeenCalledWith(res, 'Error retrieving order items', 500, expect.any(Error));
        });
    });

    // getOrderItemById
    describe('getOrderItemById', () => {
        it('should return order item by id', async () => {
            const mockOrderItem = { id: 1, orderId: 1, dishId: 1, quantity: 2, price: 10.99 };
            OrderItem.findByPk.mockResolvedValue(mockOrderItem);
            const req = { params: { id: 1 } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            await OrderItemController.getById(req, res);

            expect(OrderItem.findByPk).toHaveBeenCalledWith(1);
            expect(successResponse).toHaveBeenCalledWith(res, 'Order item retrieved successfully', mockOrderItem);
        });

        it('should return error if order item not found', async () => {
            OrderItem.findByPk.mockResolvedValue(null);
            const req = { params: { id: 1 } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            await OrderItemController.getById(req, res);

            expect(errorResponse).toHaveBeenCalledWith(res, 'Order item not found', 404);
        });

        it('should return error if retrieval fails', async () => {
            OrderItem.findByPk.mockRejectedValue(new Error('DB error'));
            const req = { params: { id: 1 } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            await OrderItemController.getById(req, res);

            expect(errorResponse).toHaveBeenCalledWith(res, 'Error retrieving order item', 500, expect.any(Error));
        });
    });

    // updateOrderItem
    describe('updateOrderItem', () => {
        it('should update order item and return success', async () => {
            const mockOrderItem = {
                id: 1,
                orderId: 1,
                dishId: 1,
                quantity: 2,
                price: 10.99,
                update: jest.fn().mockResolvedValue(),
            };
            OrderItem.findByPk.mockResolvedValue(mockOrderItem);
            const req = { params: { id: 1 }, body: { quantity: 3, price: 15.99 } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            await OrderItemController.update(req, res);

            expect(mockOrderItem.update).toHaveBeenCalledWith({ quantity: 3, price: 15.99 });
            expect(successResponse).toHaveBeenCalledWith(res, 'Order item updated successfully', mockOrderItem);
        });

        it('should return error if order item not found', async () => {
            OrderItem.findByPk.mockResolvedValue(null);
            const req = { params: { id: 1 }, body: { quantity: 3, price: 15.99 } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            await OrderItemController.update(req, res);

            expect(errorResponse).toHaveBeenCalledWith(res, 'Order item not found', 404);
        });

        it('should return error if update fails', async () => {
            const mockOrderItem = {
                id: 1,
                update: jest.fn().mockRejectedValue(new Error('DB error')),
            };
            OrderItem.findByPk.mockResolvedValue(mockOrderItem);
            const req = { params: { id: 1 }, body: { quantity: 3, price: 15.99 } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            await OrderItemController.update(req, res);

            expect(errorResponse).toHaveBeenCalledWith(res, 'Error updating order item', 500, expect.any(Error));
        });
    });

    // deleteOrderItem
    describe('deleteOrderItem', () => {
        it('should delete order item and return success', async () => {
            const mockOrderItem = { id: 1, destroy: jest.fn().mockResolvedValue() };
            OrderItem.findByPk.mockResolvedValue(mockOrderItem);
            const req = { params: { id: 1 } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            await OrderItemController.delete(req, res);

            expect(mockOrderItem.destroy).toHaveBeenCalledTimes(1);
            expect(successResponse).toHaveBeenCalledWith(res, 'Order item deleted successfully');
        });

        it('should return error if order item not found', async () => {
            OrderItem.findByPk.mockResolvedValue(null);
            const req = { params: { id: 1 } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            await OrderItemController.delete(req, res);

            expect(errorResponse).toHaveBeenCalledWith(res, 'Order item not found', 404);
        });

        it('should return error if deletion fails', async () => {
            const mockOrderItem = { id: 1, destroy: jest.fn().mockRejectedValue(new Error('DB error')) };
            OrderItem.findByPk.mockResolvedValue(mockOrderItem);
            const req = { params: { id: 1 } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            await OrderItemController.delete(req, res);
            
            expect(errorResponse).toHaveBeenCalledWith(res, 'Error deleting order item', 500, expect.any(Error));
        });
    });
});