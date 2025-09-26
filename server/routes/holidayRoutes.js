const express = require("express");
const router = express.Router();

const statHolidayController = require("../controllers/statHolidayController");

router.get("/:companyName/:year", statHolidayController.getStatHoliday);

router.post("/", statHolidayController.addStatHoliday);

router.delete("/:id", statHolidayController.deleteStatHoliday);

module.exports = router;
