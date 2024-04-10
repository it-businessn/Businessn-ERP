const express = require("express");
const router = express.Router();

const questionnaireController = require("../controllers/questionnaireController");

router.get("/", questionnaireController.getAllQuestions);

router.get("/:id", questionnaireController.getQuestionById);

router.post("/", questionnaireController.createQuestionnaire);

router.get("/assessment/:id", questionnaireController.getAssessmentByUserId);
router.post("/assessment", questionnaireController.createAssessment);
router.put("/assessment/:id", questionnaireController.updateAssessment);

router.put("/:id", questionnaireController.updateContact);

module.exports = router;
