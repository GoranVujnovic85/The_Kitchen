/*=============================================================================================================*/
/*-------------------------------------------- API routes for User --------------------------------------------*/
/*=============================================================================================================*/

const { Router } = require('express');
const userController = require('../controllers/userController');
const { authenticateToken, isAdmin } = require('../middlewares/authMiddleware');
const jwt = require('jsonwebtoken');

const publicRouter = Router();
const privateRouter = Router();

// Public routes (routes available for anyone)
publicRouter.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        // Verify user credentials
        const user = await userController.authenticateUser(email, password);
  
        if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
  
        return res.json({ token });
    } catch (error) {
       // If an error occurs, return the appropriate error
        return res.status(401).json({ message: error.message });
    }
});

// Registration route for user creation
publicRouter.post('/register', userController.createUser.bind(userController)); // Registration

// Other public routes for user-related functionality
publicRouter.get('/users/:id', userController.getUserById.bind(userController));

// Private routes (authentication required)
privateRouter.get('/users', authenticateToken, userController.getAllUsers.bind(userController)); 
privateRouter.put('/users/:id', authenticateToken, userController.updateUser.bind(userController));
privateRouter.delete('/users/:id', authenticateToken, isAdmin, userController.deleteUser.bind(userController));

module.exports = { publicRouter, privateRouter };