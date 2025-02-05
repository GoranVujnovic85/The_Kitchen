/*========================================================================================================================================*/
/*---------------------------------------------- Main server file, initializes Express app -----------------------------------------------*/
/*========================================================================================================================================*/

const express = require('express');
const app = express();
require('dotenv').config();
const { sequelize } = require('./config/database');                                 // Import the Sequelize instance

// This function is used to authenticate the user using a JWT token
const { authenticateToken } = require('./middlewares/authMiddleware');   



// Middleware
app.use(express.json());
app.use('/uploads', express.static('uploads'));                                     // Enables the display of images


// Import routes
const { publicRouter: contactMessagePublicRoutes, privateRouter: contactMessagePrivateRoutes } = require("./routes/contactMessageRoutes");
const { publicRouter: dailyMenuPublicRoutes, privateRouter: dailyMenuPrivateRoutes } = require("./routes/dailyMenuRoutes");
const { publicRouter: dishPublicRoutes, privateRouter: dishPrivateRoutes } = require("./routes/dishRoutes");
const { publicRouter: feedbackPublicRoutes, privateRouter: feedbackPrivateRoutes } = require("./routes/feedbackRoutes");
const { publicRouter: orderItemPublicRoutes, privateRouter: orderItemPrivateRoutes } = require("./routes/orderItemRoutes");
const { publicRouter: orderPublicRoutes, privateRouter: orderPrivateRoutes } = require("./routes/orderRoutes");
const { publicRouter: paymentPublicRoutes, privateRouter: paymentPrivateRoutes } = require("./routes/paymentRoutes");
const { publicRouter: userPublicRoutes, privateRouter: userPrivateRoutes } = require('./routes/userRoutes');



// Public routes (no authentication needed)
app.use('/api/public', contactMessagePublicRoutes);
app.use('/api/public', dailyMenuPublicRoutes);
app.use('/api/public', dishPublicRoutes);
app.use('/api/public', feedbackPublicRoutes);
app.use('/api/public', orderItemPublicRoutes);
app.use('/api/public', orderPublicRoutes);
app.use('/api/public', paymentPublicRoutes);
app.use('/api/public', userPublicRoutes);   


// Private routes (authentication required)
app.use('/api/private', authenticateToken, contactMessagePrivateRoutes);
app.use('/api/private', authenticateToken, dailyMenuPrivateRoutes);
app.use('/api/private', authenticateToken, dishPrivateRoutes);
app.use('/api/private', authenticateToken, feedbackPrivateRoutes);
app.use('/api/private', authenticateToken, orderItemPrivateRoutes);
app.use('/api/private', authenticateToken, orderPrivateRoutes);
app.use('/api/private', authenticateToken, paymentPrivateRoutes);
app.use('/api/private', authenticateToken, userPrivateRoutes);  



// Test database connection before starting the server
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('Successfully connected to the database!');
  } catch (error) {
    console.error('Connection failed:', error);
    process.exit(1);                                          // Exit the application if the database connection fails
  }
};

// Call the testConnection function
testConnection();


// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}.`);
});