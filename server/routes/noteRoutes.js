const express = require("express");
const router = express.Router();

const noteController = require("../controllers/noteController");

router.get("/:id", noteController.getNoteById());

router.get("/", noteController.getNotes());

router.post("/", noteController.createNote());

router.put("/:id", noteController.updateNotes());

module.exports = router;
