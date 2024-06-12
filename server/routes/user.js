const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/auth");
const {
	changePassword,
	createEmployee,
	getAllUsers,
	loginUser,
	updateUser,
	updateUserAssignedLeads,
	getAllManagers,
	getAllMemberGroups,
	getAllEmployeesByRole,
	getAllSalesAgents,
	forgotPassword,
	resetPassword,
	setNewPassword,
	getAllCompanyUsers,
} = require("../controllers/userController");

router.post("/signup", createEmployee());
// router.post("/send-verification-email", sendVerificationCode);
router.get("/", getAllUsers());
router.get("/comp/:id", getAllCompanyUsers());
router.get("/emp-roles/:id", getAllEmployeesByRole());

router.get("/groups/:id/:name", getAllMemberGroups());
router.get("/managers/:id", getAllManagers());
router.get("/not-managers/:id", getAllSalesAgents());
router.get("/reset-password/:id/:token", resetPassword);
router.post("/forgot-password", forgotPassword());
router.post("/login", loginUser());
router.post("/reset-password/:id/:token", setNewPassword);
// router.post("/verify-email", verifyUser);
router.put("/:id", updateUser());
router.put("/change-password/:id", changePassword());
router.put("/lead/:id", updateUserAssignedLeads);

// const userController = require("../controllers/userController");

// router.get("/", userController.getUsers());

// router.post("/login", userController.login());

// router.post("/register", userController.createUser());

// router.put("/:id", userController.updateUser());

// router.put("/lead/:id", userController.updateUserAssignedLeads);

// router.put(
// 	"/change-password/:id",
// 	authMiddleware.authenticate,
// 	userController.changePassword(),
// );

module.exports = router;
