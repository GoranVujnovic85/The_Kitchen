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
/*===================================================================================*/
/*--------------------------- CRUD operations for Feedback --------------------------*/
/*===================================================================================*/

const { Feedback } = require('../models');
const responseHandler = require('../utils/responseHandler');

class FeedbackController {
   
    async create(req, res) {

        try {
            const { userId, dishId, rating, comment } = req.body;
            const feedback = await Feedback.create({ userId, dishId, rating, comment });
            responseHandler.successResponse(res, 'Feedback created successfully', feedback, 201);
        } catch (error) {
            responseHandler.errorResponse(res, 'Error creating feedback', 500, error);
        }

    }

    async getAll(req, res) {

        try {
            const feedbacks = await Feedback.findAll();
            responseHandler.successResponse(res, 'All feedbacks retrieved successfully', feedbacks);
        } catch (error) {
            responseHandler.errorResponse(res, 'Error retrieving feedbacks', 500, error);
        }

    }

    async getById(req, res) {

        try {
            const { id } = req.params;
            const feedback = await Feedback.findByPk(id);
            if (!feedback) {
                return responseHandler.errorResponse(res, 'Feedback not found', 404);
            }
            responseHandler.successResponse(res, 'Feedback retrieved successfully', feedback);
        } catch (error) {
            responseHandler.errorResponse(res, 'Error retrieving feedback', 500, error);
        }

    }

    async update(req, res) {

        try {
            const { id } = req.params;
            const { rating, comment } = req.body;
            const feedback = await Feedback.findByPk(id);
            if (!feedback) {
                return responseHandler.errorResponse(res, 'Feedback not found', 404);
            }
            await feedback.update({ rating, comment });
            responseHandler.successResponse(res, 'Feedback updated successfully', feedback);
        } catch (error) {
            responseHandler.errorResponse(res, 'Error updating feedback', 500, error);
        }

    }

    async delete(req, res) {

        try {
            const { id } = req.params;
            const feedback = await Feedback.findByPk(id);
            if (!feedback) {
                return responseHandler.errorResponse(res, 'Feedback not found', 404);
            }
            await feedback.destroy();
            responseHandler.successResponse(res, 'Feedback deleted successfully');
        } catch (error) {
            responseHandler.errorResponse(res, 'Error deleting feedback', 500, error);
        }
        
    }
}

// Create an instance of the class
module.exports = new FeedbackController();
