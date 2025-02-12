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
/*=============================================================================================================*/
/*---------------------------------------- API routes for Feedback --------------------------------------------*/
/*=============================================================================================================*/

const { Router } = require('express');
const feedbackController = require("../controllers/feedbackController");
const { authenticateToken, isAdmin } = require('../middlewares/authMiddleware');

const publicRouter = Router();
const privateRouter = Router();

// Public routes (anyone can send feedback and view specific feedback)
publicRouter.post("/feedbacks", feedbackController.create.bind(feedbackController));
publicRouter.get("/feedbacks/:id", feedbackController.getById.bind(feedbackController));
publicRouter.get("/feedbacks", feedbackController.getAll.bind(feedbackController)); // Currently open for testing

// Private routes (only admin can update and delete feedback)
privateRouter.put("/feedbacks/:id", authenticateToken, isAdmin, feedbackController.update.bind(feedbackController));
privateRouter.delete("/feedbacks/:id", authenticateToken, isAdmin, feedbackController.delete.bind(feedbackController));

module.exports = { publicRouter, privateRouter };