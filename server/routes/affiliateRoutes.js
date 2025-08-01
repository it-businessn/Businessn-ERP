const express = require("express");
const router = express.Router();

const affiliateProfileInfoController = require("../controllers/affiliateProfileInfoController");

router.get("/:companyName", affiliateProfileInfoController.getAllProfileInfo);

router.get("/:companyName/:empId", affiliateProfileInfoController.getEmployeeProfileInfo);

router.post("/", affiliateProfileInfoController.addAffiliateProfileInfo);

router.post("/sale", affiliateProfileInfoController.addAffiliateSale);

router.put("/:id", affiliateProfileInfoController.updateEmployeeProfileInfo);

module.exports = router;
