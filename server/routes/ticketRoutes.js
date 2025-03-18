const express = require("express");
const router = express.Router();

const ticketController = require("../controllers/ticketController");
const { storageSpace } = require("../services/fileService");
const { authenticateToken } = require("../middleware/auth");

router.get("/:id", authenticateToken, ticketController.getAllTickets);

router.get("/download/:filename", ticketController.downloadResource);

router.get("/open/:id/:companyName", authenticateToken, ticketController.getOpenTickets);

router.get("/closed/:id/:companyName", authenticateToken, ticketController.getClosedTickets);

router.post("/", authenticateToken, storageSpace.single("file"), ticketController.createTicket);

router.put("/:id", authenticateToken, ticketController.updateTicket);

module.exports = router;
