const getHrs = (num) => `${(num / 60).toFixed(0)}.${num % 60}`;

// const convertHrsToFloat = (hrs) => (hrs ? parseFloat(getHrs(hrs)) : 0);

const convertHrsToFloat = (hrs) => {
	const value = parseFloat(hrs);

	if (Number.isNaN(value)) {
		// console.warn("[convertHrsToFloat] Invalid hours value:", hrs);
		return 0;
	}

	return value;
};
const getSumRegHrs = (regHrs1, regHrs2) => {
	const base = safeNum(regHrs1);
	const subtract = Number(regHrs2);

	if (!Number.isFinite(subtract)) {
		return base;
	}

	return base - subtract;
};
const safeNum = (v) => Number(v) || 0;

module.exports = {
	convertHrsToFloat,
	getSumRegHrs,
	safeNum,
};
