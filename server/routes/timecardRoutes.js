const express = require("express");
const router = express.Router();

const timecardController = require("../controllers/timecardController");
const { authenticateToken } = require("../middleware/auth");
const { authenticateTimecardDevice } = require("../middleware/deviceAuth");
const {
	authorizeCompanyAccess,
	authorizeEntryCompanies,
	requireCompanyMembership,
} = require("../middleware/authorize");
const { COMPANIES } = require("../constants/constant");

// AUD-013: device ingest. Device key (x-device-key, TIMECARD_DEVICE_KEYS) or a
// user bearer token; open when TIMECARD_DEVICE_KEYS is unset (backward compatible).
router.post("/", authenticateTimecardDevice, timecardController.createTimecard);

// AUD-013: every other time-card route is used by the web UI only: require a
// user token and tenant membership (:companyName is checked by
// applyCompanyParamGuards in app.js).
router.use(authenticateToken, authorizeCompanyAccess);

router.get("/:companyName/:filter", timecardController.getTimecard);

// These list/update one hard-wired company's TAD users (COMPANIES.NW).
router.get("/tad-users", requireCompanyMembership(COMPANIES.NW), timecardController.getTADUsers);

router.get(
	"/tad-filtered-users",
	requireCompanyMembership(COMPANIES.NW),
	timecardController.getFilteredTADUsers,
);

router.post("/manual", authorizeEntryCompanies, timecardController.createTimecardManual);

module.exports = router;
