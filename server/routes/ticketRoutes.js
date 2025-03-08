const express = require("express");
const router = express.Router();

const ticketController = require("../controllers/ticketController");

router.get("/:id", ticketController.getAllTickets);

router.get("/closed/:id", ticketController.getClosedTickets);

router.post("/", ticketController.createTicket);

router.put("/:id", ticketController.updateTicket);

module.exports = router;
