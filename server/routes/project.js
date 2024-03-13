const express = require("express");
const router = express.Router();

const projectController = require("../controllers/projectController");

router.get("/", projectController.getProjects());

router.post("/", projectController.createProject());

router.put("/:id", projectController.updateProject());

router.put("/task/:id", projectController.updateProjectTask());

module.exports = router;
