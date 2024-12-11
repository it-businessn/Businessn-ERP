const express = require("express");
const router = express.Router();

// const authMiddleware = require("../middleware/auth");

const appController = require("../controllers/appController");
const { authenticateToken } = require("../middleware/auth");

router.post("/signup", appController.signUp);
router.post("/refresh-token", appController.refreshToken);
router.post("/login", appController.login);
router.get("/logout/:id", authenticateToken, appController.logOut);
router.get("/reset-password/:id/:token", authenticateToken, appController.resetPassword);
router.post("/forgot-password", authenticateToken, appController.forgotPassword);
router.post("/reset-password/:id/:token", authenticateToken, appController.setNewPassword);
router.put("/change-password/:id", authenticateToken, appController.changePassword);

// const userController = require("../controllers/userController");
// router.get("/", userController.getUsers);
// router.post("/login", userController.login);
// router.post("/register", userController.createUser);
// router.post("/send-verification-email", sendVerificationCode);
// router.post("/verify-email", verifyUser);
// router.put( "/change-password/:userId", authMiddleware.authenticate,userController.changePassword);
// router.put("/:id", userController.updateUser);
// router.put("/lead/:id", userController.updateUserAssignedLeads);

module.exports = router;
