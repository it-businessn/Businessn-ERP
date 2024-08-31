export const PAYGROUP_COLS = [
	"Pay number",
	"Submit by",
	"Pay date",
	"Pay period",
	"Status",
	"Action",
];

export const PAYGROUP_ACTIONS = [
	{ key: "roe", name: "Issue Roes" },
	{ key: "form", name: "Issue Forms" },
	{ key: "extra", name: "Extra Pay Run" },
	{ key: "terminate", name: "Terminate" },
	{ key: "empUpdate", name: "Update Employees" },
	{ key: "onboard", name: "Onboard Employee" },
];

export const getClosestRecord = (
	payNo,
	isExtra,
	payGroupSchedule,
	closestRecord,
) =>
	payNo
		? isExtra
			? payGroupSchedule?.find(
					({ payPeriod, isExtraRun, isProcessed }) =>
						payPeriod === parseInt(payNo) &&
						isExtraRun === isExtra &&
						!isProcessed,
			  )
			: payGroupSchedule?.find(
					({ payPeriod, isProcessed }) =>
						payPeriod === parseInt(payNo) && !isProcessed,
			  )
		: closestRecord;
