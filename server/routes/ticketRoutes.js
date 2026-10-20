const express = require("express");
const router = express.Router();

const ticketController = require("../controllers/ticketController");
const { storageSpace } = require("../services/fileService");
const { authenticateToken } = require("../middleware/auth");
const {
	authorizeMultipartCompany,
	applyCompanyParamGuards,
} = require("../middleware/authorize");

// Public support/lead ticket endpoints (no auth required — external submissions)
router.post("/support", ticketController.createSupportTicket);
router.post("/leads", ticketController.createLeadTicket);

// Everything below requires authentication. Declared as router-level middleware so
// that the :companyName param guards (which fire when a route matches) run with
// req.user populated (REV-002).
router.use(authenticateToken);
applyCompanyParamGuards(router);

router.get("/:id", ticketController.getAllTickets);
router.get("/count/:id/:companyName", ticketController.getAggregateTicketCount);
// FIX (AUD-009): attachment download was public.
router.get("/download/:filename", ticketController.downloadResource);
router.get("/open/:id/:companyName", ticketController.getOpenTickets);
router.get("/filter/:id/:companyName/:category", ticketController.getFilteredTickets);
router.get("/closed/:id/:companyName", ticketController.getClosedTickets);
router.post("/", storageSpace.single("file"), authorizeMultipartCompany, ticketController.createTicket);

// FIX (AUD-006): updateTicket requires authentication.
router.put("/:id", ticketController.updateTicket);

module.exports = router;
