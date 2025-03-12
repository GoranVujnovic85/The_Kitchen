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

const DailyMenuController = require('../../controllers/dailyMenuController');
const { DailyMenu, Dish } = require('../../models');
const { successResponse, errorResponse } = require('../../utils/responseHandler');

// jest.mock to create mocks
jest.mock('../../models', () => ({
    DailyMenu: {
        create: jest.fn(),
        findAll: jest.fn(),
        findByPk: jest.fn(),
        destroy: jest.fn(),
    },
    Dish: {
        findAll: jest.fn(),
    },
}));

jest.mock('../../utils/responseHandler', () => ({
    successResponse: jest.fn(),
    errorResponse: jest.fn(),
}));

describe('DailyMenuController', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    // createDailyMenu
    describe('createDailyMenu', () => {
        it('should create daily menu and return success', async () => {
            const mockMenu = { id: 1, date: '2025-03-02', addDishes: jest.fn().mockResolvedValue() };
            const mockDishes = [{ id: 1 }, { id: 2 }];
            DailyMenu.create.mockResolvedValue(mockMenu);
            Dish.findAll.mockResolvedValue(mockDishes);
            
            const req = { body: { date: '2025-03-02', dishIds: [1, 2] } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            await DailyMenuController.createDailyMenu(req, res);

            expect(DailyMenu.create).toHaveBeenCalledWith({ date: '2025-03-02' });
            expect(Dish.findAll).toHaveBeenCalledWith({ where: { id: [1, 2] } });
            expect(mockMenu.addDishes).toHaveBeenCalledWith(mockDishes);
            expect(successResponse).toHaveBeenCalledWith(res, 'Daily menu created successfully.', mockMenu, 201);
        });

        it('should return error if date or dishIds missing', async () => {
            const req = { body: { dishIds: [1, 2] } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            await DailyMenuController.createDailyMenu(req, res);

            expect(errorResponse).toHaveBeenCalledWith(res, 'Date and dishIds array are required.', 400);
        });

        it('should return error if creation fails', async () => {
            DailyMenu.create.mockRejectedValue(new Error('DB error'));
            const req = { body: { date: '2025-03-02', dishIds: [1, 2] } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            await DailyMenuController.createDailyMenu(req, res);

            expect(errorResponse).toHaveBeenCalledWith(res, 'Error creating daily menu.', 500, 'DB error');
        });
    });

    // getAllDailyMenus
    describe('getAllDailyMenus', () => {
        it('should return all daily menus', async () => {
            const mockMenus = [
                { id: 1, date: '2025-03-02', dishes: [{ id: 1 }] },
                { id: 2, date: '2025-03-01', dishes: [{ id: 2 }] },
            ];
            DailyMenu.findAll.mockResolvedValue(mockMenus);
            const req = {};
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            await DailyMenuController.getAllDailyMenus(req, res);

            expect(DailyMenu.findAll).toHaveBeenCalledWith({
                include: [{ model: Dish, through: 'DailyMenuDishes', as: 'dishes' }],
                order: [['date', 'DESC']],
            });
            expect(successResponse).toHaveBeenCalledWith(res, 'Daily menus retrieved successfully.', mockMenus);
        });

        it('should return error if retrieval fails', async () => {
            DailyMenu.findAll.mockRejectedValue(new Error('DB error'));
            const req = {};
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            await DailyMenuController.getAllDailyMenus(req, res);

            expect(errorResponse).toHaveBeenCalledWith(res, 'Error retrieving daily menus.', 500, 'DB error');
        });
    });

    // getDailyMenuById
    describe('getDailyMenuById', () => {
        it('should return daily menu by id', async () => {
            const mockMenu = { id: 1, date: '2025-03-02', dishes: [{ id: 1 }] };
            DailyMenu.findByPk.mockResolvedValue(mockMenu);
            const req = { params: { id: 1 } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            await DailyMenuController.getDailyMenuById(req, res);

            expect(DailyMenu.findByPk).toHaveBeenCalledWith(1, {
                include: [{ model: Dish, as: 'dishes' }],
            });
            expect(successResponse).toHaveBeenCalledWith(res, 'Daily menu retrieved successfully.', mockMenu);
        });

        it('should return error if daily menu not found', async () => {
            DailyMenu.findByPk.mockResolvedValue(null);
            const req = { params: { id: 1 } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            await DailyMenuController.getDailyMenuById(req, res);

            expect(errorResponse).toHaveBeenCalledWith(res, 'Daily menu not found.', 404);
        });

        it('should return error if retrieval fails', async () => {
            DailyMenu.findByPk.mockRejectedValue(new Error('DB error'));
            const req = { params: { id: 1 } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            await DailyMenuController.getDailyMenuById(req, res);

            expect(errorResponse).toHaveBeenCalledWith(res, 'Error retrieving daily menu.', 500, 'DB error');
        });
    });

    // updateDailyMenu
    describe('updateDailyMenu', () => {
        it('should update daily menu and return success when updating both date and dishes', async () => {
            const mockMenu = {
                id: 1,
                date: '2025-03-02',
                setDishes: jest.fn().mockResolvedValue(),
                save: jest.fn().mockResolvedValue(),
            };
            const mockDishes = [{ id: 1 }, { id: 2 }];
            DailyMenu.findByPk.mockResolvedValue(mockMenu);
            Dish.findAll.mockResolvedValue(mockDishes);
            const req = { params: { id: 1 }, body: { date: '2025-03-03', dishIds: [1, 2] } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    
            await DailyMenuController.updateDailyMenu(req, res);
    
            expect(DailyMenu.findByPk).toHaveBeenCalledWith(1);
            expect(mockMenu.date).toBe('2025-03-03');
            expect(Dish.findAll).toHaveBeenCalledWith({ where: { id: [1, 2] } });
            expect(mockMenu.setDishes).toHaveBeenCalledWith(mockDishes);
            expect(mockMenu.save).toHaveBeenCalled();
            expect(successResponse).toHaveBeenCalledWith(res, 'Daily menu updated successfully.', mockMenu);
        });
    
        it('should update only date when dishIds not provided', async () => {
            const mockMenu = {
                id: 1,
                date: '2025-03-02',
                setDishes: jest.fn(),
                save: jest.fn().mockResolvedValue(),
            };
            DailyMenu.findByPk.mockResolvedValue(mockMenu);
            const req = { params: { id: 1 }, body: { date: '2025-03-03' } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    
            await DailyMenuController.updateDailyMenu(req, res);
    
            expect(DailyMenu.findByPk).toHaveBeenCalledWith(1);
            expect(mockMenu.date).toBe('2025-03-03');
            expect(mockMenu.setDishes).not.toHaveBeenCalled();
            expect(mockMenu.save).toHaveBeenCalled();
            expect(successResponse).toHaveBeenCalledWith(res, 'Daily menu updated successfully.', mockMenu);
        });
    
        it('should update only dishes when date not provided', async () => {
            const mockMenu = {
                id: 1,
                date: '2025-03-02',
                setDishes: jest.fn().mockResolvedValue(),
                save: jest.fn().mockResolvedValue(),
            };
            const mockDishes = [{ id: 1 }, { id: 2 }];
            DailyMenu.findByPk.mockResolvedValue(mockMenu);
            Dish.findAll.mockResolvedValue(mockDishes);
            const req = { params: { id: 1 }, body: { dishIds: [1, 2] } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    
            await DailyMenuController.updateDailyMenu(req, res);
    
            expect(DailyMenu.findByPk).toHaveBeenCalledWith(1);
            expect(mockMenu.date).toBe('2025-03-02'); // unchanged
            expect(Dish.findAll).toHaveBeenCalledWith({ where: { id: [1, 2] } });
            expect(mockMenu.setDishes).toHaveBeenCalledWith(mockDishes);
            expect(mockMenu.save).toHaveBeenCalled();
            expect(successResponse).toHaveBeenCalledWith(res, 'Daily menu updated successfully.', mockMenu);
        });
    
        it('should succeed with empty body', async () => {
            const mockMenu = {
                id: 1,
                date: '2025-03-02',
                setDishes: jest.fn(),
                save: jest.fn().mockResolvedValue(),
            };
            DailyMenu.findByPk.mockResolvedValue(mockMenu);
            const req = { params: { id: 1 }, body: {} };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    
            await DailyMenuController.updateDailyMenu(req, res);
    
            expect(DailyMenu.findByPk).toHaveBeenCalledWith(1);
            expect(mockMenu.date).toBe('2025-03-02'); // unchanged
            expect(mockMenu.setDishes).not.toHaveBeenCalled();
            expect(mockMenu.save).toHaveBeenCalled();
            expect(successResponse).toHaveBeenCalledWith(res, 'Daily menu updated successfully.', mockMenu);
        });
    
        it('should return error if daily menu not found', async () => {
            DailyMenu.findByPk.mockResolvedValue(null);
            const req = { params: { id: 1 }, body: { date: '2025-03-03' } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    
            await DailyMenuController.updateDailyMenu(req, res);
    
            expect(errorResponse).toHaveBeenCalledWith(res, 'Daily menu not found.', 404);
        });
    
        it('should return error if update fails', async () => {
            DailyMenu.findByPk.mockRejectedValue(new Error('DB error'));
            const req = { params: { id: 1 }, body: { date: '2025-03-03' } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    
            await DailyMenuController.updateDailyMenu(req, res);
    
            expect(errorResponse).toHaveBeenCalledWith(res, 'Error updating daily menu.', 500, 'DB error');
        });
    });
    

    // deleteDailyMenu
    describe('deleteDailyMenu', () => {
        it('should delete daily menu and return success', async () => {
            const mockMenu = { id: 1, destroy: jest.fn().mockResolvedValue() };
            DailyMenu.findByPk.mockResolvedValue(mockMenu);
            const req = { params: { id: 1 } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            await DailyMenuController.deleteDailyMenu(req, res);

            expect(DailyMenu.findByPk).toHaveBeenCalledWith(1);
            expect(mockMenu.destroy).toHaveBeenCalledTimes(1);
            expect(successResponse).toHaveBeenCalledWith(res, 'Daily menu deleted successfully.');
        });

        it('should return error if daily menu not found', async () => {
            DailyMenu.findByPk.mockResolvedValue(null);
            const req = { params: { id: 1 } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            await DailyMenuController.deleteDailyMenu(req, res);

            expect(errorResponse).toHaveBeenCalledWith(res, 'Daily menu not found.', 404);
        });

        it('should return error if deletion fails', async () => {
            const mockMenu = { id: 1, destroy: jest.fn().mockRejectedValue(new Error('DB error')) };
            DailyMenu.findByPk.mockResolvedValue(mockMenu);
            const req = { params: { id: 1 } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            await DailyMenuController.deleteDailyMenu(req, res);

            expect(errorResponse).toHaveBeenCalledWith(res, 'Error deleting daily menu.', 500, 'DB error');
        });
    });
});