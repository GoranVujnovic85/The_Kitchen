/*=========================================================================================================*/
/*----------------------------------- CRUD operations for contactMessage ----------------------------------*/
/*=========================================================================================================*/

const { ContactMessage } = require("../models");
const responseHandler = require("../utils/responseHandler");

class ContactMessageController {

    async createMessage(req, res) {
        try {
            const { name, email, subject, message } = req.body;
            const newMessage = await ContactMessage.create({ name, email, subject, message, status: "new" });
            return responseHandler.successResponse(res, "Message created successfully", newMessage, 201);
        } catch (error) {
            return responseHandler.errorResponse(res, "Failed to create message", 500, error.message);
        }
    }

    async getAllMessages(req, res) {
        try {
            const messages = await ContactMessage.findAll();
            return responseHandler.successResponse(res, "Messages retrieved successfully", messages);
        } catch (error) {
            return responseHandler.errorResponse(res, "Failed to retrieve messages", 500, error.message);
        }
    }

    async getMessageById(req, res) {
        try {
            const { id } = req.params;
            const message = await ContactMessage.findByPk(id);
            if (!message) {
                return responseHandler.errorResponse(res, "Message not found", 404);
            }
            return responseHandler.successResponse(res, "Message retrieved successfully", message);
        } catch (error) {
            return responseHandler.errorResponse(res, "Failed to retrieve message", 500, error.message);
        }
    }

    async updateMessageStatus(req, res) {
        try {
            const { id } = req.params;
            const { status } = req.body;
            const message = await ContactMessage.findByPk(id);
            if (!message) {
                return responseHandler.errorResponse(res, "Message not found", 404);
            }
            message.status = status;
            await message.save();
            return responseHandler.successResponse(res, "Message status updated successfully", message);
        } catch (error) {
            return responseHandler.errorResponse(res, "Failed to update message status", 500, error.message);
        }
    }

    async deleteMessage(req, res) {
        try {
            const { id } = req.params;
            const message = await ContactMessage.findByPk(id);
            if (!message) {
                return responseHandler.errorResponse(res, "Message not found", 404);
            }
            await message.destroy();
            return responseHandler.successResponse(res, "Message deleted successfully");
        } catch (error) {
            return responseHandler.errorResponse(res, "Failed to delete message", 500, error.message);
        }
    }
}
// Create an instance of the class
module.exports = new ContactMessageController();
