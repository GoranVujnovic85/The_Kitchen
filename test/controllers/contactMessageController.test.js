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

const ContactMessageController = require('../../controllers/contactMessageController');
const { ContactMessage } = require('../../models');
const responseHandler = require('../../utils/responseHandler');

// Mock the models and response handlers
jest.mock('../../models', () => ({
    ContactMessage: {
        create: jest.fn(),
        findAll: jest.fn(),
        findByPk: jest.fn(),
        destroy: jest.fn(),
    },
}));

jest.mock('../../utils/responseHandler', () => ({
    successResponse: jest.fn(),
    errorResponse: jest.fn(),
}));

describe('ContactMessageController', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    // createMessage
    describe('createMessage', () => {
        it('should create message and return success', async () => {
            const mockMessage = { id: 1, name: 'John', email: 'john@example.com', subject: 'Test', message: 'Hello', status: 'new' };
            ContactMessage.create.mockResolvedValue(mockMessage);
            const req = { body: { name: 'John', email: 'john@example.com', subject: 'Test', message: 'Hello' } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            //console.log('Starting test: should create message');
            //console.log('Request body:', req.body);

            await ContactMessageController.createMessage(req, res);

            //console.log('After controller call');

            expect(ContactMessage.create).toHaveBeenCalledWith({
                name: 'John',
                email: 'john@example.com',
                subject: 'Test',
                message: 'Hello',
                status: 'new',
            });
            expect(responseHandler.successResponse).toHaveBeenCalledWith(res, 'Message created successfully', mockMessage, 201);
        });

        it('should return error if creation fails', async () => {
            ContactMessage.create.mockRejectedValue(new Error('DB error'));
            const req = { body: { name: 'John', email: 'john@example.com', subject: 'Test', message: 'Hello' } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            await ContactMessageController.createMessage(req, res);

            expect(responseHandler.errorResponse).toHaveBeenCalledWith(res, 'Failed to create message', 500, 'DB error');
        });
    });

    // getAllMessages
    describe('getAllMessages', () => {
        it('should return all messages', async () => {
            const mockMessages = [
                { id: 1, name: 'John', status: 'new' },
                { id: 2, name: 'Jane', status: 'read' },
            ];
            ContactMessage.findAll.mockResolvedValue(mockMessages);
            const req = {};
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            await ContactMessageController.getAllMessages(req, res);

            expect(ContactMessage.findAll).toHaveBeenCalled();
            expect(responseHandler.successResponse).toHaveBeenCalledWith(res, 'Messages retrieved successfully', mockMessages);
        });

        it('should return error if retrieval fails', async () => {
            ContactMessage.findAll.mockRejectedValue(new Error('DB error'));
            const req = {};
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            await ContactMessageController.getAllMessages(req, res);

            expect(responseHandler.errorResponse).toHaveBeenCalledWith(res, 'Failed to retrieve messages', 500, 'DB error');
        });
    });

    // getMessageById
    describe('getMessageById', () => {
        it('should return message by id', async () => {
            const mockMessage = { id: 1, name: 'John', status: 'new' };
            ContactMessage.findByPk.mockResolvedValue(mockMessage);
            const req = { params: { id: 1 } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            await ContactMessageController.getMessageById(req, res);

            expect(ContactMessage.findByPk).toHaveBeenCalledWith(1);
            expect(responseHandler.successResponse).toHaveBeenCalledWith(res, 'Message retrieved successfully', mockMessage);
        });

        it('should return error if message not found', async () => {
            ContactMessage.findByPk.mockResolvedValue(null);
            const req = { params: { id: 1 } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            await ContactMessageController.getMessageById(req, res);

            expect(responseHandler.errorResponse).toHaveBeenCalledWith(res, 'Message not found', 404);
        });

        it('should return error if retrieval fails', async () => {
            ContactMessage.findByPk.mockRejectedValue(new Error('DB error'));
            const req = { params: { id: 1 } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            await ContactMessageController.getMessageById(req, res);

            expect(responseHandler.errorResponse).toHaveBeenCalledWith(res, 'Failed to retrieve message', 500, 'DB error');
        });
    });

    // updateMessageStatus
    describe('updateMessageStatus', () => {
        it('should update message status and return success', async () => {
            const mockMessage = {
                id: 1,
                status: 'new',
                save: jest.fn().mockResolvedValue(),
            };
            ContactMessage.findByPk.mockResolvedValue(mockMessage);
            const req = { params: { id: 1 }, body: { status: 'read' } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            await ContactMessageController.updateMessageStatus(req, res);

            expect(ContactMessage.findByPk).toHaveBeenCalledWith(1);
            expect(mockMessage.status).toBe('read');
            expect(mockMessage.save).toHaveBeenCalled();
            expect(responseHandler.successResponse).toHaveBeenCalledWith(res, 'Message status updated successfully', mockMessage);
        });

        it('should return error if message not found', async () => {
            ContactMessage.findByPk.mockResolvedValue(null);
            const req = { params: { id: 1 }, body: { status: 'read' } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            await ContactMessageController.updateMessageStatus(req, res);

            expect(responseHandler.errorResponse).toHaveBeenCalledWith(res, 'Message not found', 404);
        });

        it('should return error if update fails', async () => {
            ContactMessage.findByPk.mockRejectedValue(new Error('DB error'));
            const req = { params: { id: 1 }, body: { status: 'read' } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            await ContactMessageController.updateMessageStatus(req, res);

            expect(responseHandler.errorResponse).toHaveBeenCalledWith(res, 'Failed to update message status', 500, 'DB error');
        });
    });

    // deleteMessage
    describe('deleteMessage', () => {
        it('should delete message and return success', async () => {
            const mockMessage = { id: 1, destroy: jest.fn().mockResolvedValue() };
            ContactMessage.findByPk.mockResolvedValue(mockMessage);
            const req = { params: { id: 1 } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            await ContactMessageController.deleteMessage(req, res);

            expect(ContactMessage.findByPk).toHaveBeenCalledWith(1);
            expect(mockMessage.destroy).toHaveBeenCalledTimes(1);
            expect(responseHandler.successResponse).toHaveBeenCalledWith(res, 'Message deleted successfully');
        });

        it('should return error if message not found', async () => {
            ContactMessage.findByPk.mockResolvedValue(null);
            const req = { params: { id: 1 } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            await ContactMessageController.deleteMessage(req, res);

            expect(responseHandler.errorResponse).toHaveBeenCalledWith(res, 'Message not found', 404);
        });

        it('should return error if deletion fails', async () => {
            const mockMessage = { id: 1, destroy: jest.fn().mockRejectedValue(new Error('DB error')) };
            ContactMessage.findByPk.mockResolvedValue(mockMessage);
            const req = { params: { id: 1 } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            await ContactMessageController.deleteMessage(req, res);

            expect(responseHandler.errorResponse).toHaveBeenCalledWith(res, 'Failed to delete message', 500, 'DB error');
        });
    });
});