const express = require("express");
const router = express.Router();

// const authMiddleware = require("../middleware/auth");

const appController = require("../controllers/appController");

router.post("/signup", appController.signUp());
router.post("/login", appController.login());
router.get("/logout/:id", appController.logOut());
router.get("/reset-password/:id/:token", appController.resetPassword);
router.post("/forgot-password", appController.forgotPassword());
router.post("/reset-password/:id/:token", appController.setNewPassword);
router.put("/change-password/:id", appController.changePassword());

// const userController = require("../controllers/userController");
// router.get("/", userController.getUsers());
// router.post("/login", userController.login());
// router.post("/register", userController.createUser());
// router.post("/send-verification-email", sendVerificationCode);
// router.post("/verify-email", verifyUser);
// router.put( "/change-password/:id", authMiddleware.authenticate,userController.changePassword());
// router.put("/:id", userController.updateUser());
// router.put("/lead/:id", userController.updateUserAssignedLeads);

module.exports = router;
