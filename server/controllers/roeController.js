const xml = require("xmlbuilder");
const path = require("path");
const moment = require("moment");
const xml2js = require("xml2js");
const parser = new xml2js.Parser({ explicitArray: false });
const fs = require("fs");

const EmployeeROE = require("../models/EmployeeROE");
const { findEmployeeEmploymentInfo, updateEmploymentInfo } = require("./employmentInfoController");
const EmployeePayStub = require("../models/EmployeePayStub");
const { SAVE_FILE_OUTPUT_DIR } = require("./t4SlipController");
const Company = require("../models/Company");

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
		res.status(404).json({ error: error.message });
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
		res.status(200).json(payStubs);
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
};

const addEmployeeROEEmploymentInfo = async (req, res) => {
	const {
		empId,
		companyName,
		employmentStartDate,
		employmentLeaveDate,
		finalPayPeriodEndDate,
		reasonCode,
		expectedRecallDate,
		recallDate,
		contactExtNumber,
		contactName,
		contactTelNumber,
		issuerExtNumber,
		issuerName,
		issuerTelNumber,
		preferredCommunication,
	} = req.body;
	try {
		const empTenureInfo = await findEmployeeEmploymentInfo(empId, companyName);
		req.body.updatedOn = moment();
		if (empTenureInfo && employmentStartDate && employmentLeaveDate) {
			await updateEmploymentInfo(empTenureInfo._id, {
				employmentStartDate,
				employmentLeaveDate,
			});
		}
		const existingROEInfo = await findEmployeeROEInfoDetails(empId, companyName);

		if (existingROEInfo) {
			const updatedROEInfo = await EmployeeROE.findByIdAndUpdate(existingROEInfo._id, req.body, {
				new: true,
			});
			return res.status(201).json(updatedROEInfo);
		}
		const newROEInfo = await EmployeeROE.create({
			empId,
			companyName,
			employmentStartDate,
			employmentLeaveDate,
			finalPayPeriodEndDate,
			reasonCode,
			expectedRecallDate,
			recallDate,
			contactExtNumber,
			contactName,
			contactTelNumber,
			issuerExtNumber,
			issuerName,
			issuerTelNumber,
			preferredCommunication,
		});
		return res.status(201).json(newROEInfo);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

const generateROEXML = async (companyName, payPeriodNum, payPeriodEndDate) => {
	const existingCompany = await Company.findOne({ name }).select(
		"registration_number name cra_business_number",
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
		companyName,
		payPeriodNum,
	});

	for (const roeRecord of roeEmployeeList) {
		const {
			insurableHours,
			insurableEarnings,
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

		const sin_key = Buffer.from(process.env.SIN_ENCRYPTION_KEY, "hex");

		if (!SIN?.includes("*") && SINIv && isNaN(Number(SIN))) {
			SIN = decryptData(SIN, sin_key, SINIv);
		}

		const roe = root.ele("ROE").att("PrintingLanguage", "E").att("Issue", "S");
		roe.ele("B2", serialNoAmended);
		roe.ele("B3", payrollReferenceNumber);
		roe.ele("B5", existingCompany.registration_number); //existingCompany.cra_business_number CRA Payroll Account Number (aka Business Number)
		roe.ele("B6", payPeriodType);

		roe.ele("B8", SIN);

		const b9 = roe.ele("B9");
		b9.ele("FN", firstName);
		b9.ele("MN", middleName);
		b9.ele("LN", lastName);
		b9.ele("A1", `${streetAddressSuite} ${streetAddress}`);
		b9.ele("A2", city);
		b9.ele("A3", `${province}, ${country}`);
		b9.ele("PC", postalCode);

		roe.ele("B10", employmentStartDate);
		roe.ele("B11", employmentLeaveDate);
		roe.ele("B12", finalPayPeriodEndDate);
		roe.ele("B13", occupation);

		const b14 = roe.ele("B14");
		b14.ele("CD", expectedRecallDate.split("-")[0]);
		b14.ele("DT", recallDate);

		const b15a = roe.ele("B15A");

		// 		Table 8: 15A.1 – Maximum Insurable Hours to enter in Block 15A
		// Pay Period type code (Block 6)	Description	Maximum number of Pay Periods to include for Total Insurable Hours (Block 15A)
		// B	Bi-weekly	Last 27
		// M	Monthly	Last 13
		// O	Monthly non-standard	Last 13
		// S	Semi-monthly	Last 25
		// E	Semi-monthly non-standard	Last 25
		// H	13 Pay Periods per year	Last 14
		// W	Weekly	Last 53

		for (let i = 1; i <= 53; i++) {
			// Up to 53 Pay Periods
			const pp = b15a.ele("PP").att("nbr", i);
			pp.ele("AMT", insurableHours[i]); //Insurable Hours Information
		}
		//The number of Insurable Hours must be less than or equal to (Last Day for Which Paid – First day worked + 1) x 24 according to table 15A.1.
		const b15c = roe.ele("B15C");

		// 		Table 9: 15C.1 – Maximum number of Pay Periods to enter in Block 15C
		// Pay Period type code (Block 6)	Description	Maximum number of Pay Periods to enter in Block 15C
		// B	Bi-weekly	Last 27
		// M	Monthly	Last 13
		// O	Monthly non-standard	Last 13
		// S	Semi-monthly	Last 25
		// E	Semi-monthly non-standard	Last 25
		// H	13 Pay Periods per year	Last 14
		// W	Weekly	Last 53

		for (let i = 1; i <= 53; i++) {
			// Up to 53 Pay Periods
			const pp = b15c.ele("PP").att("nbr", i);
			pp.ele("AMT", insurableEarnings[i]); //Insurable Earnings Information
		}

		const b16 = roe.ele("B16");
		b16.ele("CD", reasonCode.split("-")[0]);
		b16.ele("FN", contactName.split(" ")[0]);
		b16.ele("LN", contactName.split(" ")[1]);
		b16.ele("AC", contactTelNumber.slice(0, 3));
		b16.ele("TEL", contactTelNumber);
		b16.ele("EXT", contactExtNumber);

		const b17a = roe.ele("B17A");
		const vp = b17a.ele("VP").att("nbr", 1);
		vp.ele("CD", vacationPayCode);
		vp.ele("SDT", vacationPayStartDate);
		vp.ele("EDT", vacationPayEndDate);
		vp.ele("AMT", vacationPayAmount);

		const b17b = roe.ele("B17B");
		for (let i = 1; i <= 10; i++) {
			const sh = b17b.ele("SH").att("nbr", i);
			sh.ele("DT", statHolidayPay[i].date);
			sh.ele("AMT", statHolidayPay[i].amount);
		}

		const b17c = roe.ele("B17C");
		for (let i = 1; i <= 3; i++) {
			const om = b17c.ele("OM").att("nbr", i);
			om.ele("CD", otherMoney[i].code);
			om.ele("SDT", otherMoney[i].startDate);
			om.ele("EDT", otherMoney[i].endDate);
			om.ele("AMT", otherMoney[i].amount);
		}
		roe.ele("B18", reviewComments);
		const b19 = roe.ele("B19");
		for (let i = 1; i <= 3; i++) {
			const sp = b19.ele("SP").att("cd", specialPayments[i].code);
			sp.ele("SDT", specialPayments[i].startDate);
			sp.ele("EDT", specialPayments[i].endDate);
			sp.ele("AMT", specialPayments[i].amount);
			sp.ele("PRD", specialPayments[i].code);
		}
		roe.ele("B20", preferredCommunication);
	}
	const xmlROEData = root.end({ pretty: true });

	const fileName = `ROE_${moment.utc().format("DD_MM_YYYY")}.BLK`;

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
