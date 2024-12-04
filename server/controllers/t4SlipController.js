const xml = require("xmlbuilder");
const fs = require("fs");
const path = require("path");
const EmployeePayStub = require("../models/EmployeePayStub");
const EmployeeProfileInfo = require("../models/EmployeeProfileInfo");
const EmployeeEmploymentInfo = require("../models/EmployeeEmploymentInfo");
const Company = require("../models/Company");
const EmployeeGovernmentInfo = require("../models/EmployeeGovernmentInfo");
const EmployeeT4 = require("../models/EmployeeT4");

const getT4Slips = async (req, res) => {
	const { companyName } = req.params;
};

const getEmployeeT4Slip = async (req, res) => {
	const { companyName } = req.params;
};

const buildRecord = async (record) => {
	const empProfileInfo = await EmployeeProfileInfo.findOne({
		empId: record?.empId._id,
	}).select("streetAddress city province postalCode country SIN");
	const empEmploymentInfo = await EmployeeEmploymentInfo.findOne({
		empId: record?.empId._id,
	}).select("employeeNo employmentRegion");

	const companyInfo = await Company.findOne({
		name: record?.companyName,
	}).select("cra_business_number registration_number");
	const empGovtInfo = await EmployeeGovernmentInfo.findOne({
		empId: record?.empId._id,
	}).select("pensionPlanNumber isCPPExempt isEIExempt isPIPExempt employmentCode");

	const empT4Info = await EmployeeT4.findOne({
		empId: record?.empId._id,
	}).select("slipDataType");
	return { empProfileInfo, empEmploymentInfo, companyInfo, empGovtInfo, empT4Info };
};

const buildT4PayrollData = async (companyName, payPeriodNum) => {
	const payrollData = await EmployeePayStub.find({
		companyName,
		payPeriodNum,
	}).populate({
		path: "empId",
		model: "Employee",
		select: ["fullName"],
	});
	const t4Data = [];
	for (const record of payrollData) {
		const {
			empId,
			currentGrossPay,
			currentCPPDeductions,
			currentStateTaxDeductions,
			currentFDTaxDeductions,
			currentEmployeeEIDeductions,
			currentUnionDuesDeductions,
			currentEmployeeHealthContributions,
			currentEmployeePensionContributions,
			currentEmployerEIDeductions,
			currentEmployerHealthContributions,
			currentEmployerPensionContributions,
		} = record;

		const { empProfileInfo, empEmploymentInfo, companyInfo, empGovtInfo, empT4Info } =
			await buildRecord(record);

		const newT4Data = {
			companyInfo,
			employeeInfo: {
				empProfileInfo,
				empEmploymentInfo,
				empGovtInfo,
				empT4Info,
				name: empId?.fullName,
				currentGrossPay,
				currentCPPDeductions,
				totalTaxDeductions: currentFDTaxDeductions + currentStateTaxDeductions,
				currentEmployeeEIDeductions,
				currentUnionDuesDeductions,
				currentEmployeeHealthContributions,
				currentEmployeePensionContributions,
			},
			employerInfo: {
				currentEmployerEIDeductions,
				currentEmployerHealthContributions,
				currentEmployerPensionContributions,
			},
		};

		t4Data.push(newT4Data);
	}

	return t4Data;
};

const generateT4Slip = async (companyName, payPeriodNum) => {
	// Directory to save XML files
	const outputDir = path.join(__dirname, "../", "generated-T4-xml");
	if (!fs.existsSync(outputDir)) {
		fs.mkdirSync(outputDir, { recursive: true });
	}
	const root = xml.create("Return"); // Create root node

	// const xml = create("T4SlipType");
	// 	.ele("Company", {
	// 		name: companyName,
	// 		year: moment().format("YYYY"),
	// 	}
	// );

	const payrollData = await buildT4PayrollData(companyName, payPeriodNum);

	const companyFileName = payrollData[0]?.companyInfo?.registration_number;

	const T4Node = root.ele("T4");

	payrollData.map((paystubRecord) => {
		const { companyInfo, employeeInfo, employerInfo } = paystubRecord;

		const { empProfileInfo, empEmploymentInfo, empGovtInfo, empT4Info, name } = employeeInfo;

		const T4SlipNode = T4Node.ele("T4Slip");
		const employeeNode = T4SlipNode.ele("EMPE_NM", name).up();

		const addressNode = employeeNode.ele("EMPE_ADDR");
		addressNode.ele("street", empProfileInfo?.streetAddress).up();
		addressNode.ele("city", empProfileInfo?.city).up();
		addressNode.ele("province", empProfileInfo?.province).up();
		addressNode.ele("postalCode", empProfileInfo?.postalCode).up();
		addressNode.ele("country", empProfileInfo?.country).up();
		addressNode.up(); // Close EMPE_ADDR

		employeeNode.ele("sin", empProfileInfo?.SIN).up();
		employeeNode.ele("empe_nbr", empEmploymentInfo?.employeeNo).up();
		employeeNode.ele("bn", companyInfo?.cra_business_number).up();
		employeeNode.ele("rpp_dpsp_rgst_nbr", empGovtInfo?.pensionPlanNumber).up();
		employeeNode.ele("cpp_qpp_xmpt_cd", empGovtInfo?.isCPPExempt ? 1 : 0).up();
		employeeNode.ele("ei_xmpt_cd", empGovtInfo?.isEIExempt ? 1 : 0).up();
		employeeNode.ele("prov_pip_xmpt_cd", empGovtInfo?.isPIPExempt ? 1 : 0).up();
		employeeNode.ele("empt_cd", empGovtInfo?.employmentCode).up();
		employeeNode.ele("rpt_tcd", empT4Info?.slipDataType ?? "T4").up();
		employeeNode.ele("empt_prov_cd", empEmploymentInfo?.employmentRegion).up();
		employeeNode.ele("empr_dntl_ben_rpt_cd").up();

		const t4AmtNode = employeeNode.ele("T4_AMT");
		t4AmtNode.ele("empt_incamt", employeeInfo?.currentGrossPay).up();
		t4AmtNode.ele("cpp_cntrb_amt", employeeInfo?.currentCPPDeductions).up();
		t4AmtNode.ele("cppe_cntrb_amt").up();
		t4AmtNode.ele("qpp_cntrb_amt").up();
		t4AmtNode.ele("qppe_cntrb_amt").up();
		t4AmtNode.ele("empe_eip_amt").up();
		t4AmtNode.ele("rpp_cntrb_amt").up();
		t4AmtNode.ele("itx_ddct_amt", employeeInfo?.totalTaxDeductions).up();
		t4AmtNode.ele("ei_insu_ern_amt", employeeInfo?.currentEmployeeEIDeductions).up();
		t4AmtNode.ele("cpp_qpp_ern_amt").up();
		t4AmtNode.ele("unn_dues_amt", employeeInfo?.currentUnionDuesDeductions).up();
		t4AmtNode.ele("chrty_dons_amt").up();
		t4AmtNode.ele("padj_amt").up();
		t4AmtNode.ele("prov_pip_amt", employeeInfo?.currentEmployeeHealthContributions).up();
		t4AmtNode.ele("prov_insu_ern_amt", employeeInfo?.currentEmployeePensionContributions).up();
		t4AmtNode.up();

		const otherInfoNode = employeeNode.ele("OTH_INFO");
		otherInfoNode.ele("hm_brd_lodg_amt").up();
		otherInfoNode.ele("spcl_wrk_site_amt").up();
		otherInfoNode.ele("med_trvl_amt").up();
		otherInfoNode.ele("stok_opt_ben_amt").up();
		otherInfoNode.up();

		T4SlipNode.up();
	});
	const T4SummmaryNode = T4Node.ele("T4Summary");
	T4SummmaryNode.ele("hm_brd_lodg_amt").up();
	T4SummmaryNode.ele("spcl_wrk_site_amt").up();
	T4SummmaryNode.ele("med_trvl_amt").up();
	T4SummmaryNode.ele("stok_opt_ben_amt").up();
	T4SummmaryNode.up();

	T4Node.up();
	let xmlT4Data = root.end({ pretty: true });
	const specificTags = ["empr_dntl_ben_rpt_cd", "T4_AMT", "OTH_INFO"];
	specificTags.forEach((tag) => {
		const regex = new RegExp(`</${tag}>`, "g");
		xmlT4Data = xmlT4Data.replace(regex, `</${tag}>\n`);
	});

	// File path for the XML file
	const fileName = `T4_${companyFileName}_${Date.now()}.xml`;
	const filePath = path.join(outputDir, fileName);

	fs.writeFile(filePath, xmlT4Data, (err) => {
		if (err) {
			console.error("Error writing XML file:", err);
			return res.status(500).send("Error generating T4 XML");
		}
		console.log(`XML file saved at ${filePath}`);
	});
};

module.exports = { getT4Slips, generateT4Slip, getEmployeeT4Slip };
