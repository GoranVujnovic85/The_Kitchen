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

const FeedbackController = require('../../controllers/feedbackController');
const { Feedback } = require('../../models');
const { successResponse, errorResponse } = require('../../utils/responseHandler');

// jest.mock to create mocks
jest.mock('../../models', () => ({
    Feedback: {
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

describe('FeedbackController', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    // createFeedback
    describe('createFeedback', () => {
        it('should create feedback and return success', async () => {
            const mockFeedback = { id: 1, userId: 1, dishId: 1, rating: 5, comment: 'Great dish!' };
            Feedback.create.mockResolvedValue(mockFeedback);
            const req = { body: { userId: 1, dishId: 1, rating: 5, comment: 'Great dish!' } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            await FeedbackController.create(req, res);

            expect(Feedback.create).toHaveBeenCalledWith({ userId: 1, dishId: 1, rating: 5, comment: 'Great dish!' });
            expect(successResponse).toHaveBeenCalledWith(res, 'Feedback created successfully', mockFeedback, 201);
        });

        it('should return error if creation fails', async () => {
            Feedback.create.mockRejectedValue(new Error('DB error'));
            const req = { body: { userId: 1, dishId: 1, rating: 5, comment: 'Great dish!' } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            await FeedbackController.create(req, res);

            expect(errorResponse).toHaveBeenCalledWith(res, 'Error creating feedback', 500, expect.any(Error));
        });
    });

    // getAllFeedback
    describe('getAllFeedback', () => {
        it('should return all feedbacks', async () => {
            const mockFeedbacks = [
                { id: 1, userId: 1, dishId: 1, rating: 5, comment: 'Great dish!' },
                { id: 2, userId: 2, dishId: 2, rating: 4, comment: 'Good taste' },
            ];
            Feedback.findAll.mockResolvedValue(mockFeedbacks);
            const req = {};
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            await FeedbackController.getAll(req, res);

            expect(Feedback.findAll).toHaveBeenCalled();
            expect(successResponse).toHaveBeenCalledWith(res, 'All feedbacks retrieved successfully', mockFeedbacks);
        });

        it('should return error if retrieval fails', async () => {
            Feedback.findAll.mockRejectedValue(new Error('DB error'));
            const req = {};
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            await FeedbackController.getAll(req, res);

            expect(errorResponse).toHaveBeenCalledWith(res, 'Error retrieving feedbacks', 500, expect.any(Error));
        });
    });

    // getFeedbackById
    describe('getFeedbackById', () => {
        it('should return feedback by id', async () => {
            const mockFeedback = { id: 1, userId: 1, dishId: 1, rating: 5, comment: 'Great dish!' };
            Feedback.findByPk.mockResolvedValue(mockFeedback);
            const req = { params: { id: 1 } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            await FeedbackController.getById(req, res);

            expect(Feedback.findByPk).toHaveBeenCalledWith(1);
            expect(successResponse).toHaveBeenCalledWith(res, 'Feedback retrieved successfully', mockFeedback);
        });

        it('should return error if feedback not found', async () => {
            Feedback.findByPk.mockResolvedValue(null);
            const req = { params: { id: 1 } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            await FeedbackController.getById(req, res);

            expect(errorResponse).toHaveBeenCalledWith(res, 'Feedback not found', 404);
        });

        it('should return error if retrieval fails', async () => {
            Feedback.findByPk.mockRejectedValue(new Error('DB error'));
            const req = { params: { id: 1 } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            await FeedbackController.getById(req, res);

            expect(errorResponse).toHaveBeenCalledWith(res, 'Error retrieving feedback', 500, expect.any(Error));
        });
    });

    // updateFeedback
    describe('updateFeedback', () => {
        it('should update feedback and return success', async () => {
            const mockFeedback = {
                id: 1,
                userId: 1,
                dishId: 1,
                rating: 5,
                comment: 'Great dish!',
                update: jest.fn().mockResolvedValue(),
            };
            Feedback.findByPk.mockResolvedValue(mockFeedback);
            const req = { params: { id: 1 }, body: { rating: 4, comment: 'Good dish!' } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            await FeedbackController.update(req, res);

            expect(Feedback.findByPk).toHaveBeenCalledWith(1);
            expect(mockFeedback.update).toHaveBeenCalledWith({ rating: 4, comment: 'Good dish!' });
            expect(successResponse).toHaveBeenCalledWith(res, 'Feedback updated successfully', mockFeedback);
        });

        it('should return error if feedback not found', async () => {
            Feedback.findByPk.mockResolvedValue(null);
            const req = { params: { id: 1 }, body: { rating: 4, comment: 'Good dish!' } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            await FeedbackController.update(req, res);

            expect(errorResponse).toHaveBeenCalledWith(res, 'Feedback not found', 404);
        });

        it('should return error if update fails', async () => {
            const mockFeedback = {
                id: 1,
                update: jest.fn().mockRejectedValue(new Error('DB error')),
            };
            Feedback.findByPk.mockResolvedValue(mockFeedback);
            const req = { params: { id: 1 }, body: { rating: 4, comment: 'Good dish!' } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            await FeedbackController.update(req, res);

            expect(errorResponse).toHaveBeenCalledWith(res, 'Error updating feedback', 500, expect.any(Error));
        });
    });

    // deleteFeedback
    describe('deleteFeedback', () => {
        it('should delete feedback and return success', async () => {
            const mockFeedback = { id: 1, destroy: jest.fn().mockResolvedValue() };
            Feedback.findByPk.mockResolvedValue(mockFeedback);
            const req = { params: { id: 1 } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            await FeedbackController.delete(req, res);

            expect(Feedback.findByPk).toHaveBeenCalledWith(1);
            expect(mockFeedback.destroy).toHaveBeenCalledTimes(1);
            expect(successResponse).toHaveBeenCalledWith(res, 'Feedback deleted successfully');
        });

        it('should return error if feedback not found', async () => {
            Feedback.findByPk.mockResolvedValue(null);
            const req = { params: { id: 1 } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            await FeedbackController.delete(req, res);

            expect(errorResponse).toHaveBeenCalledWith(res, 'Feedback not found', 404);
        });

        it('should return error if deletion fails', async () => {
            const mockFeedback = { id: 1, destroy: jest.fn().mockRejectedValue(new Error('DB error')) };
            Feedback.findByPk.mockResolvedValue(mockFeedback);
            const req = { params: { id: 1 } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            await FeedbackController.delete(req, res);
            
            expect(errorResponse).toHaveBeenCalledWith(res, 'Error deleting feedback', 500, expect.any(Error));
        });
    });
});