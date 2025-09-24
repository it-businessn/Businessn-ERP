const calcTotalWorkedHours = (clockIn, clockOut) => {
	// const hoursWorked = moment.duration(moment(clockOut).diff(moment(clockIn))).asHours();
	// const totalTime = Math.round(hoursWorked * 100) / 100;
	// const roundedTime = totalTime.toFixed(2).includes(".99") ? Math.round(totalTime) : totalTime;
	// return roundedTime;

	const startDate = new Date(clockIn);
	const endDate = new Date(clockOut);

	const sameHourAndMinute =
		startDate.getUTCHours() === endDate.getUTCHours() &&
		startDate.getUTCMinutes() === endDate.getUTCMinutes();

	if (sameHourAndMinute) return 8;

	const totalTime = (endDate - startDate) / (1000 * 60 * 60); // convert ms to hours
	const fixedTime = totalTime.toFixed(2);

	if (fixedTime.endsWith(".99")) return Math.round(totalTime);
	if (fixedTime.endsWith(".01")) return Math.floor(totalTime);

	return fixedTime;
};

module.exports = { calcTotalWorkedHours };
