const Order = require("../models/Order");
const { fulfillmentOf } = require("../services/orderService");

const getCompanyOrders = async (req, res) => {
	const { companyName } = req.params;

	try {
		const orders = await Order.find({ companyName }).populate({
			path: "fundingTotalsId",
			model: "FundingTotalsPay",
			select: [
				"isExtraRun",
				"totalFundingWithDrawals",
				"totalEmpPaymentRemitCost",
				"totalGovtContr",
			],
		}).sort({ createdOn: -1 });
		return res.status(200).json(orders);
	} catch (error) {
		return res.status(500).json({ message: "Internal Server Error", error });
	}
};


const updateOrder = async (req, res) => {
	const { id } = req.params;

	try {
		const order = await Order.findByIdAndUpdate(
			id,
			{ $set: req.body },
			{
				new: true,
			},
		);
		if (order) {
			order.fulfillmentStatus = fulfillmentOf(order); // ORDERS-01: same rule as VoPay updates
			await order.save();
			return res.status(201).json(order);
		}
		// API-04: unknown id used to leave the request hanging.
		return res.status(404).json({ message: "Order not found" });
	} catch (error) {
		return res.status(500).json({ message: "Internal Server Error", error });
	}
};
module.exports = { getCompanyOrders, updateOrder };
