const express = require("express");
const router = express.Router();

const logTaskController = require("../controllers/logTaskController");

router.get("/:id", logTaskController.getTaskById());

router.get("/", logTaskController.getTasks());

router.post("/", logTaskController.createTask());

router.put("/:id", logTaskController.updateTask());

module.exports = router;
