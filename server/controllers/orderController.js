const Order = require("../models/Order");

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
		});
		const isSettled = (status) => status === "Settled";
		orders.map(
			({
				fulfillmentStatus,
				fundsReceivedStatus,
				empEFTSentStatus,
				empEFTDepositedStatus,
				craSentStatus,
				craDepositedStatus,
			}) =>
				(fulfillmentStatus =
					isSettled(fundsReceivedStatus) &&
					isSettled(empEFTSentStatus) &&
					isSettled(empEFTDepositedStatus) &&
					isSettled(craSentStatus) &&
					isSettled(craDepositedStatus) &&
					"Settled"),
		);
		res.status(200).json(orders);
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
};

const updateOrder = async (req, res) => {
	const { id } = req.params;

	try {
		const order = await Order.findByIdAndUpdate(id, req.body, {
			new: true,
		});
		return res.status(201).json(order);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};
module.exports = { getCompanyOrders, updateOrder };
