const express = require("express");
const router = express.Router();

const projectController = require("../controllers/projectController");

router.get("/", projectController.getProjects);

router.get("/:companyName", projectController.getCompanyProjects);

router.get(
	"/:selectedAssignees/:companyName",
	projectController.getAssigneeProjects,
);

router.post("/", projectController.createProject);

router.post("/activity", projectController.createActivity);

router.put("/:id", projectController.updateProject);

router.put("/task/:projectId", projectController.addProjectTask);

router.post("/scheduling", projectController.scheduleTask);

router.delete("/task/:id", projectController.deleteTask);

router.delete("/subtask/:id", projectController.deleteSubTask);

router.put("/subtask-child/:id", projectController.deleteSubTaskChild);

router.put("/task-subtask/:id", projectController.addSubTask);

router.put("/task-add-subtask/:id", projectController.addTaskSubTasks);

router.put("/update-subtask/:id", projectController.updateTaskSubTask);

router.put("/update-task/:id", projectController.updateProjectTask);

router.put("/subtask/:projectId", projectController.updateProjectSubTask);

router.put("/task/activity/:id", projectController.updateTaskActivity);

router.put("/inner-subtask/:id", projectController.updateInnerSubTasks);

module.exports = router;
