const express = require("express");
const router = express.Router();

const questionnaireController = require("../controllers/questionnaireController");

router.get(
	"/assessment/type/company/:type/:company",
	questionnaireController.getAssessmentQuestionsByType,
);
router.get(
	"/assessment/type/comp/:id",
	questionnaireController.getAssessmentType,
);
router.get("/", questionnaireController.getAllQuestions);

router.get("/:id", questionnaireController.getQuestionById);

router.post("/", questionnaireController.createQuestionnaire);

router.get("/assessment/:id", questionnaireController.getAssessmentByUserId);
router.post("/assessment", questionnaireController.createAssessment);
router.post("/assessment/type", questionnaireController.createAssessmentType);
router.put("/assessment/:id", questionnaireController.updateAssessment);

router.put("/:id", questionnaireController.updateQuestionnaireById);

router.delete("/:id", questionnaireController.deleteQuestion);
router.delete("/assessment/:id", questionnaireController.deleteAssessment);
module.exports = router;
