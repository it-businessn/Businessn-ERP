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
		return res.status(200).json(orders);
	} catch (error) {
		return res.status(500).json({ message: "Internal Server Error", error });
	}
};

const isSettled = (status) => status === "Settled";

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
			const {
				fundsReceivedStatus,
				empEFTSentStatus,
				empEFTDepositedStatus,
				craSentStatus,
				craDepositedStatus,
			} = order;

			order.fulfillmentStatus =
				isSettled(fundsReceivedStatus) &&
				isSettled(empEFTSentStatus) &&
				isSettled(empEFTDepositedStatus) &&
				isSettled(craSentStatus) &&
				isSettled(craDepositedStatus)
					? "Settled"
					: "Unsettled";
			await order.save();
			return res.status(201).json(order);
		}
	} catch (error) {
		return res.status(500).json({ message: "Internal Server Error", error });
	}
};
module.exports = { getCompanyOrders, updateOrder };
