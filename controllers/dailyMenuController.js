/*=========================================================================================================*/
/*-------------------------------------- CRUD operations for dailyMenu ------------------------------------*/
/*=========================================================================================================*/

const { DailyMenu, Dish } = require('../models');
const { successResponse, errorResponse } = require('../utils/responseHandler');

class DailyMenuController {

    async createDailyMenu(req, res) {
        try {
            const { date, dishIds } = req.body;

            if (!date || !dishIds || !Array.isArray(dishIds)) {
                return errorResponse(res, "Date and dishIds array are required.", 400);
            }

            // Create a new daily menu
            const dailyMenu = await DailyMenu.create({ date });

            // Adding dishes to the daily menu (connection to the Dish model) --> be careful, here it adds by ID and adds by NAME of the dish
            const dishes = await Dish.findAll({ where: { id: dishIds } });
            await dailyMenu.addDishes(dishes);

            return successResponse(res, "Daily menu created successfully.", dailyMenu, 201);
        } catch (error) {
            return errorResponse(res, "Error creating daily menu.", 500, error.message);
        }
    }

    async getAllDailyMenus(req, res) {
        try {
            const dailyMenus = await DailyMenu.findAll({
                include: [{ model: Dish, through: 'DailyMenuDishes', as: 'dishes' }],
                order: [['date', 'DESC']],
            });
            
            return successResponse(res, "Daily menus retrieved successfully.", dailyMenus);
        } catch (error) {
            return errorResponse(res, "Error retrieving daily menus.", 500, error.message);
        }
    }

    async getDailyMenuById(req, res) {
        try {
            const { id } = req.params;
            const dailyMenu = await DailyMenu.findByPk(id, {
                include: [{ model: Dish, as: 'dishes' }],
            });

            if (!dailyMenu) {
                return errorResponse(res, "Daily menu not found.", 404);
            }

            return successResponse(res, "Daily menu retrieved successfully.", dailyMenu);
        } catch (error) {
            return errorResponse(res, "Error retrieving daily menu.", 500, error.message);
        }
    }

    async updateDailyMenu(req, res) {
        try {
            const { id } = req.params;
            const { date, dishIds } = req.body;

            const dailyMenu = await DailyMenu.findByPk(id);
            if (!dailyMenu) {
                return errorResponse(res, "Daily menu not found.", 404);
            }

            // Update date
            if (date) {
                dailyMenu.date = date;
            }

            // Update the dishes in the menu
            if (dishIds && Array.isArray(dishIds)) {
                const dishes = await Dish.findAll({ where: { id: dishIds } });
                await dailyMenu.setDishes(dishes);
            }

            await dailyMenu.save();

            return successResponse(res, "Daily menu updated successfully.", dailyMenu);
        } catch (error) {
            return errorResponse(res, "Error updating daily menu.", 500, error.message);
        }
    }

    async deleteDailyMenu(req, res) {
        try {
            const { id } = req.params;
            const dailyMenu = await DailyMenu.findByPk(id);

            if (!dailyMenu) {
                return errorResponse(res, "Daily menu not found.", 404);
            }

            await dailyMenu.destroy();

            return successResponse(res, "Daily menu deleted successfully.");
        } catch (error) {
            return errorResponse(res, "Error deleting daily menu.", 500, error.message);
        }
    }
}

// Create an instance of the class
module.exports = new DailyMenuController();