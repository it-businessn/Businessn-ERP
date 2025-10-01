const xml = require("xmlbuilder");
const path = require("path");
const moment = require("moment");
const xml2js = require("xml2js");
const fs = require("fs");

const EmployeeROE = require("../models/EmployeeROE");
const { findEmployeeEmploymentInfo, updateEmploymentInfo } = require("./employmentInfoController");
const EmployeePayStub = require("../models/EmployeePayStub");
const Company = require("../models/Company");

const { SAVE_FILE_OUTPUT_DIR } = require("./t4SlipController");

const parser = new xml2js.Parser({ explicitArray: false });

const findEmployeeROEInfoDetails = async (empId, companyName) =>
	await EmployeeROE.findOne({
		empId,
		companyName,
	});

const getEmployeeROEEmploymentInfo = async (req, res) => {
	const { companyName, empId } = req.params;
	try {
		const existingROEInfo = await findEmployeeROEInfoDetails(empId, companyName);

		return res.status(200).json(existingROEInfo);
	} catch (error) {
		return res.status(500).json({ message: "Internal Server Error", error });
	}
};

const getEmployeeEarningsInfo = async (req, res) => {
	const { companyName, empId } = req.params;

	try {
		const payStubs = await EmployeePayStub.find({
			companyName,
			empId,
			isProcessed: true,
		})
			.sort({
				payPeriodEndDate: -1,
			})
			.select(
				"payPeriodNum payPeriodEndDate currentGrossPay totalRegHoursWorked totalOvertimeHoursWorked totalDblOvertimeHoursWorked totalSickHoursWorked totalSprayHoursWorked totalStatDayHoursWorked totalStatHours totalVacationHoursWorked totalFirstAidHoursWorked totalBereavementHoursWorked totalPersonalDayHoursWorked",
			);
		return res.status(200).json(payStubs);
	} catch (error) {
		return res.status(500).json({ message: "Internal Server Error", error });
	}
};

const addEmployeeROEEmploymentInfo = async (req, res) => {
	const {
		empId,
		companyName,
		payPeriodType,
		payPeriodId,
		empInfo,
		employmentInfo,
		employerInfo,
		earningsInfo,
		comments,
	} = req.body;
	try {
		const {
			firstName,
			lastName,
			middleName,
			SIN,
			SINIv,
			streetAddress,
			streetAddressSuite,
			city,
			province,
			country,
			postalCode,
		} = empInfo;

		const {
			employmentStartDate,
			employmentLeaveDate,
			finalPayPeriodEndDate,
			recallDate,
			expectedRecallDate,
			reasonCode,
			positions,
			vacationPayCode,
			vacationPayStartDate,
			vacationPayEndDate,
			vacationPayAmount,
			statHolidays,
			otherMonies,
			specialPayments,
		} = employmentInfo;
		const {
			name,
			registration_number,
			address,
			contactName,
			issuerName,
			contactTelNumber,
			contactExtNumber,
			issuerTelNumber,
			issuerExtNumber,
			preferredCommunication,
		} = employerInfo;

		const { totalInsurableHours, totalInsurableEarnings, earningsData } = earningsInfo;

		const empTenureInfo = await findEmployeeEmploymentInfo(empId, companyName);
		if (empTenureInfo && employmentStartDate && employmentLeaveDate) {
			await updateEmploymentInfo(empTenureInfo._id, {
				employmentStartDate,
				employmentLeaveDate,
			});
		}
		const newData = {
			empId,
			companyName,
			payPeriodType,
			payPeriodId,
			firstName,
			lastName,
			middleName,
			SIN,
			SINIv,
			streetAddress,
			streetAddressSuite,
			city,
			province,
			country,
			postalCode,
			employmentStartDate,
			employmentLeaveDate,
			finalPayPeriodEndDate,
			recallDate,
			expectedRecallDate,
			reasonCode,
			occupation: positions,
			contactName,
			issuerName,
			contactTelNumber,
			contactExtNumber,
			issuerTelNumber,
			issuerExtNumber,
			preferredCommunication,
			insurableHours: earningsData,
			insurableEarnings: earningsData,
			totalInsurableHours,
			totalInsurableEarnings,
			vacationPayCode,
			vacationPayStartDate,
			vacationPayEndDate,
			vacationPayAmount,
			statHolidayPay: statHolidays,
			otherMoney: otherMonies,
			specialPayments,
			reviewComments: comments?.message,
		};
		const existingROEInfo = await findEmployeeROEInfoDetails(empId, companyName);

		if (existingROEInfo) {
			const updatedROEInfo = await EmployeeROE.findByIdAndUpdate(existingROEInfo._id, newData, {
				new: true,
			});
			return res.status(201).json(updatedROEInfo);
		}
		const newROEInfo = await EmployeeROE.create(newData);
		return res.status(201).json(newROEInfo);
	} catch (error) {
		return res.status(500).json({ message: "Internal Server Error", error });
	}
};

const PAY_FREQUENCY_CODE = [
	{ name: "Bi-weekly", code: "B", totalPayPeriod: 27 },
	{ name: "Monthly", code: "M", totalPayPeriod: 13 },
	{ name: "Monthly non-standard", code: "O", totalPayPeriod: 13 },
	{ name: "Semi-monthly", code: "S", totalPayPeriod: 25 },
	{ name: "Semi-monthly non-standard", code: "E", totalPayPeriod: 25 },
	{ name: "Thirteen Pay Periods per year", code: "H", totalPayPeriod: 14 },
	{ name: "Weekly", code: "W", totalPayPeriod: 53 },
];

function phoneStringToPattern(phoneStr) {
	// Build pattern to allow optional dashes at the same positions
	let pattern = "^";
	let digitIndex = 0;

	for (let i = 0; i < phoneStr.length; i++) {
		const char = phoneStr[i];
		if (/\d/.test(char)) {
			pattern += "\\d"; // match a digit
			digitIndex++;
		} else {
			pattern += "-"; // preserve dash position
		}
	}

	pattern += "$";
	return new RegExp(pattern);
}

const getCode = (name) => name.split("-")[0]?.trim();
const getDate = (date) => moment.utc(date).format("YYYY-MM-DD");
const getAmount = (amt) => amt.toFixed(2);

function replaceStarsWithRandom(str) {
	return str.replace(/\*\*/g, () => {
		return Math.floor(Math.random() * 90 + 10);
	});
}

const generateROEXML = async (name, payPeriodId, payPeriodType) => {
	const existingCompany = await Company.findOne({ name }).select(
		"registration_number cra_business_number",
	);
	const root = xml
		.create("ROEHEADER", {
			version: "1.0",
			encoding: "UTF-8",
		})
		// .att("xmlns:xsi", "http://www.w3.org/2001/XMLSchema-instance")
		.att("FileVersion", "W-2.0")
		.att("SoftwareVendor", "Businessn")
		.att("ProductName", "Businessn-ERP")
		.att("ProductVersion", "1.0");

	const roeEmployeeList = await EmployeeROE.find({
		companyName: name,
		payPeriodId,
		payPeriodType,
	});

	for (const roeRecord of roeEmployeeList) {
		const {
			insurableHours,
			insurableEarnings,
			totalInsurableHours,
			totalInsurableEarnings,
			contactExtNumber,
			contactName,
			contactTelNumber,
			statHolidayPay,
			otherMoney,
			reviewComments,
			preferredCommunication,
			serialNoAmended,
			payrollReferenceNumber,
			payPeriodType,
			firstName,
			lastName,
			middleName,
			streetAddressSuite,
			streetAddress,
			city,
			province,
			postalCode,
			country,
			SIN,
			SINIv,
			employmentStartDate,
			employmentLeaveDate,
			finalPayPeriodEndDate,
			occupation,
			recallDate,
			expectedRecallDate,
			reasonCode,
			vacationPayEndDate,
			vacationPayStartDate,
			vacationPayAmount,
			vacationPayCode,
			specialPayments,
		} = roeRecord;

		const payPeriodTypeRecord = PAY_FREQUENCY_CODE.find(
			(_) => _.name.toLocaleLowerCase() === payPeriodType.toLocaleLowerCase(),
		);
		const sortedEarningsData = insurableEarnings.sort((a, b) => {
			return new Date(a.payPeriodEndDate) - new Date(b.payPeriodEndDate);
		});

		const sin_key = Buffer.from(process.env.SIN_ENCRYPTION_KEY, "hex");

		if (!SIN?.includes("*") && SINIv && isNaN(Number(SIN))) {
			SIN = decryptData(SIN, sin_key, SINIv);
		}
		const replacedSIN = replaceStarsWithRandom(SIN);
		const fullAddress = [streetAddressSuite, streetAddress].filter(Boolean).join(" ");

		const roe = root.ele("ROE").att("PrintingLanguage", "E").att("Issue", "S");
		roe.ele("B2", serialNoAmended);
		roe.ele("B3", payrollReferenceNumber);
		//B4 in pdf has employer info
		roe.ele("B5", existingCompany.cra_business_number); //Must be 15 alphanumeric characters CRA Payroll Account Number (aka Business Number)
		roe.ele("B6", payPeriodTypeRecord.code);
		//in pdf 	roe.ele("B6", `${payPeriodTypeRecord.code} - ${payPeriodTypeRecord.name}`);

		//b7 employr postalcode in pdf
		roe.ele("B8", replacedSIN); // encrypt on pdf

		const b9 = roe.ele("B9");
		b9.ele("FN", firstName);
		b9.ele("MN", middleName);
		b9.ele("LN", lastName);
		b9.ele("A1", fullAddress);
		b9.ele("A2", city);
		b9.ele("A3", `${province}, ${country}`);
		b9.ele("PC", postalCode);

		roe.ele("B10", getDate(employmentStartDate));
		roe.ele("B11", getDate(employmentLeaveDate));
		roe.ele("B12", getDate(finalPayPeriodEndDate));
		roe.ele("B13"); //show occupation?

		const b14 = roe.ele("B14");
		b14.ele("CD", getCode(expectedRecallDate)); //full name in pdf
		b14.ele("DT", recallDate);

		roe.ele("B15A", Math.round(totalInsurableHours));

		const b15c = roe.ele("B15C");
		// for (let i = 1; i <= payPeriodTypeRecord?.totalPayPeriod; i++) {
		// 	const pp = b15c.ele("PP").att("nbr", i);
		// 	pp.ele("AMT", sortedEarningsData[i]?.currentGrossPay);
		// }
		sortedEarningsData?.forEach((item, index) => {
			const pp = b15c.ele("PP").att("nbr", index + 1);
			pp.ele("AMT", getAmount(item?.currentGrossPay));
		});
		const b16 = roe.ele("B16");
		b16.ele("CD", getCode(reasonCode));
		b16.ele("FN", contactName.split(" ")[0]?.trim());
		b16.ele("LN", contactName.split(" ")[1]?.trim());
		b16.ele("AC", contactTelNumber.slice(0, 3));
		b16.ele("TEL", phoneStringToPattern(contactTelNumber));
		b16.ele("EXT", contactExtNumber);

		const b17a = roe.ele("B17A");
		const vp = b17a.ele("VP").att("nbr", 1);
		vp.ele("CD", getCode(vacationPayCode));
		vp.ele("SDT", vacationPayStartDate);
		vp.ele("EDT", vacationPayEndDate);
		vp.ele("AMT", vacationPayAmount);

		statHolidayPay?.forEach((item, index) => {
			const sh = b17b.ele("SH").att("nbr", index + 1);
			sh.ele("DT", item.date);
			sh.ele("AMT", item.amount);
		});

		if (otherMoney?.length) {
			const b17c = roe.ele("B17C");
			otherMoney.forEach((item, index) => {
				const om = b17c.ele("OM").att("nbr", index + 1);
				om.ele("CD", item.code);
				om.ele("SDT", item.startDate);
				om.ele("EDT", item.endDate);
				om.ele("AMT", item.amount);
			});
		}

		roe.ele("B18", reviewComments);

		const b19 = roe.ele("B19");
		specialPayments?.forEach((item) => {
			const sp = b19.ele("SP").att("cd", item.code);
			sp.ele("SDT", item.startDate);
			sp.ele("EDT", item.endDate);
			sp.ele("AMT", item.amount);
			sp.ele("PRD", item.code);
		});

		roe.ele("B20", preferredCommunication);
	}

	const xmlROEData = root.end({ pretty: true });

	const fileName = `BUSINESSN_ROE_${moment.utc().format("YYYYMMDD")}_${payPeriodId}.BLK`;

	const filePath = path.join(SAVE_FILE_OUTPUT_DIR, fileName);

	parser.parseString(xmlROEData, (err, result) => {
		if (err) {
			console.error("Parsing failed:", err);
		} else {
			fs.writeFileSync(filePath, xmlROEData, "utf8", (err) => {
				if (err) {
					console.log("Error writing BLK file:", err);
				}
			});
		}
	});
};

module.exports = {
	getEmployeeROEEmploymentInfo,
	addEmployeeROEEmploymentInfo,
	getEmployeeEarningsInfo,
};
