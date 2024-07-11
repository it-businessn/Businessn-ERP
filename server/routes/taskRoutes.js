const express = require("express");
const router = express.Router();

const taskController = require("../controllers/taskController");

router.get("/", taskController.getTasks);
router.get("/:id/:company", taskController.getTaskById);

router.post("/", taskController.createTask);

router.put("/:id", taskController.updateTask);

router.put("/status/:taskId", taskController.updateTask);

router.put("/subtask/status/:id", taskController.updateSubTask);

router.put("/subtask-child/status/:id", taskController.updateInnerSubTask);

router.put("/activity/status/:id", taskController.updateActivity);

module.exports = router;
