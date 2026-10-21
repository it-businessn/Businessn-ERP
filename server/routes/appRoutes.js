const express = require("express");
const router = express.Router();

const appController = require("../controllers/appController");
const passwordController = require("../controllers/passwordController");
const { authenticateToken } = require("../middleware/auth");
const { requireSelf } = require("../middleware/authorize");

// Public auth routes
router.post("/signup", appController.signUp);
router.post("/refresh-token", appController.refreshToken);
router.post("/login", appController.login);

// Protected auth routes
// CHANGES.md API #19: a caller may only close their own activity record.
router.get("/logout/:id", authenticateToken, requireSelf("id"), appController.logOut);

// Password reset (public — user is not logged in during reset)
router.get("/reset-password/:id/:token", passwordController.resetPassword);
router.post("/forgot-password", passwordController.forgotPassword);
router.post("/reset-password/:id/:token", passwordController.setNewPassword);

// FIX (AUD-002): change-password requires authentication AND may only target the
// caller's own account. The earlier "fix" line had been left commented out, so the
// endpoint was still unprotected.
router.put(
	"/change-password/:id",
	authenticateToken,
	requireSelf("id"),
	passwordController.changePassword,
);

module.exports = router;
