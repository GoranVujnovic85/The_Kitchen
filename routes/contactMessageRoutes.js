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