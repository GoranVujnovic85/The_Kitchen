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
/*=============================================================================================*/
/*------------------------------------ CRUD operations for User -------------------------------*/
/*=============================================================================================*/

const bcrypt = require('bcrypt');
const { User } = require('../models');
const { successResponse, errorResponse } = require('../utils/responseHandler');
const jwt = require('jsonwebtoken');
const { blacklistToken } = require('../middlewares/authMiddleware');
const tokebBlacklist = new Set();


class UserController {

    // Functionality for user authentication
    async authenticateUser(email, password) {

        try {
            // Check if email and password are entered
            if (!email || !password) {
                throw new Error('Email and password are required.');
            }

            // Search for users by email
            const user = await User.findOne({ where: { email } });

            if (!user) {
                throw new Error('Invalid credentials.');
            }

            // Comparison of the entered password with the encrypted password in the database
            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                throw new Error('Invalid credentials.');
            }

            return user;  // Return the user if the data is correct
        } catch (error) {
            throw error;  // Throw an error if something goes wrong
        }

    }


    // Login functionality
    async loginUser(req, res) {

        try {
            const { email, password } = req.body;
            const user = await this.authenticateUser(email, password);

            // Update the lastLogin field to the current time
            await user.update({ lastLogin: new Date() });

            const token = jwt.sign(
                { userId: user.id, role: user.role },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );
            
            return successResponse(res, "Login successful.",  { token });
        } catch (error) {
            return errorResponse(res, error.message, 401);
        }

    }

    // Logout functionality
    async logoutUser(req, res) {

        try {
            const token = req.headers.authorization?.split(" ")[1]; // Get the token from the header

            if (!token) {
                return errorResponse(res, "No token provided", 400);
            }

            blacklistToken(token);  // Add the token to the blacklist
        
            return successResponse(res, "Logout successful.");
        } catch (error) {
            return errorResponse(res, "Error during logout.", 500, error.message);
        }
    }


    async createUser(req, res) {

        try {
            const { username, email, password, role } = req.body;
    
            if (!username || !email || !password) {
                //console.log('Missing fields detected:', { username, email, password });
                return errorResponse(res, "Name, email, and password are required.", 400);
            }
        /*
            // Checking if the user with the given username already exists
            const existingUser = await User.findOne({ where: { username } });
            if (existingUser) {
                return errorResponse(
                    res,
                    `A user named "${username}" already exists!`,
                    400
                );
            }
        */
            // Encrypt the password before saving it
            const hashedPassword = await bcrypt.hash(password, 10);
    
            const newUser = await User.create({ username, email, password: hashedPassword, role });
    
            return successResponse(res, "User created successfully.", newUser, 201);
        } catch (error) {
            return errorResponse(res, "Error creating user.", 500, error.message);
        }

    }


    async getAllUsers(req, res) {

        try {
            const users = await User.findAll({
                attributes: { exclude: ['password'] },  // Turn off the password
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
            const user = await User.findByPk(id, {
                attributes: { exclude: ['password'] }  // Turn off the password
            });

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