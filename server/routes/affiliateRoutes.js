const express = require("express");
const router = express.Router();

const affiliateProfileInfoController = require("../controllers/affiliateProfileInfoController");
const profileInfoController = require("../controllers/profileInfoController");

router.get("/:companyName", affiliateProfileInfoController.getAffiliateProfileInfo);

router.get("/:companyName/:empId", affiliateProfileInfoController.getEmployeeProfileInfo);

router.post("/", affiliateProfileInfoController.addAffiliateProfileInfo);

router.post("/sale", affiliateProfileInfoController.addAffiliateSale);

router.put("/:id", profileInfoController.updateEmployeeProfileInfo);

module.exports = router;
