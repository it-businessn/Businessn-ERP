const express = require("express");
const router = express.Router();

const activityController = require("../controllers/activityController");

router.get("/:id", activityController.getActivityById());
router.get("/:id/:name", activityController.getActivity());
router.get("/user/:id/:name/:filter", activityController.getActivityByUserId());

router.post("/", activityController.createActivity());

module.exports = router;
