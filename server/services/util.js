const getPercent = (totalActualHours, totalEstimatedHours) => {
	const actual = Number(totalActualHours);
	const estimated = Number(totalEstimatedHours);

	if (!estimated || isNaN(actual) || isNaN(estimated)) {
		return 0;
	}

	const percent = (actual / estimated) * 100;

	const clamped = Math.min(Math.max(percent, 0), 100);

	return Number(clamped.toFixed(2));
};

const normalizePercent = (value) => {
	const num = Number(value);
	if (isNaN(num)) return 0;

	if (num > 1) return num / 100;

	return num; // already decimal
};
const showPercent = (stored) => {
	const num = Number(stored);

	if (isNaN(num)) return 0;

	// if already in decimal form (0.25 → 25)
	if (num > 0 && num < 1) {
		return Number((num * 100).toFixed(2));
	}

	return Number(num.toFixed(2));
};

const checkExtraRun = (isExtraRun) => {
	return isExtraRun === true || isExtraRun === "true";
};

const isPercentType = (val) => typeof val === "string" && val.includes("%");

module.exports = { showPercent, checkExtraRun, isPercentType, normalizePercent, getPercent };
