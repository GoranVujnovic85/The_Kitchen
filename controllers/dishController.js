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
/*------------------------------ CRUD operations for Dish ---------------------------*/
/*===================================================================================*/

const { Dish } = require('../models');
const { successResponse, errorResponse } = require('../utils/responseHandler');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

// Ensure uploads directory exists
const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure where and how files are stored
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');                             // Folder where images are stored
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);   // Unique image name
  }
});

const upload = multer({ storage: storage });

class DishController {

  async createDish(req, res) {

    try {
      const { name, description, price, image } = req.body;
      const imagePath = req.file ? req.file.path : null;

      // Check if a dish with the same name already exists
    const existingDish = await Dish.findOne({ where: { name } });
    if (existingDish) {
      return errorResponse(res, 'Dish with this name already exists', 400);
    }

      const newDish = await Dish.create({ name, description, price, image: imagePath });
      return successResponse(res, 'Dish created successfully', newDish, 201);
    } catch (error) {
      return errorResponse(res, 'Bad Request', 400, error.message);
    }
  }
  
  async getAllDishes(req, res) {

    try {
      const dishes = await Dish.findAll();
      return successResponse(res, 'Dishes retrieved successfully', dishes);
    } catch (error) {
      return errorResponse(res, 'Internal Server Error', 500, error.message);
    }
  }

  async getDishById(req, res) {

    try {
      const { id } = req.params;
      const dish = await Dish.findByPk(id);
      if (!dish) {
        return errorResponse(res, 'Dish not found', 404);
      }
      return successResponse(res, 'Dish retrieved successfully', dish);
    } catch (error) {
      return errorResponse(res, 'Internal Server Error', 500, error.message);
    }
  }

  async updateDish(req, res) {

    try {
      const { id } = req.params;
      const { name, price } = req.body;
      const imagePath = req.file ? req.file.path : null;

      const [updated] = await Dish.update(
        { name, price, image: imagePath },
        { where: { id } }
      );

      if (!updated) {
        return errorResponse(res, 'Dish not found', 404);
      }

      const updatedDish = await Dish.findByPk(id);
      return successResponse(res, 'Dish updated successfully', updatedDish);
    } catch (error) {
      return errorResponse(res, 'Bad Request', 400, error.message);
    }
  }

  async deleteDish(req, res) {
    
    try {
      const { id } = req.params;
      const deleted = await Dish.destroy({ where: { id } });
      if (!deleted) {
        return errorResponse(res, 'Dish not found', 404);
      }
      return successResponse(res, 'Dish deleted successfully', null, 204);
    } catch (error) {
      return errorResponse(res, 'Internal Server Error', 500, error.message);
    }
  }
}

const dishControllerInstance = new DishController();

module.exports = { dishControllerInstance, upload, storage };