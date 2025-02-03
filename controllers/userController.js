/*=======================================================================================*/
/*--------------------------------- CRUD operations for User ----------------------------*/
/*=======================================================================================*/

const { User } = require('../models');
const { successResponse, errorResponse } = require('../utils/responseHandler');

class UserController {

    async createUser(req, res) {
        try {
            const { username, email, password, role } = req.body;
            
            if (!username || !email || !password) {
                return errorResponse(res, "Name, email, and password are required.", 400);
            }

            const newUser = await User.create({ username, email, password, role });

            return successResponse(res, "User created successfully.", newUser, 201);
        } catch (error) {
            return errorResponse(res, "Error creating user.", 500, error.message);
        }
    }

    async getAllUsers(req, res) {
        try {
            const users = await User.findAll({
                order: [['createdAt', 'DESC']],
            });

            return successResponse(res, "Users retrieved successfully.", users);
        } catch (error) {
            return errorResponse(res, "Error retrieving users.", 500, error.message);
        }
    }

    async getUserById(req, res) {
        try {
            const { id } = req.params;
            const user = await User.findByPk(id);

            if (!user) {
                return errorResponse(res, "User not found.", 404);
            }

            return successResponse(res, "User retrieved successfully.", user);
        } catch (error) {
            return errorResponse(res, "Error retrieving user.", 500, error.message);
        }
    }

    async updateUser(req, res) {
        try {
            const { id } = req.params;
            const { name, email, password, role } = req.body;

            const user = await User.findByPk(id);
            if (!user) {
                return errorResponse(res, "User not found.", 404);
            }

            if (name) user.name = name;
            if (email) user.email = email;
            if (password) user.password = password;
            if (role) user.role = role;

            await user.save();

            return successResponse(res, "User updated successfully.", user);
        } catch (error) {
            return errorResponse(res, "Error updating user.", 500, error.message);
        }
    }

    async deleteUser(req, res) {
        try {
            const { id } = req.params;
            const user = await User.findByPk(id);

            if (!user) {
                return errorResponse(res, "User not found.", 404);
            }

            await user.destroy();

            return successResponse(res, "User deleted successfully.");
        } catch (error) {
            return errorResponse(res, "Error deleting user.", 500, error.message);
        }
    }
}

// Create an instance of the class
module.exports = new UserController();