const getPercent = (value) => {
	const input = value === "" ? 0 : parseFloat(value);
	// return input;
	return Number.isInteger(input) ? input / 100 : input;
};

const showPercent = (stored) => {
	const value = parseFloat(stored).toFixed(2);
	return value < 1 ? value * 100 : stored;
};

const checkExtraRun = (isExtraRun) => {
	return isExtraRun === "true" || isExtraRun;
};

module.exports = { showPercent, getPercent, checkExtraRun };
