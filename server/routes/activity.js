const express = require("express");
const router = express.Router();

const activityController = require("../controllers/activityController");

router.get("/:id", activityController.getActivityById());

router.get("/", activityController.getActivity());

router.post("/", activityController.createActivity());

module.exports = router;
