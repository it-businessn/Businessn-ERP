const moment = require("moment");
// const momentTz = require("moment-timezone");

// NEW-07: NEXT_DAY and CURRENT_YEAR were constants computed once at module load,
// so after the server had run past midnight / New Year they were stale (e.g. new
// pay schedules generated for the previous year). Compute them per call.
const getNextDay = () => moment().add(1, "days");
// const currentTime = getNextDay().format("HH:mm:ss");
// let LOCAL_TIME = moment().tz("America/Vancouver").toDate();

const getCurrentYear = () => moment().year();
const getUTCTime = (time, notDevice) => (notDevice ? moment() : moment.utc(time).toISOString());

const calculateAge = (dob) => moment().diff(moment(dob, "YYYY-MM-DD"), "years");

const startOfDay = (timestamp) => moment(timestamp).startOf("day").toDate();
const endOfDay = (timestamp) => moment(timestamp).endOf("day").toDate();

const momentTime = (time) => moment(time, "YYYY-MM-DD hh:mm A");

const momentDuration = (time1, time2) => (time1 && time2 ? moment.duration(time2.diff(time1)) : 0);

const isSameDate = (date1, date2) => moment(date1).isSame(date2, "second");

const isSameDay = (date1, date2) => moment(date1).isSame(date2, "day");

module.exports = {
	getCurrentYear,
	getNextDay,
	// NEW-07: kept for compatibility; live getters (destructuring still snapshots).
	get CURRENT_YEAR() {
		return getCurrentYear();
	},
	get NEXT_DAY() {
		return getNextDay();
	},
	getUTCTime,
	startOfDay,
	endOfDay,
	momentTime,
	momentDuration,
};
