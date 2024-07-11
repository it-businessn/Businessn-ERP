const express = require("express");
const router = express.Router();

const noteController = require("../controllers/noteController");

router.get("/", noteController.getNotes);

router.get("/:contactId", noteController.getNote);

router.post("/", noteController.createNote);

router.put("/:id", noteController.updateNotes);

module.exports = router;
