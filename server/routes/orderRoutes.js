const express = require("express");
const router = express.Router();

const orderController = require("../controllers/orderController");

router.get("/:companyName", orderController.getCompanyOrders);

router.put("/:id", orderController.updateOrder);

module.exports = router;
