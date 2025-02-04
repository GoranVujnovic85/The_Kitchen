/*=============================================================================================================*/
/*-------------------------------------- API routes for contactMessage ----------------------------------------*/
/*=============================================================================================================*/

const { Router } = require('express');
const contactMessageController = require("../controllers/contactMessageController");
const { isAdmin } = require('../middlewares/authMiddleware');

const router = Router();

router.post("/messages", contactMessageController.createMessage.bind(contactMessageController));
//router.get("/messages",  isAdmin, contactMessageController.getAllMessages.bind(contactMessageController));  // during testing
router.get("/messages", contactMessageController.getAllMessages.bind(contactMessageController));
router.get("/messages/:id",  isAdmin, contactMessageController.getMessageById.bind(contactMessageController));
router.put("/messages/:id",  isAdmin, contactMessageController.updateMessageStatus.bind(contactMessageController));
router.delete("/messages/:id",  isAdmin, contactMessageController.deleteMessage.bind(contactMessageController));

module.exports = router;