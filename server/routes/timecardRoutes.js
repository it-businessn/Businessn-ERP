const express = require("express");
const router = express.Router();

const timesheetController = require("../controllers/timesheetContoller");

router.get("/", timesheetController.getTimecard);

router.post("/", timesheetController.addTimecard);

module.exports = router;
