const express = require("express");
const router = express.Router();

const permissionController = require("../controllers/permissionController");

router.get("/:id/:name", permissionController.getPermissionByUserId());

router.post("/", permissionController.addPermission());

router.put("/:id", permissionController.updatePermission());

module.exports = router;
