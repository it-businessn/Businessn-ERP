const xml = require("xmlbuilder");
const moment = require("moment");
const xml2js = require("xml2js");
const fs = require("fs");
// const PDFDocument = require("pdfkit");/
const path = require("path");

const EmployeePayStub = require("../models/EmployeePayStub");
const EmployeeProfileInfo = require("../models/EmployeeProfileInfo");
const EmployeeEmploymentInfo = require("../models/EmployeeEmploymentInfo");
const Company = require("../models/Company");
const EmployeeGovernmentInfo = require("../models/EmployeeGovernmentInfo");
const EmployeeT4 = require("../models/EmployeeT4");

const { encryptData, decryptData } = require("../services/encryptDataService");
const { CURRENT_YEAR } = require("../services/data");

const parser = new xml2js.Parser({ explicitArray: false });

const getT4Slips = async (req, res) => {
	const { companyName } = req.params;
};

const getEmployeeT4Slip = async (req, res) => {
	const { companyName } = req.params;
};

const buildRecord = async (record) => {
	const empProfileInfo = await EmployeeProfileInfo.findOne({
		empId: record?.empId?._id,
	}).select(
		"streetAddressSuite streetAddress city province postalCode country SIN SINIv firstName middleName lastName",
	);

	const sin_key = Buffer.from(process.env.SIN_ENCRYPTION_KEY, "hex");
	const sinExists =
		empProfileInfo?.SIN &&
		empProfileInfo?.SINIv &&
		!empProfileInfo?.SIN?.includes("*") &&
		isNaN(empProfileInfo?.SIN);

	empProfileInfo.SIN = sinExists
		? decryptData(empProfileInfo?.SIN, sin_key, empProfileInfo?.SINIv)
		: (!empProfileInfo?.SIN?.includes("*") && isNaN(Number(empProfileInfo?.SIN))) ||
		  !empProfileInfo?.SIN
		? ""
		: empProfileInfo?.SIN;
	const empEmploymentInfo = await EmployeeEmploymentInfo.findOne({
		empId: record?.empId._id,
	}).select("employeeNo employmentRegion employmentCountry");

	const companyInfo = await Company.findOne({
		name: record?.companyName,
	}).select("cra_business_number registration_number name address");
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
		empId: { $exists: true },
	})
		.populate({
			path: "empId",
			model: "Employee",
			select: ["fullName"],
		})
		.sort({
			payPeriodProcessingDate: -1,
		});

	const filteredPayrollData = payrollData.filter((item) => item.empId !== null);

	const t4Data = [];
	for (const record of filteredPayrollData) {
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
const SAVE_FILE_OUTPUT_DIR = path.join(__dirname, "../", "generated-T4-xml");
if (!fs.existsSync(SAVE_FILE_OUTPUT_DIR)) {
	fs.mkdirSync(SAVE_FILE_OUTPUT_DIR, { recursive: true });
}

const generateT4Slip = async (companyName, payPeriodNum, payPeriodEndDate) => {
	const root = xml.create("T4"); // Create root node

	// const xml = create("T4SlipType");
	// 	.ele("Company", {
	// 		name: companyName,
	// 		year: moment().format("YYYY"),
	// 	}
	// );

	const payrollData = await buildT4PayrollData(companyName, payPeriodNum);

	const companyRegdNum = payrollData[0]?.companyInfo?.registration_number;

	const companyInfo = payrollData[0].companyInfo;

	let tot_empt_incamt = 0;
	let tot_empe_cpp_amt = 0;
	let tot_empe_eip_amt = 0;
	let tot_itx_ddct_amt = 0;

	payrollData.map((paystubRecord) => {
		const { companyInfo, employeeInfo, employerInfo } = paystubRecord;

		const { empProfileInfo, empEmploymentInfo, empGovtInfo, empT4Info, name } = employeeInfo;

		const T4SlipNode = root.ele("T4Slip");
		const employeeNode = T4SlipNode.ele("EMPE_NM");
		employeeNode.ele("snm", empProfileInfo.lastName).up();
		employeeNode.ele("gvn_nm", empProfileInfo.firstName).up();
		employeeNode.ele("init").up();
		employeeNode.up();

		const addressNode = T4SlipNode.ele("EMPE_ADDR");
		addressNode.ele("addr_l1_txt", empProfileInfo?.streetAddress).up();
		addressNode.ele("addr_l2_txt", empProfileInfo?.streetAddressSuite).up();
		addressNode.ele("cty_nm", empProfileInfo?.city).up();
		addressNode
			.ele("prov_cd", empProfileInfo?.country === "CAN" ? empProfileInfo?.province : "ZZ")
			.up();
		addressNode.ele("cntry_cd", empProfileInfo?.country).up();
		addressNode.ele("pstl_cd", empProfileInfo?.postalCode).up();
		addressNode.up(); // Close EMPE_ADDR

		T4SlipNode.ele("sin", empProfileInfo?.SIN).up();
		T4SlipNode.ele("empe_nbr", empEmploymentInfo?.employeeNo).up();
		T4SlipNode.ele("bn", companyRegdNum).up();
		T4SlipNode.ele("rpp_dpsp_rgst_nbr", empGovtInfo?.pensionPlanNumber).up();
		T4SlipNode.ele("cpp_qpp_xmpt_cd", empGovtInfo?.isCPPExempt ? 1 : 0).up();
		T4SlipNode.ele("ei_xmpt_cd", empGovtInfo?.isEIExempt ? 1 : 0).up();
		T4SlipNode.ele("prov_pip_xmpt_cd", empGovtInfo?.isPIPExempt ? 1 : 0).up();
		T4SlipNode.ele("empt_cd", empGovtInfo?.employmentCode).up();
		// - originals = O
		// - amendments = A
		// - cancel = C
		T4SlipNode.ele("rpt_tcd", "O").up();
		T4SlipNode.ele(
			"empt_prov_cd",
			empEmploymentInfo?.employmentCountry === "CAN" ? empEmploymentInfo?.employmentRegion : "ZZ",
		).up();
		T4SlipNode.ele("empr_dntl_ben_rpt_cd").up();

		const t4AmtNode = T4SlipNode.ele("T4_AMT");
		t4AmtNode.ele("empt_incamt", employeeInfo?.currentGrossPay).up();
		t4AmtNode.ele("cpp_cntrb_amt", employeeInfo?.currentCPPDeductions).up();
		t4AmtNode.ele("cppe_cntrb_amt").up();
		t4AmtNode.ele("qpp_cntrb_amt").up();
		t4AmtNode.ele("qppe_cntrb_amt").up();
		t4AmtNode.ele("empe_eip_amt", employeeInfo?.currentEmployeeEIDeductions).up();
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
		const otherInfoNode = T4SlipNode.ele("OTH_INFO");
		otherInfoNode.ele("hm_brd_lodg_amt", 0).up();
		otherInfoNode.ele("spcl_wrk_site_amt", 0).up();
		otherInfoNode.ele("prscb_zn_trvl_amt", 0).up();
		otherInfoNode.ele("med_trvl_amt", 0).up();
		otherInfoNode.ele("prsnl_vhcl_amt").up();
		otherInfoNode.ele("rsn_per_km_amt", 0).up();
		otherInfoNode.ele("low_int_loan_amt", 0).up();
		otherInfoNode.ele("empe_hm_loan_amt", 0).up();
		otherInfoNode.ele("stok_opt_ben_amt", 0).up();
		otherInfoNode.ele("sob_a00_feb_amt", 0).up();
		otherInfoNode.ele("shr_opt_d_ben_amt", 0).up();
		otherInfoNode.ele("sod_d_a00_feb_amt", 0).up();
		otherInfoNode.ele("oth_tx_ben_amt", 0).up();
		otherInfoNode.ele("shr_opt_d1_ben_amt", 0).up();
		otherInfoNode.ele("sod_d1_a00_feb_amt", 0).up();
		otherInfoNode.ele("empt_cmsn_amt", 0).up();
		otherInfoNode.ele("cfppa_amt", 0).up();
		otherInfoNode.ele("dfr_sob_amt", 0).up();
		otherInfoNode.ele("elg_rtir_amt", 0).up();
		otherInfoNode.ele("nelg_rtir_amt", 0).up();
		otherInfoNode.ele("indn_elg_rtir_amt", 0).up();
		otherInfoNode.ele("indn_nelg_rtir_amt", 0).up();
		otherInfoNode.ele("mun_ofcr_examt", 0).up();
		otherInfoNode.ele("indn_empe_amt", 0).up();
		otherInfoNode.ele("oc_incamt", 0).up();
		otherInfoNode.ele("oc_dy_cnt", 0).up();
		otherInfoNode.ele("pr_90_cntrbr_amt", 0).up();
		otherInfoNode.ele("pr_90_ncntrbr_amt", 0).up();
		otherInfoNode.ele("cmpn_rpay_empr_amt", 0).up();
		otherInfoNode.ele("fish_gro_ern_amt", 0).up();
		otherInfoNode.ele("fish_net_ptnr_amt", 0).up();
		otherInfoNode.ele("fish_shr_prsn_amt", 0).up();
		otherInfoNode.ele("plcmt_emp_agcy_amt", 0).up();
		otherInfoNode.ele("drvr_taxis_oth_amt", 0).up();
		otherInfoNode.ele("brbr_hrdrssr_amt", 0).up();
		otherInfoNode.ele("pub_trnst_pass_amt", 0).up();
		otherInfoNode.ele("epaid_hlth_pln_amt", 0).up();
		otherInfoNode.ele("stok_opt_csh_out_eamt", 0).up();
		otherInfoNode.ele("vlntr_emergencyworker_xmpt_amt", 0).up();
		otherInfoNode.ele("indn_txmpt_sei_amt", 0).up();
		otherInfoNode.ele("lv_supp_top_up_amt", 0).up();
		otherInfoNode.ele("empt_inc_amt_covid_prd1", 0).up();
		otherInfoNode.ele("empt_inc_amt_covid_prd2", 0).up();
		otherInfoNode.ele("empt_inc_amt_covid_prd3", 0).up();
		otherInfoNode.ele("empt_inc_amt_covid_prd4", 0).up();
		otherInfoNode.ele("indn_xmpt_rpp_amt", 0).up();
		otherInfoNode.ele("indn_xmpt_unn_amt", 0).up();
		otherInfoNode.ele("sob_after_jun2024_amt", 0).up();
		otherInfoNode.ele("sod_d_after_jun2024_amt", 0).up();
		otherInfoNode.ele("sod_d1_after_jun2024_amt", 0).up();
		otherInfoNode.up();
		T4SlipNode.up();

		tot_empt_incamt += employeeInfo?.currentGrossPay;
		tot_empe_cpp_amt += employeeInfo?.currentCPPDeductions;
		tot_empe_eip_amt += employeeInfo?.currentEmployeeEIDeductions;
		tot_itx_ddct_amt += employeeInfo?.totalTaxDeductions;
	});
	const totalSlips = payrollData?.length;
	const t4summaryNode = root.ele("T4Summary");
	t4summaryNode.ele("bn", companyRegdNum).up();

	const emprNameNode = t4summaryNode.ele("EMPR_NM");
	emprNameNode.ele("l1_nm", companyInfo?.name).up();
	emprNameNode.ele("l2_nm").up();
	emprNameNode.ele("l3_nm").up();
	emprNameNode.up();

	const emprAddressNode = t4summaryNode.ele("EMPR_ADDR");
	const street = companyInfo?.address?.streetNumber;
	const firstSpaceIndex = street.indexOf(" ");
	const houseNumber = street.substring(0, firstSpaceIndex);
	const streetName = street.substring(firstSpaceIndex + 1);

	emprAddressNode.ele("addr_l1_txt", houseNumber).up();
	emprAddressNode.ele("addr_l2_txt", streetName).up();
	emprAddressNode.ele("cty_nm", companyInfo?.address?.city).up();
	emprAddressNode
		.ele("prov_cd", companyInfo?.address?.country === "CAN" ? companyInfo?.address?.state : "ZZ")
		.up();
	emprAddressNode.ele("cntry_cd", companyInfo?.address?.country).up();
	emprAddressNode.ele("pstl_cd", companyInfo?.address?.postalCode).up();
	emprAddressNode.up();

	const cntcNode = t4summaryNode.ele("CNTC");
	cntcNode.ele("cntc_nm", "ABC").up();
	cntcNode.ele("cntc_area_cd", "234").up();
	cntcNode.ele("cntc_phn_nbr", "3455").up();
	cntcNode.ele("cntc_extn_nbr").up();
	cntcNode.up();

	t4summaryNode.ele("tx_yr", CURRENT_YEAR).up();
	t4summaryNode.ele("slp_cnt", totalSlips).up();

	const pptrNode = t4summaryNode.ele("PPRTR_SIN");
	pptrNode.ele("pprtr_1_sin").up();
	pptrNode.ele("pprtr_2_sin").up();
	pptrNode.up();

	// - originals = O
	// - amendments = A
	// - cancel = C
	t4summaryNode.ele("rpt_tcd", "O").up();
	t4summaryNode.ele("fileramendmentnote").up();

	const T4TotalNode = t4summaryNode.ele("T4_TAMT");
	T4TotalNode.ele("tot_empt_incamt", tot_empt_incamt).up();
	T4TotalNode.ele("tot_empe_cpp_amt", tot_empe_cpp_amt).up();
	T4TotalNode.ele("tot_empe_cppe_amt", tot_empe_cpp_amt).up();
	T4TotalNode.ele("tot_empe_eip_amt", tot_empe_cpp_amt).up();
	T4TotalNode.ele("tot_rpp_cntrb_amt", tot_empe_eip_amt).up();
	T4TotalNode.ele("tot_itx_ddct_amt", tot_itx_ddct_amt).up();
	T4TotalNode.ele("tot_padj_amt", tot_itx_ddct_amt).up();
	T4TotalNode.ele("tot_empr_cpp_amt", tot_itx_ddct_amt).up();
	T4TotalNode.ele("tot_empr_cppe_amt", tot_itx_ddct_amt).up();
	T4TotalNode.ele("tot_empr_eip_amt", tot_itx_ddct_amt).up();
	T4TotalNode.up();

	t4summaryNode.up();
	// t4summaryNode.ele("ReturnType", "T4").up();
	let xmlT4Data = root.end({ pretty: true });

	// const specificTags = ["empr_dntl_ben_rpt_cd", "OTH_INFO"];
	// const specificTags = ["T4Slip"];
	// specificTags.forEach((tag) => {
	// 	const regex = new RegExp(`</${tag}>`, "g");
	// 	xmlT4Data = xmlT4Data.replace(regex, `</${tag}>\n`);
	// });

	// Testing filename
	// const fileName = `T4_${companyRegdNum}_PayPeriod#${payPeriodNum}.xml`;

	const fileName = `T4_${companyRegdNum}_${moment
		.utc(payPeriodEndDate)
		.format("DD_MM_YYYY")}_PayPeriod#${payPeriodNum}.xml`;

	const filePath = path.join(SAVE_FILE_OUTPUT_DIR, fileName);

	//check if xml file is parsed properly
	parser.parseString(xmlT4Data, (err, result) => {
		if (err) {
			console.error("Parsing failed:", err);
		} else {
			console.log("Parsed successful:");
			fs.writeFileSync(filePath, xmlT4Data, "utf8", (err) => {
				if (err) {
					console.log("Error writing XML file:", err);
				}
			});
		}
	});
};

const convertxmltopdf = () => {
	const envFilePath = path.join(__dirname, "../", "generated-T4-xml/sample1.xml");

	const xmlData = fs.readFileSync(envFilePath, "utf8");

	const xmlDir = path.dirname(envFilePath);
	const pdfPath = path.join(xmlDir, "ROE_Jane_Doe.pdf");
	parser.parseString(xmlData, (err, result) => {
		if (err) {
			console.error("Parsing failed:", err);
			return;
		}
		const roe = result.ROEHEADER.ROE;

		// Extract fields safely
		const employerBN = roe.B5 || "";
		const payPeriodCode = roe.B6 || "";
		const employeeSIN = roe.B8 || "";
		const B9 = roe.B9 || {};
		const employeeName = `${B9.FN || ""} ${B9.LN || ""}`;
		const address = `${B9.A1 || ""}, ${B9.A2 || ""}, ${B9.PC || ""}`;
		const lastDayPaid = roe.B10 || "";
		const finalPayEnd = roe.B11 || "";
		const expectedRecall = roe.B12 || "";
		const occupation = roe.B13 || "";
		const reasonCode = roe.B14?.CD || "";
		const totalEarnings = roe.B15A || "";
		const payPeriods = Array.isArray(roe.B15C?.PP) ? roe.B15C.PP : [roe.B15C?.PP || []];
		const issueReason = roe.B18 || "";
		const phone = `(${roe.B16?.AC || ""}) ${roe.B16?.TEL || ""}`;

		// Create PDF
		// const doc = new PDFDocument({ size: "LETTER", margin: 20 });
		// doc.pipe(fs.createWriteStream(pdfPath));

		// doc.font("Helvetica");

		// // Title
		// doc.fontSize(16).text("Record of Employment (ROE)", { align: "center" });
		// doc.moveDown(1);

		// let y = 60;

		// // Function to draw labeled box (with optional multi-line)
		// const drawBox = (x, y, w, h, label, value, fontSize = 10) => {
		// 	doc.rect(x, y, w, h).stroke();
		// 	doc.fontSize(8).text(label, x + 2, y + 2);
		// 	doc.fontSize(fontSize).text(value, x + 2, y + 12, { width: w - 4 });
		// };

		// // --- Employer Info ---
		// drawBox(30, y, 180, 25, "Employer BN", employerBN);
		// drawBox(220, y, 120, 25, "Pay Period Code", payPeriodCode);
		// y += 30;

		// // --- Employee Info ---
		// drawBox(30, y, 180, 25, "Employee SIN", employeeSIN);
		// drawBox(220, y, 300, 25, "Employee Name", employeeName);
		// y += 30;

		// drawBox(30, y, 490, 50, "Address", address);
		// y += 60;

		// // --- Dates & Occupation ---
		// drawBox(30, y, 150, 25, "Last Day Paid", lastDayPaid);
		// drawBox(190, y, 150, 25, "Final Pay Period End", finalPayEnd);
		// drawBox(350, y, 150, 25, "Expected Recall Date", expectedRecall);
		// y += 30;

		// drawBox(30, y, 180, 25, "Occupation", occupation);
		// drawBox(220, y, 100, 25, "Reason Code", reasonCode);
		// drawBox(330, y, 150, 25, "Total Insurable Earnings", totalEarnings);
		// y += 35;

		// // --- Pay Period Table ---
		// doc.fontSize(12).text("Pay Periods", 30, y);
		// y += 15;

		// const rowHeight = 20;
		// const col1X = 30;
		// const col2X = 130;
		// const colWidth = 100;

		// // Table header
		// doc.rect(col1X, y, colWidth, rowHeight).stroke();
		// doc.text("Period #", col1X + 5, y + 5);
		// doc.rect(col2X, y, colWidth, rowHeight).stroke();
		// doc.text("Amount", col2X + 5, y + 5);
		// y += rowHeight;

		// // Table rows
		// payPeriods.forEach((pp) => {
		// 	if (!pp) return;
		// 	const nbr = pp.$?.nbr || "";
		// 	const amt = pp.AMT || "";
		// 	doc.rect(col1X, y, colWidth, rowHeight).stroke();
		// 	doc.text(nbr, col1X + 5, y + 5);
		// 	doc.rect(col2X, y, colWidth, rowHeight).stroke();
		// 	doc.text(amt, col2X + 5, y + 5);
		// 	y += rowHeight;
		// });

		// y += 10;
		// drawBox(30, y, 490, 25, "Issue Reason", issueReason);
		// y += 30;
		// drawBox(30, y, 200, 25, "Phone", phone);

		// doc.end();
		console.log("PDF generated: ROE_Jane_Doe.pdf");
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
	const filePath = path.join(SAVE_FILE_OUTPUT_DIR, fileName);
	fs.writeFileSync(filePath, encryptedXMLData, { mode: 0o600 });
	console.log("Encrypted XML file created securely.");

	//dEcrypt the XML file before upload
	const encryptedContent = fs.readFileSync(envDecryptFilePath, "utf8");
	const decryptedXML = decryptData(encryptedContent, ENCRYPTION_KEY, encryptedXMLDataIV);
	console.log("Decrypted XML:", decryptedXML);
};

module.exports = {
	getT4Slips,
	generateT4Slip,
	getEmployeeT4Slip,
	convertxmltopdf,
	SAVE_FILE_OUTPUT_DIR,
};
