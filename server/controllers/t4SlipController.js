const xml = require("xmlbuilder");
const fs = require("fs");
const path = require("path");
const EmployeePayStub = require("../models/EmployeePayStub");
const EmployeeProfileInfo = require("../models/EmployeeProfileInfo");
const EmployeeEmploymentInfo = require("../models/EmployeeEmploymentInfo");
const Company = require("../models/Company");
const EmployeeGovernmentInfo = require("../models/EmployeeGovernmentInfo");
const EmployeeT4 = require("../models/EmployeeT4");
const { encryptData, decryptData } = require("../services/encryptDataService");

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
	}).select("cra_business_number registration_number name");
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

// Directory to save XML files
const outputDir = path.join(__dirname, "../", "generated-T4-xml");
if (!fs.existsSync(outputDir)) {
	fs.mkdirSync(outputDir, { recursive: true });
}

const generateT4Slip = async (companyName, payPeriodNum) => {
	const root = xml.create("Return"); // Create root node

	// const xml = create("T4SlipType");
	// 	.ele("Company", {
	// 		name: companyName,
	// 		year: moment().format("YYYY"),
	// 	}
	// );
	const t4summaryNode = root.ele("T4SummaryType");

	const payrollData = await buildT4PayrollData(companyName, payPeriodNum);

	const companyRegdNum = payrollData[0]?.companyInfo?.registration_number;

	const companyInfo = payrollData[0].companyInfo;

	const currentYear = new Date().getFullYear();
	t4summaryNode.ele("bn", companyRegdNum).up();

	const emprNameNode = t4summaryNode.ele("EMPR_NM");
	emprNameNode.ele("snm", companyInfo?.name).up();
	emprNameNode.up();
	t4summaryNode.ele("tx_yr", currentYear).up();
	t4summaryNode.ele("ReturnType", "T4").up();
	t4summaryNode.up();

	const T4Node = root.ele("T4");

	let tot_empt_incamt = 0;
	let tot_empe_cpp_amt = 0;
	let tot_empe_eip_amt = 0;
	let tot_itx_ddct_amt = 0;

	payrollData.map((paystubRecord) => {
		const { companyInfo, employeeInfo, employerInfo } = paystubRecord;

		const { empProfileInfo, empEmploymentInfo, empGovtInfo, empT4Info, name } = employeeInfo;

		const T4SlipNode = T4Node.ele("T4Slip");
		const employeeNode = T4SlipNode.ele("EMPE_NM");
		employeeNode.ele("snm", name).up();
		employeeNode.ele("gvn_nm", name).up();
		employeeNode.up();

		const addressNode = T4SlipNode.ele("EMPE_ADDR");
		addressNode.ele("street", empProfileInfo?.streetAddress).up();
		addressNode.ele("city", empProfileInfo?.city).up();
		addressNode.ele("province", empProfileInfo?.province).up();
		addressNode.ele("postalCode", empProfileInfo?.postalCode).up();
		addressNode.ele("country", empProfileInfo?.country).up();
		addressNode.up(); // Close EMPE_ADDR

		T4SlipNode.ele("sin", empProfileInfo?.SIN).up();
		// employeeNode.ele("empe_nbr", empEmploymentInfo?.employeeNo).up();
		// employeeNode.ele("bn", companyInfo?.cra_business_number).up();
		// employeeNode.ele("rpp_dpsp_rgst_nbr", empGovtInfo?.pensionPlanNumber).up();
		// employeeNode.ele("cpp_qpp_xmpt_cd", empGovtInfo?.isCPPExempt ? 1 : 0).up();
		// employeeNode.ele("ei_xmpt_cd", empGovtInfo?.isEIExempt ? 1 : 0).up();
		// employeeNode.ele("prov_pip_xmpt_cd", empGovtInfo?.isPIPExempt ? 1 : 0).up();
		// employeeNode.ele("empt_cd", empGovtInfo?.employmentCode).up();
		// employeeNode.ele("rpt_tcd", empT4Info?.slipDataType ?? "T4").up();
		// employeeNode.ele("empt_prov_cd", empEmploymentInfo?.employmentRegion).up();
		// employeeNode.ele("empr_dntl_ben_rpt_cd").up();

		const t4AmtNode = T4SlipNode.ele("T4_AMT");
		t4AmtNode.ele("empt_incamt", employeeInfo?.currentGrossPay).up();
		t4AmtNode.ele("cpp_cntrb_amt", employeeInfo?.currentCPPDeductions).up();
		// t4AmtNode.ele("cppe_cntrb_amt").up();
		// t4AmtNode.ele("qpp_cntrb_amt").up();
		// t4AmtNode.ele("qppe_cntrb_amt").up();
		t4AmtNode.ele("empe_eip_amt", employeeInfo?.currentEmployeeEIDeductions).up();
		// t4AmtNode.ele("rpp_cntrb_amt").up();
		t4AmtNode.ele("itx_ddct_amt", employeeInfo?.totalTaxDeductions).up();
		// t4AmtNode.ele("ei_insu_ern_amt", employeeInfo?.currentEmployeeEIDeductions).up();
		// t4AmtNode.ele("cpp_qpp_ern_amt").up();
		// t4AmtNode.ele("unn_dues_amt", employeeInfo?.currentUnionDuesDeductions).up();
		// t4AmtNode.ele("chrty_dons_amt").up();
		// t4AmtNode.ele("padj_amt").up();
		// t4AmtNode.ele("prov_pip_amt", employeeInfo?.currentEmployeeHealthContributions).up();
		// t4AmtNode.ele("prov_insu_ern_amt", employeeInfo?.currentEmployeePensionContributions).up();
		t4AmtNode.up();
		// const otherInfoNode = employeeNode.ele("OTH_INFO");
		// otherInfoNode.ele("hm_brd_lodg_amt").up();
		// otherInfoNode.ele("spcl_wrk_site_amt").up();
		// otherInfoNode.ele("med_trvl_amt").up();
		// otherInfoNode.ele("stok_opt_ben_amt").up();
		// otherInfoNode.up();
		T4SlipNode.up();

		tot_empt_incamt += employeeInfo?.currentGrossPay;
		tot_empe_cpp_amt += employeeInfo?.currentCPPDeductions;
		tot_empe_eip_amt += employeeInfo?.currentEmployeeEIDeductions;
		tot_itx_ddct_amt += employeeInfo?.totalTaxDeductions;
	});
	T4Node.up();
	const T4TotalNode = root.ele("T4_TAMT");
	T4TotalNode.ele("tot_empt_incamt", tot_empt_incamt).up();
	T4TotalNode.ele("tot_empe_cpp_amt", tot_empe_cpp_amt).up();
	T4TotalNode.ele("tot_empe_eip_amt", tot_empe_eip_amt).up();
	T4TotalNode.ele("tot_itx_ddct_amt", tot_itx_ddct_amt).up();
	T4TotalNode.up();

	let xmlT4Data = root.end({ pretty: true });

	const specificTags = ["empr_dntl_ben_rpt_cd", "OTH_INFO"];
	specificTags.forEach((tag) => {
		const regex = new RegExp(`</${tag}>`, "g");
		xmlT4Data = xmlT4Data.replace(regex, `</${tag}>\n`);
	});

	// File path for the XML file
	const fileName = `T4_${companyRegdNum}_${Date.now()}.xml`;
	const filePath = path.join(outputDir, fileName);

	fs.writeFileSync(filePath, xmlT4Data, (err) => {
		if (err) {
			console.error("Error writing XML file:", err);
			return res.status(500).send("Error generating T4 XML");
		}
		console.log(`XML file saved at ${filePath}`);
	});
};

const readSecureXML = () => {
	//Encrypt the XML file before sharing
	const envFilePath = path.join(__dirname, "../", "generated-T4-xml/T4_BE6743_1734417913367.xml");
	const envDecryptFilePath = path.join(
		__dirname,
		"../",
		"generated-T4-xml/T4_BE6743_1734417913367.encrypted",
	);
	const xmlString = fs.readFileSync(envFilePath, "utf8");

	const ENCRYPTION_KEY = Buffer.from(process.env.XML_ENCRYPTION_KEY, "hex");
	const encryptedXMLData = encryptData(xmlString, ENCRYPTION_KEY).encryptedData;
	const encryptedXMLDataIV = encryptData(xmlString, ENCRYPTION_KEY).iv;

	const fileName = `T4_BE6743_1734417913367.encrypted`;
	const filePath = path.join(outputDir, fileName);
	fs.writeFileSync(filePath, encryptedXMLData, { mode: 0o600 });
	console.log("Encrypted XML file created securely.");

	//dEcrypt the XML file before upload
	const encryptedContent = fs.readFileSync(envDecryptFilePath, "utf8");
	const decryptedXML = decryptData(encryptedContent, ENCRYPTION_KEY, encryptedXMLDataIV);
	console.log("Decrypted XML:", decryptedXML);
};

module.exports = { getT4Slips, generateT4Slip, getEmployeeT4Slip };
