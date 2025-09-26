const EmployeeBalanceInfo = require("../models/EmployeeBalanceInfo");
const EmployeeBankingInfo = require("../models/EmployeeBankingInfo");
const EmployeeEmploymentInfo = require("../models/EmployeeEmploymentInfo");
const EmployeeGovernmentInfo = require("../models/EmployeeGovernmentInfo");
const EmployeePayInfo = require("../models/EmployeePayInfo");
const EmployeeProfileInfo = require("../models/EmployeeProfileInfo");

const { encryptData } = require("../services/encryptDataService");
const { addEmployee } = require("../helpers/userHelper");
const { updateTADEmployee } = require("./timecardController");
const { getPercent } = require("../services/util");

const getNewUserID = async (companyName, data) => {
	const newEmployee = await addEmployee(companyName, data);
	return newEmployee._id;
};

const encryptSSN = (SIN) => {
	const ENCRYPTION_KEY = Buffer.from(process.env.SIN_ENCRYPTION_KEY, "hex");
	const sinEncrypted = encryptData(SIN, ENCRYPTION_KEY);
	return { SIN: sinEncrypted.encryptedData, SINIv: sinEncrypted.iv };
};

const addNewUser = async (
	companyName,
	personalInfo,
	contactInfo,
	emergencyContact,
	isAffiliate,
) => {
	const {
		firstName,
		middleName,
		lastName,
		gender,
		userEmail,
		SIN,
		birthDate,
		citizenship,
		workPermitNo,
		workPermitExpiryNo,
	} = personalInfo;

	const {
		personalEmail,
		personalPhoneNum,
		businessPhoneNum,
		businessEmail,
		streetAddress,
		streetAddressSuite,
		city,
		province,
		country,
		postalCode,
	} = contactInfo;

	const {
		emergencyFirstName,
		emergencyLastName,
		emergencyPersonalEmail,
		emergencyPersonalPhoneNum,
		emergencyContactRelationship,
	} = emergencyContact;

	const newUserEmpRecord = {
		firstName,
		middleName,
		lastName,
		email: userEmail,
		fullName: `${firstName} ${middleName} ${lastName}`,
	};
	const empId = await getNewUserID(companyName, newUserEmpRecord);
	const encryptedSSN = SIN && !SIN.includes("*") ? encryptSSN(SIN) : "";
	const isAffiliateMember = isAffiliate ? true : false;

	await EmployeeProfileInfo.create({
		isAffiliate: isAffiliateMember,
		empId,
		companyName,
		firstName,
		middleName,
		lastName,
		gender,
		emergencyFirstName,
		emergencyLastName,
		birthDate,
		SIN: encryptedSSN?.SIN || "",
		SINIv: encryptedSSN?.SINIv || "",
		citizenship,
		workPermitNo,
		workPermitExpiryNo,
		userEmail,
		personalEmail,
		personalPhoneNum,
		businessEmail,
		businessPhoneNum,
		emergencyPersonalEmail,
		emergencyPersonalPhoneNum,
		emergencyContactRelationship,
		streetAddress: `${streetAddressSuite || ""} ${streetAddress}`,
		city,
		province,
		country,
		postalCode,
	});
	return empId;
};

const addUserEmploymentInfo = async (empId, companyName, employmentInfo) => {
	const {
		payrollStatus,
		employeeNo,
		employmentStartDate,
		employmentRole,
		employmentCountry,
		employmentRegion,
		jobTitle,
		payGroup,
		costCenter,
		department,
		timeManagementBadgeID,
		employeeCardNumber,
	} = employmentInfo;

	const newEmpPosition = {
		title: jobTitle,
		employmentPayGroup: payGroup,
		employmentCostCenter: costCenter,
		employmentDepartment: department,
		timeManagementBadgeID,
		employeeCardNumber,
	};

	const newEmploymentInfo = await EmployeeEmploymentInfo.create({
		empId,
		companyName,
		payrollStatus,
		employeeNo,
		employmentStartDate,
		employmentRole,
		positions: [newEmpPosition],
		employmentRegion,
		employmentCountry,
	});
	if (newEmploymentInfo) {
		await updateTADEmployee(newEmploymentInfo.empId, companyName, newEmpPosition[0]);
	}
	return newEmpPosition;
};
// const calcPayRates = (salary) => {
// 	const { regPay } = newEmpDataPay;
// 	newEmpDataPay.overTimePay = 1.5 * regPay;
// 	newEmpDataPay.dblOverTimePay = 2 * regPay;
// 	newEmpDataPay.statPay = regPay;
// 	newEmpDataPay.statWorkPay = 1.5 * regPay;
// 	newEmpDataPay.sickPay = regPay;
// 	newEmpDataPay.vacationPay = regPay;
// 	newEmpDataPay.sprayPay = 1;
// 	newEmpDataPay.firstAidPay = 0.5;
// 	return newEmpDataPay;
// };

const addUserPayInfo = async (empId, companyName, payInfo, roleDetails) => {
	const { salary, payType, payFrequency, partTimeStandardHours, fullTimeStandardHours } = payInfo;
	const {
		title,
		employmentPayGroup,
		employmentCostCenter,
		employmentDepartment,
		timeManagementBadgeID,
		employeeCardNumber,
	} = roleDetails;

	newRole = {
		title,
		employmentPayGroup,
		employmentCostCenter,
		employmentDepartment,
		timeManagementBadgeID,
		employeeCardNumber,
		payRate: salary,
		typeOfEarning: payType,
		payFrequency,
		partTimeStandardHours,
		fullTimeStandardHours,
	};

	if (salary) {
		newRole.overTimePay = 1.5 * salary;
		newRole.dblOverTimePay = 2 * salary;
		newRole.statWorkPay = 1.5 * salary;
		newRole.statPay = salary;
		newRole.sickPay = salary;
		newRole.vacationPay = salary;
		newRole.bereavementPay = salary;
		newRole.personalDayPay = salary;
	}

	const newPayInfo = await EmployeePayInfo.create({
		empId,
		companyName,
		roles: [newRole],
	});
	return newPayInfo;
};

const addUserGovtInfo = async (empId, companyName, governmentInfo) => {
	const {
		isCPPExempt,
		isEIExempt,
		federalTax,
		regionalTax,
		federalTaxCredit,
		regionalTaxCredit,
		federalPensionEE,
		federalPensionER,
		federalEmploymentInsuranceEE,
		federalEmploymentInsuranceER,
		regionalEmployeeInjury,
		regionalEmployeeHealth,
		regionalEmployerInjury,
		regionalEmployerHealth,
	} = governmentInfo;

	const newGovernmentInfo = await EmployeeGovernmentInfo.create({
		empId,
		isCPPExempt,
		isEIExempt,
		companyName,
		federalTax,
		regionalTax,
		federalTaxCredit,
		regionalTaxCredit,
		federalPensionEE,
		federalPensionER,
		federalEmploymentInsuranceEE,
		federalEmploymentInsuranceER,
		regionalEmployeeInjury,
		regionalEmployeeHealth,
		regionalEmployerInjury,
		regionalEmployerHealth,
	});
	return newGovernmentInfo;
};

const addUserBenefitInfo = async (empId, companyName, benefitsInfo) => {
	const {
		typeOfVacationTreatment,
		vacationPayPercent,
		typeOfUnionDuesTreatment,
		unionDuesContribution,
		typeOfExtendedHealthEETreatment,
		extendedHealthEEContribution,
		typeOfDentalEETreatment,
		dentalEEContribution,
		typeOfPensionEETreatment,
		pensionEEContribution,
		typeOfExtendedHealthERTreatment,
		extendedHealthERContribution,
		typeOfDentalERTreatment,
		dentalERContribution,
		typeOfPensionERTreatment,
		pensionERContribution,
	} = benefitsInfo;

	const newBenefitInfo = {
		empId,
		companyName,
		// carryFwd,
		typeOfVacationTreatment,
		vacationPayPercent: getPercent(vacationPayPercent),
		typeOfUnionDuesTreatment,
		unionDuesContribution: typeOfUnionDuesTreatment?.includes("%")
			? getPercent(unionDuesContribution)
			: unionDuesContribution || 0,
		typeOfExtendedHealthEETreatment,
		extendedHealthEEContribution: typeOfExtendedHealthEETreatment?.includes("%")
			? getPercent(extendedHealthEEContribution)
			: extendedHealthEEContribution || 0,
		typeOfDentalEETreatment,
		dentalEEContribution: typeOfDentalEETreatment?.includes("%")
			? getPercent(dentalEEContribution)
			: dentalEEContribution || 0,
		typeOfPensionEETreatment,
		pensionEEContribution: typeOfPensionEETreatment?.includes("%")
			? getPercent(pensionEEContribution)
			: pensionEEContribution || 0,
		typeOfExtendedHealthERTreatment,
		extendedHealthERContribution: typeOfExtendedHealthERTreatment?.includes("%")
			? getPercent(extendedHealthERContribution)
			: extendedHealthERContribution || 0,
		typeOfDentalERTreatment,
		dentalERContribution: typeOfDentalERTreatment?.includes("%")
			? getPercent(dentalERContribution)
			: dentalERContribution || 0,
		typeOfPensionERTreatment,
		pensionERContribution: typeOfPensionERTreatment?.includes("%")
			? getPercent(pensionERContribution)
			: pensionERContribution || 0,
	};
	const newBalanceInfo = await EmployeeBalanceInfo.create(newBenefitInfo);
	return newBalanceInfo;
};

const addUserBankInfo = async (empId, companyName, bankingInfo) => {
	const { directDeposit, payStubSendByEmail, paymentEmail, bankNum, transitNum, accountNum } =
		bankingInfo;

	const newBankInfo = {
		empId,
		companyName,
		directDeposit,
		payStubSendByEmail,
		paymentEmail,
	};
	if (!bankNum.includes("*") && !transitNum.includes("*") && !accountNum.includes("*")) {
		const BANK_ENCRYPTION_KEY = Buffer.from(process.env.BANKING_ENCRYPTION_KEY, "hex");
		const bankEncrypted = encryptData(bankNum, BANK_ENCRYPTION_KEY);
		const transitEncrypted = encryptData(transitNum, BANK_ENCRYPTION_KEY);
		const accountEncrypted = encryptData(accountNum, BANK_ENCRYPTION_KEY);

		newBankInfo.bankNum = bankEncrypted.encryptedData;
		newBankInfo.bankIv = bankEncrypted.iv;

		newBankInfo.transitNum = transitEncrypted.encryptedData;
		newBankInfo.transitIv = transitEncrypted.iv;

		newBankInfo.accountNum = accountEncrypted.encryptedData;
		newBankInfo.accountIv = accountEncrypted.iv;
	}
	const newBankingInfo = await EmployeeBankingInfo.create(newBankInfo);
	return newBankingInfo;
};

module.exports = {
	addNewUser,
	addUserEmploymentInfo,
	addUserPayInfo,
	addUserGovtInfo,
	addUserBenefitInfo,
	addUserBankInfo,
};
