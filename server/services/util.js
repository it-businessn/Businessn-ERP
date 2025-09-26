const getPercent = (value) => {
	const input = value === "" ? 0 : parseFloat(value);
	// return input;
	return Number.isInteger(input) ? input / 100 : input;
};

const checkExtraRun = (isExtraRun) => {
	return isExtraRun === "true" || isExtraRun;
};

module.exports = { getPercent, checkExtraRun };
