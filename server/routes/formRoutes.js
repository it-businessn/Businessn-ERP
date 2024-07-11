const express = require("express");
const router = express.Router();

const formController = require("../controllers/formController");

router.post("/forms", formController.createForm());

module.exports = router;
