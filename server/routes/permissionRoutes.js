const express = require("express");
const router = express.Router();

const permissionController = require("../controllers/permissionController");
const { requireRole, ROLE_GROUPS } = require("../middleware/rbac");

router.get("/:empId/:companyName", permissionController.getPermission);

// AUD-028: permission writes are admin level (client isAdminLevelRole).
const adminOnly = requireRole(ROLE_GROUPS.ADMIN_LEVEL);
router.post("/", adminOnly, permissionController.addPermission);

router.put("/:empId", adminOnly, permissionController.updatePermission);

module.exports = router;
