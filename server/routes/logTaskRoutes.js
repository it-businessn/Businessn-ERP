const express = require("express");
const router = express.Router();

const logTaskController = require("../controllers/logTaskController");

router.get("/", logTaskController.getTasks);

router.get("/:contactId", logTaskController.getTask);

router.post("/", logTaskController.createTask);

router.put("/:id", logTaskController.updateTask);

module.exports = router;
