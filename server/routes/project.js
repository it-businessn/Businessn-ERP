const express = require("express");
const router = express.Router();

const projectController = require("../controllers/projectController");
const taskController = require("../controllers/taskController");

router.get("/", projectController.getProjects());

router.post("/", projectController.createProject());

router.post("/activity", projectController.createActivity());

router.put("/:id", projectController.updateProject());

router.put("/task/:id", projectController.addProjectTask());

router.put("/task-subtask/:id", projectController.addTaskSubTask());

router.put("/task-add-subtask/:id", projectController.addTaskSubTasks());

router.put("/update-subtask/:id", projectController.updateTaskSubTask());

router.put("/update-task/:id", projectController.updateProjectTask());

router.put("/subtask/:id", projectController.updateProjectSubTask());

router.put("/task/activity/:id", projectController.updateTaskActivity());

router.put("/task/status/:id", taskController.updateTask());

router.put("/subtask/status/:id", taskController.updateSubTask());

router.put("/activity/status/:id", taskController.updateActivity());

module.exports = router;
