/*=================================================================================================================*/
/*--------------------------------- Main server file, initializes Express app -------------------------------------*/
/*=================================================================================================================*/

const express = require('express');
const app = express();
require('dotenv').config();
const { sequelize } = require('./config/database');                                 // Import the Sequelize instance


// Middleware
app.use(express.json());
app.use('/uploads', express.static('uploads'));                                     // Enables the display of images

// Import routes
const dishRoutes = require('./routes/dishRoutes');
const contactMessageRoutes = require("./routes/contactMessageRoutes");
const dailyMenuRoutes = require('./routes/dailyMenuRoutes');
const userRoutes = require('./routes/userRoutes');
const orderRoutes = require('./routes/orderRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const orderItemRoutes = require('./routes/orderItemRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes');



// Define API routes
app.use('/api', dishRoutes);
app.use("/api", contactMessageRoutes);
app.use('/api', dailyMenuRoutes);
app.use('/api', userRoutes);
app.use('/api', orderRoutes);
app.use('/api', paymentRoutes);
app.use('/api', orderItemRoutes);
app.use('/api', feedbackRoutes);


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