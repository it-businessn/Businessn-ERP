const moment = require("moment");
// const momentTz = require("moment-timezone");

const NEXT_DAY = moment().add(1, "days");
const CURRENT_TIME_HHMM = NEXT_DAY.format("HH:mm");
// const currentTime = NEXT_DAY.format("HH:mm:ss");
// let LOCAL_TIME = moment().tz("America/Vancouver").toDate();

const CURRENT_YEAR = moment().year();
const getUTCTime = (time, notDevice) => (notDevice ? moment() : moment.utc(time).toISOString());

const calculateAge = (dob) => moment().diff(moment(dob, "YYYY-MM-DD"), "years");

const startOfDay = (timestamp) => moment(timestamp).startOf("day").toDate();
const endOfDay = (timestamp) => moment(timestamp).endOf("day").toDate();

const momentTime = (time) => moment(time, "YYYY-MM-DD hh:mm A");

const momentDuration = (time1, time2) => (time1 && time2 ? moment.duration(time2.diff(time1)) : 0);

const isSameDate = (date1, date2) => moment(date1).isSame(date2, "second");

const isSameDay = (date1, date2) => moment(date1).isSame(date2, "day");

module.exports = {
	CURRENT_YEAR,
	NEXT_DAY,
	getUTCTime,
	startOfDay,
	endOfDay,
	momentTime,
	momentDuration,
};
