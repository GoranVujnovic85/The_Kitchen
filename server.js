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
/*========================================================================================================================================*/
/*---------------------------------------------- Main server file, initializes Express app -----------------------------------------------*/
/*========================================================================================================================================*/

const express = require('express');
const app = express();
require('dotenv').config();
const { sequelize } = require('./config/database');                                                        // Import the Sequelize instance

// This function is used to authenticate the user using a JWT token
const { authenticateToken } = require('./middlewares/authMiddleware');   



// Middleware
app.use(express.json());
app.use('/uploads', express.static('uploads'));                                                            // Enables the display of images


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
app.use('/api/private', contactMessagePrivateRoutes);
app.use('/api/private', dailyMenuPrivateRoutes);
app.use('/api/private', dishPrivateRoutes);
app.use('/api/private', feedbackPrivateRoutes);
app.use('/api/private', orderItemPrivateRoutes);
app.use('/api/private', orderPrivateRoutes);
app.use('/api/private', paymentPrivateRoutes);
app.use('/api/private', userPrivateRoutes);  



// Test database connection before starting the server
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('Successfully connected to the database!');
  } catch (error) {
    console.error('Connection failed:', error);
    process.exit(1);                                                               // Exit the application if the database connection fails
  }
};

// Call the testConnection function
testConnection();


// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}.`);
});