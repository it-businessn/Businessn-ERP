const express = require("express");
const router = express.Router();

const projectController = require("../controllers/projectController");
const taskController = require("../controllers/taskController");

router.get("/", projectController.getProjects());

router.post("/", projectController.createProject());

router.put("/:id", projectController.updateProject());

router.put("/task/:id", projectController.updateProjectTask());

router.put("/task/activity/:id", projectController.updateTaskActivity());

router.put("/task/status/:id", taskController.updateTask());

router.put("/subtask/status/:id", taskController.updateSubTask());

router.put("/activity/status/:id", taskController.updateActivity());

module.exports = router;
