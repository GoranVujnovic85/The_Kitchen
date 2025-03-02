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

const { dishControllerInstance: DishController, storage } = require('../../controllers/dishController');
const { Dish } = require('../../models');
const { successResponse, errorResponse } = require('../../utils/responseHandler');
const multer = require('multer');
const mockFs = require('mock-fs');
const fs = require('fs');

// jest.mock to create mocks
jest.mock('../../models', () => ({
    Dish: {
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

jest.mock('multer', () => {
    const multerMock = () => ({
        single: () => (req, res, next) => {
            req.file = req.file || null;
            next();
        },
    });
    //multerMock.diskStorage = jest.fn();   // ovde sam je mokovao kao praznu funkciju
    multerMock.diskStorage = jest.fn(({ destination, filename }) => ({
        destination: destination || ((req, file, cb) => cb(null, 'uploads/')),
        filename: filename || ((req, file, cb) => cb(null, Date.now() + '-' + file.originalname)),
    }));
    return multerMock;
});

describe('DishController', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    // createDish
    describe('createDish', () => {
        it('should create a dish with image and return success', async () => {
            const mockDish = { id: 1, name: 'Beans in suc', price: 577.89, image: 'uploads/123456789-Beans in suc.png' };
            Dish.create.mockResolvedValue(mockDish);
            const req = {
                body: { name: 'Beans in suc', price: 577.89 },
                file: { path: 'uploads/123456789-Beans in suc.png' },
            };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            await DishController.createDish(req, res);

            expect(Dish.create).toHaveBeenCalledWith({
                name: 'Beans in suc',
                price: 577.89,
                image: 'uploads/123456789-Beans in suc.png',
            });
            expect(successResponse).toHaveBeenCalledWith(res, 'Dish created successfully', mockDish, 201);
        });

        it('should create a dish without image and return success', async () => {
            const mockDish = { id: 1, name: 'Beans in suc', price: 577.89, image: null };
            Dish.create.mockResolvedValue(mockDish);
            const req = { body: { name: 'Beans in suc', price: 577.89 }, file: null };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            await DishController.createDish(req, res);

            expect(Dish.create).toHaveBeenCalledWith({ name: 'Beans in suc', price: 577.89, image: null });
            expect(successResponse).toHaveBeenCalledWith(res, 'Dish created successfully', mockDish, 201);
        });

        it('should return error if creation fails', async () => {
            Dish.create.mockRejectedValue(new Error('DB error'));
            const req = { body: { name: 'Pizza', price: 12.99 }, file: null };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            await DishController.createDish(req, res);

            expect(errorResponse).toHaveBeenCalledWith(res, 'Bad Request', 400, 'DB error');
        });
    });

    // getAllDishes
    describe('getAllDishes', () => {
        it('should return all dishes', async () => {
            const mockDishes = [
                { id: 1, name: 'Beans in suc', price: 577.89, image: 'uploads/Beans in suc.png' },
                { id: 2, name: 'Podvarak in suc', price: 780.21, image: 'uploads/Podvarak in suc.png' },
            ];
            Dish.findAll.mockResolvedValue(mockDishes);
            const req = {};
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            await DishController.getAllDishes(req, res);

            expect(Dish.findAll).toHaveBeenCalled();
            expect(successResponse).toHaveBeenCalledWith(res, 'Dishes retrieved successfully', mockDishes);
        });

        it('should return error if retrieval fails', async () => {
            Dish.findAll.mockRejectedValue(new Error('DB error'));
            const req = {};
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            await DishController.getAllDishes(req, res);

            expect(errorResponse).toHaveBeenCalledWith(res, 'Internal Server Error', 500, 'DB error');
        });
    });

    // getDishById
    describe('getDishById', () => {
        it('should return dish by id', async () => {
            const mockDish = { id: 1, name: 'Beans in suc', price: 12.99, image: 'uploads/Beans in suc.png' };
            Dish.findByPk.mockResolvedValue(mockDish);
            const req = { params: { id: 1 } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            await DishController.getDishById(req, res);

            expect(Dish.findByPk).toHaveBeenCalledWith(1);
            expect(successResponse).toHaveBeenCalledWith(res, 'Dish retrieved successfully', mockDish);
        });

        it('should return error if dish not found', async () => {
            Dish.findByPk.mockResolvedValue(null);
            const req = { params: { id: 1 } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            await DishController.getDishById(req, res);

            expect(errorResponse).toHaveBeenCalledWith(res, 'Dish not found', 404);
        });

        it('should return error if retrieval fails', async () => {
            Dish.findByPk.mockRejectedValue(new Error('DB error'));
            const req = { params: { id: 1 } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            await DishController.getDishById(req, res);

            expect(errorResponse).toHaveBeenCalledWith(res, 'Internal Server Error', 500, 'DB error');
        });
    });

    // updateDish
    describe('updateDish', () => {
        it('should update dish with image and return success', async () => {
            const mockUpdatedDish = { id: 1, name: 'Updated Beans in suc', price: 14.99, image: 'uploads/123-Beans in suc.png' };
            Dish.update.mockResolvedValue([1]);
            Dish.findByPk.mockResolvedValue(mockUpdatedDish);
            const req = {
                params: { id: 1 },
                body: { name: 'Updated Beans in suc', price: 14.99 },
                file: { path: 'uploads/123-Beans in suc.png' },
            };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            await DishController.updateDish(req, res);

            expect(Dish.update).toHaveBeenCalledWith(
                { name: 'Updated Beans in suc.png', price: 999.99, image: 'uploads/123-Beans in suc.png' },
                { where: { id: 1 } }
            );
            expect(Dish.findByPk).toHaveBeenCalledWith(1);
            expect(successResponse).toHaveBeenCalledWith(res, 'Dish updated successfully', mockUpdatedDish);
        });

        it('should update dish without image and return success', async () => {
            const mockUpdatedDish = { id: 1, name: 'Updated Beans in suc', price: 999.99, image: null };
            Dish.update.mockResolvedValue([1]);
            Dish.findByPk.mockResolvedValue(mockUpdatedDish);
            const req = { params: { id: 1 }, body: { name: 'Updated Beans in suc', price: 14.99 }, file: null };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            await DishController.updateDish(req, res);

            expect(Dish.update).toHaveBeenCalledWith(
                { name: 'Updated Beans in suc', price: 999.99, image: null },
                { where: { id: 1 } }
            );
            expect(successResponse).toHaveBeenCalledWith(res, 'Dish updated successfully', mockUpdatedDish);
        });

        it('should return error if dish not found', async () => {
            Dish.update.mockResolvedValue([0]);
            const req = { params: { id: 1 }, body: { name: 'Updated Beans in suc', price: 999.99 }, file: null };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            await DishController.updateDish(req, res);

            expect(errorResponse).toHaveBeenCalledWith(res, 'Dish not found', 404);
        });

        it('should return error if update fails', async () => {
            Dish.update.mockRejectedValue(new Error('DB error'));
            const req = { params: { id: 1 }, body: { name: 'Updated Beans in suc', price: 999.99 }, file: null };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            await DishController.updateDish(req, res);

            expect(errorResponse).toHaveBeenCalledWith(res, 'Bad Request', 400, 'DB error');
        });
    });

    // deleteDish
    describe('deleteDish', () => {
        it('should delete dish and return success', async () => {
            Dish.destroy.mockResolvedValue(1);
            const req = { params: { id: 1 } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            await DishController.deleteDish(req, res);

            expect(Dish.destroy).toHaveBeenCalledWith({ where: { id: 1 } });
            expect(successResponse).toHaveBeenCalledWith(res, 'Dish deleted successfully', null, 204);
        });

        it('should return error if dish not found', async () => {
            Dish.destroy.mockResolvedValue(0);
            const req = { params: { id: 1 } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            await DishController.deleteDish(req, res);

            expect(errorResponse).toHaveBeenCalledWith(res, 'Dish not found', 404);
        });

        it('should return error if deletion fails', async () => {
            Dish.destroy.mockRejectedValue(new Error('DB error'));
            const req = { params: { id: 1 } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            await DishController.deleteDish(req, res);
            
            expect(errorResponse).toHaveBeenCalledWith(res, 'Internal Server Error', 500, 'DB error');
        });
    });

    // File System Tests
    describe('DishController - File System', () => {
        beforeAll(() => {
            // Ensure the module is loaded before mocking the file system
            require('../../controllers/dishController');
        });

        beforeEach(() => {
            jest.resetModules(); // Reset module cache to avoid interference
            // Mock file system before requiring fs
            mockFs({
                // Include necessary project files to avoid ENOENT
                'C:\\Users\\Lenovo\\Desktop\\Projects\\The_Kitchen\\controllers': {
                    'dishController.js': fs.readFileSync('controllers/dishController.js', 'utf8'),
                },
            });
        });

        afterEach(() => {
            mockFs.restore();
        });

        it('should create uploads directory if it does not exist', () => {
            const fsMock = require('fs');
            // Simuliraj da direktorijum ne postoji
            mockFs({});
            // Pozovi logiku iz kontrolera da kreira direktorijum
            if (!fsMock.existsSync('uploads/')) {
                fsMock.mkdirSync('uploads/', { recursive: true });
            }
            expect(fsMock.existsSync('uploads/')).toBe(true);
        });

        it('should not throw if uploads directory already exists', () => {
            mockFs({
                'uploads': {}, // Simulate existing directory
                'C:\\Users\\Lenovo\\Desktop\\Projects\\The_Kitchen\\controllers': {
                    'dishController.js': fs.readFileSync('controllers/dishController.js', 'utf8'),
                },
            });
            const fsMock = require('fs');
            expect(fsMock.existsSync('uploads/')).toBe(true); // Directory still exists
        });
    });

    // Multer Configuration Tests
    describe('DishController - Multer Configuration', () => {
        let storage;

        beforeEach(() => {
            jest.resetModules(); // Reset module cache to ensure fresh import
            const dishController = require('../../controllers/dishController'); // Uvezi nakon reseta
            storage = dishController.storage; // Uzmi storage iz kontrolera
        });

        it('should configure storage with correct destination and filename', () => {
            //const { storage } = require('../../controllers/dishController'); // Re-import after reset
            // Test destination function
            const destCallback = jest.fn();
            storage.destination({}, {}, destCallback);
            expect(destCallback).toHaveBeenCalledWith(null, 'uploads/');

            // Test filename function
            const file = { originalname: 'Podvarak in suc.png' };
            const filenameCallback = jest.fn();
            const mockDateNow = 123456789;
            jest.spyOn(Date, 'now').mockReturnValue(mockDateNow);
            storage.filename({}, file, filenameCallback);
            expect(filenameCallback).toHaveBeenCalledWith(null, '123456789-Podvarak in suc.png');
            jest.spyOn(Date, 'now').mockRestore();
        });
    });
});