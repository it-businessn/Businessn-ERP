/**
 * ORDERS-01: BusinessN Corporate gets one order per client payroll run, and the
 * order's employee EFT statuses follow VoPay.
 *
 *  - Payroll submit (reportController.updatePayrollProcess): after the VoPay
 *    transfer has been attempted, the run's order is created if it does not
 *    exist (one per funding totals record, so a retry never adds a second
 *    order) and the transfer result is recorded on it.
 *  - VoPay webhook (vopayController.receiveWebhook): a transaction status for
 *    the order's TransactionID updates the order.
 *
 * Status mapping (Settled / Unsettled, as on the Orders screen):
 *   transfer accepted by VoPay ("sent")     -> Emp EFT Sent      = Settled
 *   VoPay transaction "successful"          -> Emp EFT Sent and Emp EFT Deposited = Settled
 *   VoPay transaction failed / cancelled /
 *   returned / rejected / transfer failed   -> Emp EFT Sent and Emp EFT Deposited = Unsettled
 * Funds Received, CRA Sent and CRA Deposited are not reported by this transfer
 * and stay manual. Fulfillment is Settled only when all five are Settled.
 *
 * Nothing here can change or block the transfer: callers run it after the
 * transfer and catch its errors.
 */
const Order = require("../models/Order");
const { COMPANIES } = require("../constants/constant");

const ORDER_STATUS = { SETTLED: "Settled", UNSETTLED: "Unsettled" };
const ORDER_NUMBER_PREFIX = "BE100";
const VOPAY_SUCCESS = ["successful", "success", "completed", "complete"];
const VOPAY_FAILURE = ["failed", "cancelled", "canceled", "returned", "rejected", "declined", "error"];
const ORDER_STATUS_FIELDS = [
	"fundsReceivedStatus",
	"empEFTSentStatus",
	"empEFTDepositedStatus",
	"craSentStatus",
	"craDepositedStatus",
];

const isSettled = (status) => status === ORDER_STATUS.SETTLED;

/** Fulfillment is Settled only when every step is Settled. */
const fulfillmentOf = (order) =>
	ORDER_STATUS_FIELDS.every((field) => isSettled(order?.[field])) ? ORDER_STATUS.SETTLED : ORDER_STATUS.UNSETTLED;

/** Next order number: the highest existing BE100<n> + 1 (the old count + 1 repeated a number after a delete). */
const nextOrderNumber = async () => {
	const orders = await Order.find({ companyName: COMPANIES.BUSINESSN_ORG }).select("orderNumber").lean();
	const highest = (orders || []).reduce((max, { orderNumber }) => {
		const match = typeof orderNumber === "string" && orderNumber.match(new RegExp(`^${ORDER_NUMBER_PREFIX}(\\d+)$`));
		return match ? Math.max(max, Number(match[1])) : max;
	}, 0);
	return `${ORDER_NUMBER_PREFIX}${Math.max(highest, (orders || []).length) + 1}`;
};

/** What the payroll submit's transfer result changes on the order. */
const transferUpdate = (fundTransfer) => {
	const status = fundTransfer?.status;
	if (status === "sent") {
		return {
			empEFTSentStatus: ORDER_STATUS.SETTLED,
			vopayStatus: "sent",
			vopayTransactionId: fundTransfer.transactionId ? String(fundTransfer.transactionId) : undefined,
			vopayFailureReason: null,
		};
	}
	if (status === "failed") {
		return {
			empEFTSentStatus: ORDER_STATUS.UNSETTLED,
			empEFTDepositedStatus: ORDER_STATUS.UNSETTLED,
			vopayStatus: "failed",
			vopayFailureReason: String(fundTransfer.error || "VoPay transfer failed").slice(0, 500),
		};
	}
	return null; // skipped (already sent, in progress, no funding totals): nothing changes
};

const applyUpdate = async (order, update) => {
	if (!order || !update) return order;
	for (const [key, value] of Object.entries(update)) if (value !== undefined) order[key] = value;
	order.vopayStatusAt = new Date();
	order.fulfillmentStatus = fulfillmentOf(order);
	await order.save();
	return order;
};

/**
 * Called by the payroll submit after the transfer. Returns the order (or null
 * when the run has no funding totals).
 */
const recordPayrollOrder = async ({ fundTotalsReport, customer, totalRecipients, fundTransfer }) => {
	if (!fundTotalsReport?._id) return null;
	const fundingTotalsId = String(fundTotalsReport._id);
	let order = await Order.findOne({ fundingTotalsId });
	if (!order) {
		order = await Order.create({
			companyName: COMPANIES.BUSINESSN_ORG,
			orderNumber: await nextOrderNumber(),
			fundingTotalsId,
			totalRecipients,
			customer,
		});
	}
	return applyUpdate(order, transferUpdate(fundTransfer));
};

/**
 * Called for every VoPay webhook event. Updates the order whose transfer has
 * this TransactionID; returns the order, or null when there is none.
 */
const applyVopayEventToOrder = async (event) => {
	const transactionId = event?.TransactionID ?? event?.TransactionId ?? event?.transactionId;
	if (transactionId === undefined || transactionId === null || String(transactionId).trim() === "") return null;
	const order = await Order.findOne({ vopayTransactionId: String(transactionId).trim() });
	if (!order) return null;
	const status = String(event?.Status ?? event?.TransactionStatus ?? "").trim().toLowerCase();
	const update = { vopayStatus: status || order.vopayStatus };
	if (VOPAY_SUCCESS.includes(status)) {
		update.empEFTSentStatus = ORDER_STATUS.SETTLED;
		update.empEFTDepositedStatus = ORDER_STATUS.SETTLED;
		update.vopayFailureReason = null;
	} else if (VOPAY_FAILURE.includes(status)) {
		update.empEFTSentStatus = ORDER_STATUS.UNSETTLED;
		update.empEFTDepositedStatus = ORDER_STATUS.UNSETTLED;
		update.vopayFailureReason = String(event?.FailureReason || event?.ErrorMessage || status).slice(0, 500);
	}
	return applyUpdate(order, update);
};

module.exports = {
	ORDER_STATUS,
	ORDER_STATUS_FIELDS,
	isSettled,
	fulfillmentOf,
	nextOrderNumber,
	transferUpdate,
	recordPayrollOrder,
	applyVopayEventToOrder,
};
