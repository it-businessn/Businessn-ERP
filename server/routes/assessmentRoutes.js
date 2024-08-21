const express = require("express");
const router = express.Router();

const assessmentController = require("../controllers/assessmentController");

router.get("/type/:companyName", assessmentController.getAssessmentType);

router.get("/:empId", assessmentController.getAssessment);

router.post("/", assessmentController.createAssessment);

router.post("/type", assessmentController.createAssessmentType);

router.put("/:id", assessmentController.updateAssessment);

router.delete("/:id", assessmentController.deleteAssessmentType);

module.exports = router;
