const getPercent = (value) => {
	const input = value === "" ? 0 : parseFloat(value);
	// return input;
	return Number.isInteger(input) ? input / 100 : input;
};

const showPercent = (stored) => {
	const val = stored < 1 ? stored * 100 : stored;
	return Number.isInteger(val) ? val : stored;
};

const checkExtraRun = (isExtraRun) => {
	return isExtraRun === "true" || isExtraRun;
};

module.exports = { showPercent, getPercent, checkExtraRun };
