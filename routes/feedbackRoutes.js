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