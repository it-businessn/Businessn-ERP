const express = require("express");
const router = express.Router();

const questionnaireController = require("../controllers/questionnaireController");

router.get("/", questionnaireController.getQuestionnaires);

router.get(
	"/subject/:subject/:companyName",
	questionnaireController.getSubjectQuestionnaire,
);

router.get("/:contactId", questionnaireController.getQuestionnaire);

router.post("/", questionnaireController.createQuestionnaire);

router.put("/:id", questionnaireController.updateQuestionnaire);

router.delete("/:id", questionnaireController.deleteQuestionnaire);

module.exports = router;
