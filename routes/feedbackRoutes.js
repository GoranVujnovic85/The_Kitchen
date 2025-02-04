/*=============================================================================================================*/
/*---------------------------------------- API routes for Feedback --------------------------------------------*/
/*=============================================================================================================*/

const { Router } = require('express');
const feedbackController = require("../controllers/feedbackController");
const { isAdmin } = require('../middlewares/authMiddleware');

const router = Router();

router.post("/feedbacks", feedbackController.create.bind(feedbackController));
router.get("/feedbacks/:id", feedbackController.getById.bind(feedbackController));
//router.get("/feedbacks", isAdmin, feedbackController.getAll.bind(feedbackController));    // during testing
router.get("/feedbacks", feedbackController.getAll.bind(feedbackController));
router.put("/feedbacks/:id", isAdmin, feedbackController.update.bind(feedbackController));
router.delete("/feedbacks/:id", isAdmin, feedbackController.delete.bind(feedbackController));

module.exports = router;