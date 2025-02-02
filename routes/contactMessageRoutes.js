/*=============================================================================================================*/
/*-------------------------------------- API routes for contactMessage ----------------------------------------*/
/*=============================================================================================================*/

const { Router } = require('express');
const contactMessageController = require("../controllers/contactMessageController");

const router = Router();

router.post("/messages", contactMessageController.createMessage.bind(contactMessageController));
router.get("/messages", contactMessageController.getAllMessages.bind(contactMessageController));
router.get("/messages/:id", contactMessageController.getMessageById.bind(contactMessageController));
router.put("/messages/:id", contactMessageController.updateMessageStatus.bind(contactMessageController));
router.delete("/messages/:id", contactMessageController.deleteMessage.bind(contactMessageController));

module.exports = router;