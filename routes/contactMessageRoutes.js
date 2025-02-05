/*=================================================================================================================================*/
/*------------------------------------------------- API routes for contactMessage -------------------------------------------------*/
/*=================================================================================================================================*/

const { Router } = require('express');
const contactMessageController = require("../controllers/contactMessageController");
const { authenticateToken, isAdmin } = require('../middlewares/authMiddleware');

const publicRouter = Router();
const privateRouter = Router();

// Public route (anyone can send a message)
publicRouter.post("/messages", contactMessageController.createMessage.bind(contactMessageController));

// Private routes (only admin can access messages)
privateRouter.get("/messages", authenticateToken, isAdmin,  contactMessageController.getAllMessages.bind(contactMessageController));
privateRouter.get("/messages/:id", authenticateToken, isAdmin, contactMessageController.getMessageById.bind(contactMessageController));
privateRouter.put("/messages/:id", authenticateToken, isAdmin, contactMessageController.updateMessageStatus.bind(contactMessageController));
privateRouter.delete("/messages/:id", authenticateToken, isAdmin,  contactMessageController.deleteMessage.bind(contactMessageController));

module.exports = { publicRouter, privateRouter };