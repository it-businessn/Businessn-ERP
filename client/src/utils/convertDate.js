import moment from "moment";

export const timeSpan = (time) => {
	const givenTime = new Date(time);
	const currentTime = new Date();

	const differenceMs = currentTime - givenTime;
	const hoursAgo = Math.floor(differenceMs / (1000 * 60 * 60));
	const minutesAgo = Math.floor((differenceMs % (1000 * 60 * 60)) / (1000 * 60));
	return `${hoursAgo}hr ${minutesAgo}m ago`;
};

export const todayDate = moment();

export const isFutureDate = (date) => todayDate.isAfter(date, "day");
export const getMomentDate = (date) => moment.utc(date);

export const daysAgo = (date) => {
	const numDays = todayDate?.diff(date, "days");
	const days = numDays < 0 ? Math.abs(numDays) : numDays;
	return days;
};

export const getMomentDateISO = (date) => moment(date).toISOString();

export const isSameAsToday = (date) => moment(date).isSame(new Date(), "day");

export const dayMonthYear = (date) => moment.utc(date).format("ddd MMM DD, YYYY");

export const longTimeFormat = (date) => moment(date).format("MMM DD, YYYY hh:mm A");

export const longFormat = (date) => moment.utc(date).format("dddd, D MMMM YYYY");

export const monthDayYearFormat = (date) => moment(date).format("MMMM, DD, YYYY");

export const mmmDayYearFormat = (date) => moment(date).format("MMM, DD, YYYY");

export const monthDayYear = todayDate.format("MMM DD, YYYY");

export const today = todayDate.format("MMDDYY");

export const formatDateMMDDYY = (date) => moment.utc(date).format("MM/DD/YYYY");

export const formatDateBar = (date) => moment.utc(date).format("DD/MM/YYYY");

export const formatDateRange = (startDate, endDate) => {
	const start = moment.utc(startDate).format("DD/MM");
	const end = moment.utc(endDate).format("DD/MM");
	return `${start} - ${end}`;
};

export const getDefaultTime = (date) => moment(date, "HH:mm").format("hh:mm A");

export const getTimeCardFormat = (timestamp, notDevice, timeSheet) => {
	const date = notDevice ? moment(timestamp) : moment.utc(timestamp);
	return timeSheet ? date.format("ddd, YYYY-MM-DD") : date.format("YYYY-MM-DD  hh:mm A");
};

// export const getTimeFormat = (date) => moment.utc(date).format("hh:mm A");
export const getTimeFormat = (timestamp, notDevice) => {
	const date = notDevice ? moment(timestamp) : moment.utc(timestamp);
	return date.format("HH:mm");
};

export const setUTCDate = (date, newDate, notDevice) => {
	const utcDate = date ? (notDevice ? moment(date) : moment.utc(date)) : moment.utc();

	let [hours, minutes] = newDate.split(":");
	utcDate.set({
		hour: parseInt(hours),
		minute: parseInt(minutes),
		second: 0,
	});
	return utcDate.toISOString();
};

export const getDateDiffHours = (date1, date2, totalBreaks) => {
	const startTime = moment(date1, "HH:mm");
	const endTime = moment(date2, "HH:mm");
	const breakTime = totalBreaks === "" ? 0 : parseInt(totalBreaks) / 60;
	const totalMinutes = moment.duration(endTime.diff(startTime)).asMinutes();
	const netMinutes = totalMinutes - breakTime;
	const hoursDiff = Math.floor(netMinutes / 60);
	const minutesDiff = (netMinutes % 60).toFixed(2);

	const formattedHours = String(hoursDiff).padStart(2, "0");
	const formattedMinutes = String(minutesDiff).padStart(2, "0");
	return `${formattedHours}:${formattedMinutes}`;
};

export const addBusinessDays = (date, days) => {
	let result = moment(date);
	let count = 0;
	while (count < days) {
		result = result.add(1, "days");

		if (result.isoWeekday() !== 6 && result.isoWeekday() !== 7) {
			count++;
		}
	}
	return result;
};

export const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
export const getTimezone = (date) =>
	moment.tz(date, "America/Chicago").clone().tz(userTimezone).format();

export const formatDate = (date) =>
	new Date(date).toLocaleDateString("en-US", {
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
	});

export const formatDateTime = (date) =>
	`${formatDate(date)} ${new Date(date).toLocaleTimeString()}`;

export const getDefaultDateTime = (date, time) => `${date.split("T")[0]}T${time}`;

export const getDefaultDate = (isoDate = null) => {
	const dateObject = isoDate ? new Date(isoDate) : new Date();
	return dateObject.toISOString().split("T")[0];
};

export const getDefaultDateFormat = (date = null) => {
	const dateObject = date ? new Date(date) : new Date();
	return `${dateObject.getMonth() + 1}/${dateObject.getDate()}/${dateObject.getFullYear()}`;
};

export const timeToDecimal = (hours, minutes = 0) => (hours + minutes / 60).toFixed(1);
