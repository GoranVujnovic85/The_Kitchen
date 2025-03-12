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

const PaymentController = require('../../controllers/paymentController');
const { Payment, Order } = require('../../models');
const responseHandler = require('../../utils/responseHandler');

// jest.mock to create mocks
jest.mock('../../models', () => ({
    Payment: {
        create: jest.fn(),
        findAll: jest.fn(),
        findByPk: jest.fn(),
        destroy: jest.fn(),
        update: jest.fn(),
    },
    Order: {
        findByPk: jest.fn(),
    },
}));

jest.mock('../../utils/responseHandler', () => ({
    successResponse: jest.fn(),
    errorResponse: jest.fn(),
}));

describe('PaymentController', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    // createPayment
    describe('createPayment', () => {
        it('should return 404 if order is not found', async () => {
            const req = { body: { orderId: 1, method: 'Credit Card', status: 'completed', paymentDate: '2025-03-01' } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
            Order.findByPk.mockResolvedValue(null);

            //console.log('Starting test: should return 404 if order is not found');
            //console.log('Request body:', req.body);

            await PaymentController.createPayment(req, res);

            //console.log('Error response called with:', responseHandler.errorResponse.mock.calls);

            expect(Order.findByPk).toHaveBeenCalledWith(1);
            expect(responseHandler.errorResponse).toHaveBeenCalledWith(res, 'Order not found', 404);
        });

        it('should create payment and return 201 on success', async () => {
            const req = { body: { orderId: 1, method: 'Credit Card', status: 'completed', paymentDate: '2025-03-01' } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
            const mockOrder = { id: 1 };
            const mockPayment = { id: 1, orderId: 1, method: 'Credit Card', status: 'completed', paymentDate: '2025-03-01' };
            Order.findByPk.mockResolvedValue(mockOrder);
            Payment.create.mockResolvedValue(mockPayment);

            //console.log('Request body:', req.body);

            await PaymentController.createPayment(req, res);

            //console.log('Success response called with:', responseHandler.successResponse.mock.calls);

            expect(Order.findByPk).toHaveBeenCalledWith(1);
            expect(Payment.create).toHaveBeenCalledWith({
                orderId: 1,
                method: 'Credit Card',
                status: 'completed',
                paymentDate: '2025-03-01',
            });
            expect(responseHandler.successResponse).toHaveBeenCalledWith(res, 'Payment created successfully', mockPayment, 201);
        });

        it('should return 500 if creation fails', async () => {
            const req = { body: { orderId: 1, method: 'Credit Card', status: 'completed', paymentDate: '2025-03-01' } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
            const mockOrder = { id: 1 };
            Order.findByPk.mockResolvedValue(mockOrder);
            Payment.create.mockRejectedValue(new Error('DB error'));

            //console.log('Mocked order:', mockOrder);

            await PaymentController.createPayment(req, res);

            //console.log('Response status called with:', res.status.mock.calls);

            expect(Order.findByPk).toHaveBeenCalledWith(1);
            expect(Payment.create).toHaveBeenCalledWith({
                orderId: 1,
                method: 'Credit Card',
                status: 'completed',
                paymentDate: '2025-03-01',
            });
            expect(responseHandler.errorResponse).toHaveBeenCalledWith(res, 'Error creating payment', 500, 'DB error');
        });
    });

    // getAllPayments
    describe('getAllPayments', () => {
        it('should return all payments with orders on success', async () => {
            const req = {};
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
            const mockPayments = [{ id: 1, orderId: 1 }];
            Payment.findAll.mockResolvedValue(mockPayments);

            await PaymentController.getAllPayments(req, res);

            expect(Payment.findAll).toHaveBeenCalledWith({ include: Order });
            expect(responseHandler.successResponse).toHaveBeenCalledWith(res, 'Payments retrieved successfully', mockPayments);
        });

        it('should return 500 if retrieval fails', async () => {
            const req = {};
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
            Payment.findAll.mockRejectedValue(new Error('DB error'));

            await PaymentController.getAllPayments(req, res);

            expect(Payment.findAll).toHaveBeenCalledWith({ include: Order });
            expect(responseHandler.errorResponse).toHaveBeenCalledWith(res, 'Error retrieving payments', 500, 'DB error');
        });
    });

    // getPaymentById
    describe('getPaymentById', () => {
        it('should return 404 if payment is not found', async () => {
            const req = { params: { id: 1 } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
            Payment.findByPk.mockResolvedValue(null);

            await PaymentController.getPaymentById(req, res);

            expect(Payment.findByPk).toHaveBeenCalledWith(1, { include: Order });
            expect(responseHandler.errorResponse).toHaveBeenCalledWith(res, 'Payment not found', 404);
        });

        it('should return payment with order on success', async () => {
            const req = { params: { id: 1 } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
            const mockPayment = { id: 1, orderId: 1 };
            Payment.findByPk.mockResolvedValue(mockPayment);

            await PaymentController.getPaymentById(req, res);

            expect(Payment.findByPk).toHaveBeenCalledWith(1, { include: Order });
            expect(responseHandler.successResponse).toHaveBeenCalledWith(res, 'Payment retrieved successfully', mockPayment);
        });

        it('should return 500 if retrieval fails', async () => {
            const req = { params: { id: 1 } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
            Payment.findByPk.mockRejectedValue(new Error('DB error'));

            await PaymentController.getPaymentById(req, res);

            expect(Payment.findByPk).toHaveBeenCalledWith(1, { include: Order });
            expect(responseHandler.errorResponse).toHaveBeenCalledWith(res, 'Error retrieving payment', 500, 'DB error');
        });
    });

    // updatePayment
    describe('updatePayment', () => {
        it('should return 404 if payment is not found', async () => {
            const req = { params: { id: 1 }, body: { method: 'Cash', status: 'pending', paymentDate: '2025-03-01' } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
            Payment.findByPk.mockResolvedValue(null);

            await PaymentController.updatePayment(req, res);

            expect(Payment.findByPk).toHaveBeenCalledWith(1);
            expect(responseHandler.errorResponse).toHaveBeenCalledWith(res, 'Payment not found', 404);
        });

        it('should update payment and return success', async () => {
            const req = { params: { id: 1 }, body: { method: 'Cash', status: 'pending', paymentDate: '2025-03-01' } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
            const mockPayment = {
                id: 1,
                method: 'Credit Card',
                status: 'completed',
                paymentDate: '2025-03-01',
                update: jest.fn().mockResolvedValue(),
            };
            Payment.findByPk.mockResolvedValue(mockPayment);

            await PaymentController.updatePayment(req, res);

            expect(Payment.findByPk).toHaveBeenCalledWith(1);
            expect(mockPayment.update).toHaveBeenCalledWith({
                method: 'Cash',
                status: 'pending',
                paymentDate: '2025-03-01',
            });
            expect(responseHandler.successResponse).toHaveBeenCalledWith(res, 'Payment updated successfully', mockPayment);
        });

        it('should return 500 if update fails', async () => {
            const req = { params: { id: 1 }, body: { method: 'Cash', status: 'pending', paymentDate: '2025-03-01' } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
            const mockPayment = {
                id: 1,
                update: jest.fn().mockRejectedValue(new Error('DB error')),
            };
            Payment.findByPk.mockResolvedValue(mockPayment);

            await PaymentController.updatePayment(req, res);

            expect(Payment.findByPk).toHaveBeenCalledWith(1);
            expect(mockPayment.update).toHaveBeenCalledWith({
                method: 'Cash',
                status: 'pending',
                paymentDate: '2025-03-01',
            });
            expect(responseHandler.errorResponse).toHaveBeenCalledWith(res, 'Error updating payment', 500, 'DB error');
        });
    });

    // deletePayment
    describe('deletePayment', () => {
        it('should return 404 if payment is not found', async () => {
            const req = { params: { id: 1 } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
            Payment.findByPk.mockResolvedValue(null);

            await PaymentController.deletePayment(req, res);

            expect(Payment.findByPk).toHaveBeenCalledWith(1);
            expect(responseHandler.errorResponse).toHaveBeenCalledWith(res, 'Payment not found', 404);
        });

        it('should delete payment and return success', async () => {
            const req = { params: { id: 1 } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
            const mockPayment = { id: 1, destroy: jest.fn().mockResolvedValue() };
            Payment.findByPk.mockResolvedValue(mockPayment);

            await PaymentController.deletePayment(req, res);

            expect(Payment.findByPk).toHaveBeenCalledWith(1);
            expect(mockPayment.destroy).toHaveBeenCalledTimes(1);
            expect(responseHandler.successResponse).toHaveBeenCalledWith(res, 'Payment deleted successfully');
        });

        it('should return 500 if deletion fails', async () => {
            const req = { params: { id: 1 } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
            const mockPayment = { id: 1, destroy: jest.fn().mockRejectedValue(new Error('DB error')) };
            Payment.findByPk.mockResolvedValue(mockPayment);

            await PaymentController.deletePayment(req, res);

            expect(Payment.findByPk).toHaveBeenCalledWith(1);
            expect(mockPayment.destroy).toHaveBeenCalledTimes(1);
            expect(responseHandler.errorResponse).toHaveBeenCalledWith(res, 'Error deleting payment', 500, 'DB error');
        });
    });
});