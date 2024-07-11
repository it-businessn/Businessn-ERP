const express = require("express");
const router = express.Router();

const permissionController = require("../controllers/permissionController");

router.get("/:empId/:companyName", permissionController.getPermission);

router.post("/", permissionController.addPermission);

router.put("/:empId", permissionController.updatePermission);

module.exports = router;
