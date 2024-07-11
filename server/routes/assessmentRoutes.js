const express = require("express");
const router = express.Router();

const assessmentController = require("../controllers/assessmentController");

router.get("/:empId", assessmentController.getAssessment);

router.post("/", assessmentController.createAssessment);

router.put("/:id", assessmentController.updateAssessment);

router.delete("/:id", assessmentController.deleteAssessmentType);

router.post("/type", assessmentController.createAssessmentType);

router.get("/type/:companyName", assessmentController.getAssessmentType);

module.exports = router;
