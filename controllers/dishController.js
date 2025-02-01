/*===================================================================================*/
/*------------------------------ CRUD operations for Dish ---------------------------*/
/*===================================================================================*/

const { Dish } = require('../models');
const multer = require('multer');

// Configure where and how files are stored
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');                             // Folder where images are stored
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);   // Unikatan naziv slike
  }
});

const upload = multer({ storage: storage });

class DishController {
  constructor() {}

  async getAllDishes(req, res) {
    try {
      const dishes = await Dish.findAll();
      res.json(dishes);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  async getDishById(req, res) {
    try {
      const { id } = req.params;
      const dish = await Dish.findByPk(id);
      if (!dish) {
        return res.status(404).json({ error: 'Dish not found' });
      }
      res.json(dish);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  async createDish(req, res) {
    try {
      const { name, price } = req.body;
      const imagePath = req.file ? req.file.path : null;

      const newDish = await Dish.create({ name, price, image: imagePath });
      res.status(201).json(newDish);
    } catch (error) {
      res.status(400).json({ error: 'Bad Request' });
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
        return res.status(404).json({ error: 'Dish not found' });
      }

      const updatedDish = await Dish.findByPk(id);
      res.json(updatedDish);
    } catch (error) {
      res.status(400).json({ error: 'Bad Request' });
    }
  }

  async deleteDish(req, res) {
    try {
      const { id } = req.params;
      const deleted = await Dish.destroy({ where: { id } });
      if (!deleted) {
        return res.status(404).json({ error: 'Dish not found' });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

// Create an instance of the class
const dishControllerInstance = new DishController();

module.exports = { dishControllerInstance, upload };