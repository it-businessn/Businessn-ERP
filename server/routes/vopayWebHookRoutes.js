const express = require("express");
const { receiveWebhook } = require("../controllers/vopayController");

module.exports = (io) => {
	const router = express.Router();

	router.post("/", receiveWebhook(io));

	return router;
};
