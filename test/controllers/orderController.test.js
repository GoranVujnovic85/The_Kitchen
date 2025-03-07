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

const OrderController = require('../../controllers/orderController');
const { Order, User, OrderItem, Payment } = require('../../models');
const { successResponse, errorResponse } = require('../../utils/responseHandler');

// jest.mock to create mocks
jest.mock('../../models', () => ({
    Order: {
        create: jest.fn(),
        findAll: jest.fn(),
        findByPk: jest.fn(),
        update: jest.fn(),
        destroy: jest.fn(),
    },
    User: {
        findByPk: jest.fn(),
    },
    OrderItem: jest.fn(), 
    Payment: jest.fn(),   
}));

jest.mock('../../utils/responseHandler', () => ({
    successResponse: jest.fn(),
    errorResponse: jest.fn(),
}));

describe('OrderController', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    // createOrder
    describe('createOrder', () => {
        it('should create an order and return success if user exists', async () => {
            const mockUser = { id: 1, username: 'testuser' };
            const mockOrder = { id: 1, userId: 1, date: '2025-03-01', status: 'pending', totalPrice: 50.00 };
            User.findByPk.mockResolvedValue(mockUser);
            Order.create.mockResolvedValue(mockOrder);
            const req = { body: { userId: 1, date: '2025-03-01', status: 'pending', totalPrice: 50.00 } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            await OrderController.createOrder(req, res);

            expect(User.findByPk).toHaveBeenCalledWith(1);
            expect(Order.create).toHaveBeenCalledWith({ userId: 1, date: '2025-03-01', status: 'pending', totalPrice: 50.00 });
            expect(successResponse).toHaveBeenCalledWith(res, 'Order created successfully', mockOrder, 201);
        });

        it('should return error if user is not found', async () => {
            User.findByPk.mockResolvedValue(null);
            const req = { body: { userId: 1, date: '2025-03-01', status: 'pending', totalPrice: 50.00 } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            await OrderController.createOrder(req, res);

            expect(User.findByPk).toHaveBeenCalledWith(1);
            expect(errorResponse).toHaveBeenCalledWith(res, 'User not found', 404);
        });

        it('should return error if creation fails', async () => {
            const mockUser = { id: 1, username: 'testuser' };
            User.findByPk.mockResolvedValue(mockUser);
            Order.create.mockRejectedValue(new Error('DB error'));
            const req = { body: { userId: 1, date: '2025-03-01', status: 'pending', totalPrice: 50.00 } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            await OrderController.createOrder(req, res);

            expect(errorResponse).toHaveBeenCalledWith(res, 'Error creating order', 500, expect.any(Error));
        });
    });

    // getAllOrders
    describe('getAllOrders', () => {
        it('should return all orders with associations', async () => {
            const mockOrders = [
                { id: 1, userId: 1, status: 'pending', totalPrice: 50.00 },
                { id: 2, userId: 2, status: 'completed', totalPrice: 75.00 },
            ];
            Order.findAll.mockResolvedValue(mockOrders);
            const req = {};
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            await OrderController.getAllOrders(req, res);

            expect(Order.findAll).toHaveBeenCalledWith({ include: [User, OrderItem, Payment] });
            expect(successResponse).toHaveBeenCalledWith(res, 'Orders retrieved successfully', mockOrders);
        });

        it('should return error if retrieval fails', async () => {
            Order.findAll.mockRejectedValue(new Error('DB error'));
            const req = {};
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            await OrderController.getAllOrders(req, res);

            expect(errorResponse).toHaveBeenCalledWith(res, 'Error retrieving orders', 500, expect.any(Error));
        });
    });

    // getOrderById
    describe('getOrderById', () => {
        it('should return order by id with associations', async () => {
            const mockOrder = { id: 1, userId: 1, status: 'pending', totalPrice: 50.00 };
            Order.findByPk.mockResolvedValue(mockOrder);
            const req = { params: { id: 1 } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            await OrderController.getOrderById(req, res);

            expect(Order.findByPk).toHaveBeenCalledWith(1, { include: [User, OrderItem, Payment] });
            expect(successResponse).toHaveBeenCalledWith(res, 'Order retrieved successfully', mockOrder);
        });

        it('should return error if order not found', async () => {
            Order.findByPk.mockResolvedValue(null);
            const req = { params: { id: 1 } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            await OrderController.getOrderById(req, res);

            expect(errorResponse).toHaveBeenCalledWith(res, 'Order not found', 404);
        });

        it('should return error if retrieval fails', async () => {
            Order.findByPk.mockRejectedValue(new Error('DB error'));
            const req = { params: { id: 1 } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            await OrderController.getOrderById(req, res);

            expect(errorResponse).toHaveBeenCalledWith(res, 'Error retrieving order', 500, expect.any(Error));
        });
    });

    // updateOrder
    describe('updateOrder', () => {
        it('should update order and return success', async () => {
            const mockOrder = {
                id: 1,
                userId: 1,
                status: 'pending',
                totalPrice: 50.00,
                update: jest.fn().mockResolvedValue(),
            };
            Order.findByPk.mockResolvedValue(mockOrder);
            const req = { params: { id: 1 }, body: { status: 'completed', totalPrice: 60.00 } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            await OrderController.updateOrder(req, res);

            expect(Order.findByPk).toHaveBeenCalledWith(1);
            expect(mockOrder.update).toHaveBeenCalledWith({ status: 'completed', totalPrice: 60.00 });
            expect(successResponse).toHaveBeenCalledWith(res, 'Order updated successfully', mockOrder);
        });

        it('should return error if order not found', async () => {
            Order.findByPk.mockResolvedValue(null);
            const req = { params: { id: 1 }, body: { status: 'completed', totalPrice: 60.00 } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            await OrderController.updateOrder(req, res);

            expect(errorResponse).toHaveBeenCalledWith(res, 'Order not found', 404);
        });

        it('should return error if update fails', async () => {
            const mockOrder = {
                id: 1,
                update: jest.fn().mockRejectedValue(new Error('DB error')),
            };
            Order.findByPk.mockResolvedValue(mockOrder);
            const req = { params: { id: 1 }, body: { status: 'completed', totalPrice: 60.00 } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            await OrderController.updateOrder(req, res);

            expect(errorResponse).toHaveBeenCalledWith(res, 'Error updating order', 500, expect.any(Error));
        });
    });

    // deleteOrder
    describe('deleteOrder', () => {
        it('should delete order and return success', async () => {
            const mockOrder = { id: 1, destroy: jest.fn().mockResolvedValue() };
            Order.findByPk.mockResolvedValue(mockOrder);
            const req = { params: { id: 1 } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            await OrderController.deleteOrder(req, res);

            expect(Order.findByPk).toHaveBeenCalledWith(1);
            expect(mockOrder.destroy).toHaveBeenCalledTimes(1);
            expect(successResponse).toHaveBeenCalledWith(res, 'Order deleted successfully');
        });

        it('should return error if order not found', async () => {
            Order.findByPk.mockResolvedValue(null);
            const req = { params: { id: 1 } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            await OrderController.deleteOrder(req, res);

            expect(errorResponse).toHaveBeenCalledWith(res, 'Order not found', 404);
        });

        it('should return error if deletion fails', async () => {
            const mockOrder = { id: 1, destroy: jest.fn().mockRejectedValue(new Error('DB error')) };
            Order.findByPk.mockResolvedValue(mockOrder);
            const req = { params: { id: 1 } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            await OrderController.deleteOrder(req, res);

            expect(errorResponse).toHaveBeenCalledWith(res, 'Error deleting order', 500, expect.any(Error));
        });
    });
});