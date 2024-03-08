const express = require("express");
const router = express.Router();

const taskController = require("../controllers/taskController");

router.get("/:id", taskController.getTaskById());

router.get("/", taskController.getTasks());

router.post("/", taskController.createTask());

router.put("/:id", taskController.updateTask());

module.exports = router;
