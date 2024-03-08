const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/auth");
const userController = require("../controllers/userController");

router.get("/", userController.getUsers());

router.post("/login", userController.login());

router.post("/register", userController.createUser());

router.put("/:id", userController.updateUser());

router.put(
	"/change-password/:id",
	authMiddleware.authenticate,
	userController.changePassword(),
);

module.exports = router;
