const express = require("express");
const router = express.Router();

const ticketController = require("../controllers/ticketController");

router.get("/:id", ticketController.getAllTickets);

router.get("/open/:id/:companyName", ticketController.getOpenTickets);

router.get("/closed/:id/:companyName", ticketController.getClosedTickets);

router.post("/", ticketController.createTicket);

router.put("/:id", ticketController.updateTicket);

module.exports = router;
