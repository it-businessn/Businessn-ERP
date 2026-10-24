const mongoose = require("mongoose");
const { logIndexErrors } = require("../utils/db.util");

const holidaySchema = new mongoose.Schema(
	{
		name: String,
		date: Date,
		companyName: { type: String, ref: "Company" },
		year: Date,
		// STAT-HOLIDAYS: "BC_STATUTORY" when filled in from the BC rules
		// (utils/bcStatHolidays.util.js), "COMPANY" when added on the holiday page
		source: { type: String, default: "COMPANY" },
	},
	{ timestamps: { createdAt: "createdOn", updatedAt: "updatedOn" } },
);

// STAT-HOLIDAYS: one holiday per name per company and year, so filling in the
// BC holidays from two places at once (two servers, page + daily job) cannot
// insert them twice. addStatHoliday already rejects a duplicate name (409).
holidaySchema.index(
	{ companyName: 1, year: 1, name: 1 },
	{ unique: true, name: "uniq_holiday_per_year" },
);

const Holiday = logIndexErrors(mongoose.model("Holiday", holidaySchema));

module.exports = Holiday;
