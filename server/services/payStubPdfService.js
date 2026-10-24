const path = require("path");
const PDFDocument = require("pdfkit");
const moment = require("moment");
const { ToWords } = require("to-words");
const {
	EARNINGS_TYPES,
	DEDUCTION_TYPES,
	NET_SUMMARY,
	ACCRUAL_TYPES,
	SUM_TOTALS,
	EARNINGS_COLS,
	DEDUCTIONS_COLS,
	NET_SUMMARY_COLS,
	PAYRUN_TYPE_CODE,
	getReportName,
} = require("../constants/paystub.constants");

/**
 * PAYSTUB-EMAIL: the e-mailed PDF is the full in-app earnings statement, i.e.
 * what "Print" on the PayStubStatement produces (A4 portrait, 10mm x 8mm margins):
 *
 *   client/src/erp-modules/payroll/process-payroll/statement/PayStubStatement.jsx
 *     PayStubHeader     logo, company name + address, "EARNINGS STATEMENT"
 *     cover watermark   assets/coverImgPaystub.png at opacity 0.2
 *     EmployeeInfo      pay details, employee, Employer Paid Benefits, Vacation
 *     EmployeePayDetails Earnings, Deductions, Net Pay Summary
 *     ChequeDetails     header, payment date, amount in words, payment method
 *
 * Rows, visibility and number formats follow those components (and
 * constants/paystub.constants.js copies their row lists); positions are the
 * printed layout converted to points. The browser is not involved, so this is a
 * pure function of (stub, employee, company).
 */

const ASSETS = path.join(__dirname, "../assets/paystub");
const LOGO = path.join(ASSETS, "logo.jpg"); // client/src/assets/logos/BusinessN_lightLogo.jpg
const COVER = path.join(ASSETS, "cover.jpg"); // coverImgPaystub.png, pre-faded like the opacity(0.2) overlay

// App.css colour variables used by the statement
const BLACK = "#000000"; // --main_color_black
const PANEL = "#f4f8fa"; // --primary_bg_1
const NAV = "#485763"; // --nav_color
const AMOUNT_BG = "#bbbbbb"; // --calendar_border
const NOTICE = "#d3d3d3"; // --filter_border_color
const HEAD = "#4a5568"; // Chakra table header text
const RULE = "#e2e8f0"; // Chakra table row border

const PAGE = { width: 595.28, height: 841.89 }; // A4
const MX = 22.7; // 8mm
const MY = 28.35; // 10mm
const W = PAGE.width - 2 * MX;
const FS = 7.8; // Chakra "xs" text at print scale
const ROW = 12.5;

const toWords = new ToWords({
	localeCode: "en-US",
	converterOptions: {
		currency: true,
		ignoreZeroCurrency: false,
		ignoreDecimal: false,
		ignorePlural: false,
		ordinal: false,
		currencyOptions: {
			name: "Dollar",
			plural: "Dollars",
			symbol: "$",
			fractionalUnit: { name: "Cent", plural: "Cents", symbol: "" },
		},
	},
});

// ---- client formatting helpers (utils/convertAmt.js, utils/convertDate.js, utils/common.js) ----
const toNum = (v) => (Number.isFinite(Number(v)) ? Number(v) : 0);
/** roundUpNumber */
const fixed = (v) => toNum(v).toFixed(2);
/** getAmount */
const amount = (v) => `$${v ? Math.abs(toNum(v)).toFixed(2) : "0.00"}`;
/** formatDateBar */
const dateBar = (d) => (d ? moment.utc(d).format("DD/MM/YYYY") : "");
/** monthDayYearFormat */
const monthDayYear = (d) => (d ? moment.utc(d).format("MMMM, DD, YYYY") : "");
const capitalize = (s) => s.replace(/\b\w/g, (m) => m.toUpperCase());
/** HTML collapses runs of spaces; the PDF must do it explicitly */
const collapse = (s) => s.replace(/\s+/g, " ").trim();
/** getFormattedAddress (company, header) */
const formattedAddress = (a) =>
	a
		? collapse(
				capitalize(
					`${a.streetNumber || ""} ${a.city || ""}, ${a.state || ""} ${a.country || ""} ${a.postalCode || ""}`,
				),
			)
		: "";
/** EmployeeInfo buildAddress */
const cityLine = (a) =>
	collapse(`${a?.city || ""}${a?.city ? "," : ""}  ${a?.state || ""} ${a?.postalCode || ""}`);

// ---- row rules (EarningsTable.jsx, InformationSection.jsx, ItemRow.jsx) ----
const value = (data, key) => (key ? data[key] : undefined);

/** EarningsTable: which earnings / deduction / summary rows are shown */
const isShownEarningRow = (row, data) =>
	!row.name.includes("Federal") &&
	!row.name.includes("Provincial") &&
	(row.name === "Regular" ||
		row.name === "Net Pay" ||
		row.name.includes("Gross ") ||
		value(data, row.currentTotal) > 0 ||
		value(data, row.YTDHoursTotal) > 0 ||
		value(data, row.YTDTotal) > 0);

/** InformationSection: which benefit / vacation rows are shown */
const isShownInfoRow = (row, data) =>
	value(data, row.YTDTotal) >= 0 ||
	["CPP", "Vacation", "Balance", "Benefits"].some((word) => row.name.includes(word));

/** ItemRow: bold total lines */
const isTotalRow = (title, isNetSummary) =>
	Boolean(
		(!isNetSummary && SUM_TOTALS.find((t) => title.includes(t))) ||
		(isNetSummary && title.includes("Net Pay")) ||
		title.includes("Gross Earnings") ||
		title.includes("Total Deductions"),
	);

/** The cells of one ItemRow; null = the cell is hidden (visibility: hidden). */
const itemCells = (row, data, { isNetSummary = false } = {}) => {
	const rate = toNum(value(data, row.rate) ?? 0);
	const totalHours = toNum(value(data, row.totalHours) ?? 0);
	const isTotals = isTotalRow(row.name, isNetSummary);
	const noHours = !row.isEarning && totalHours === 0;
	return {
		title: row.name,
		bold: isTotals,
		rate: rate === 0 ? null : fixed(rate),
		hours: noHours ? null : totalHours.toFixed(2),
		current: row.name === "Available Balance" ? null : fixed(value(data, row.currentTotal) ?? 0),
		ytdHours: isTotals || noHours ? null : toNum(value(data, row.YTDHoursTotal) ?? 0).toFixed(2),
		ytd: fixed(value(data, row.YTDTotal) ?? 0),
	};
};

/** Lines of each statement section, exactly as the app decides them. */
const statementRows = (data) => ({
	earnings: EARNINGS_TYPES.filter((r) => isShownEarningRow(r, data)).map((r) => itemCells(r, data)),
	deductions: DEDUCTION_TYPES.filter((r) => isShownEarningRow(r, data)).map((r) =>
		itemCells(r, data),
	),
	netSummary: NET_SUMMARY.filter((r) => isShownEarningRow(r, data)).map((r) =>
		itemCells(r, data, { isNetSummary: true }),
	),
	accruals: ACCRUAL_TYPES.map(({ type, items }) => ({
		type,
		rows: items.filter((r) => isShownInfoRow(r, data)).map((r) => itemCells(r, data)),
	})),
});

/**
 * The statement's data: the stub with empId resolved to the employee (the app
 * loads it populated) and the ChequeDetails rule that a superficial balance run
 * pays nothing.
 */
const statementData = (stub, employee = {}) => {
	const populated =
		stub.empId && typeof stub.empId === "object" && stub.empId.fullName ? stub.empId : {};
	const data = {
		...stub,
		empId: {
			fullName: employee.fullName || populated.fullName || "",
			employeeNo: employee.employeeNo || populated.employeeNo || "",
			primaryAddress: employee.primaryAddress || populated.primaryAddress || null,
		},
	};
	if (data.reportType === PAYRUN_TYPE_CODE.SUPERFICIAL) data.currentNetPay = 0;
	return data;
};

const paymentMethod = (data) =>
	data.reportType === PAYRUN_TYPE_CODE.MANUAL ? "Manual" : "DIRECT DEPOSIT";
const amountInWords = (net) => toWords.convert(toNum(net));

// ---- drawing ----
const font = (doc, bold, size = FS, color = BLACK) =>
	doc
		.font(bold ? "Helvetica-Bold" : "Helvetica")
		.fontSize(size)
		.fillColor(color);

/** At most this many lines per cell (ellipsis after), so no value can push the page over. */
const MAX_LINES = 3;
const maxHeight = (doc) => MAX_LINES * (doc.currentLineHeight(true) + 0.5);
/** Height of `str` wrapped to `width` in the current font, capped at MAX_LINES. */
const textHeight = (doc, str, width) =>
	Math.min(doc.heightOfString(str, { width, lineGap: 0.5 }), maxHeight(doc));

/** Writes text in a box; returns the height it used. */
const cell = (
	doc,
	text,
	x,
	y,
	width,
	{ bold = false, size = FS, color = BLACK, align = "left" } = {},
) => {
	const str = text === null || text === undefined ? "" : String(text);
	if (!str) return 0;
	font(doc, bold, size, color);
	const h = textHeight(doc, str, width);
	doc.text(str, x, y, { width, align, lineGap: 0.5, height: maxHeight(doc), ellipsis: true });
	return h;
};

const heavyRule = (doc, x, y, width) =>
	doc
		.moveTo(x, y)
		.lineTo(x + width, y)
		.lineWidth(2.2)
		.strokeColor(BLACK)
		.stroke();
const thinRule = (doc, x, y, width) =>
	doc
		.moveTo(x, y)
		.lineTo(x + width, y)
		.lineWidth(0.5)
		.strokeColor(RULE)
		.stroke();

/** PayStubHeader: logo | company name + address | EARNINGS STATEMENT. Returns its height. */
const drawHeader = (doc, y, company) => {
	const logoW = 0.4 * W;
	const logoH = 36;
	const infoX = MX + 0.413 * W;
	const infoW = 0.21 * W;
	let h = cell(doc, company.name, infoX, y + 2, infoW, {
		bold: true,
		size: 9.5,
	});
	h += cell(doc, formattedAddress(company.address), infoX, y + 2 + h, infoW, {
		bold: true,
	});
	const height = Math.max(logoH, h + 4);
	// object-fit: cover; pdfkit scales but does not crop, so clip to the logo box
	const logoY = y + (height - logoH) / 2;
	doc.save().rect(MX, logoY, logoW, logoH).clip();
	doc.image(LOGO, MX, logoY, {
		cover: [logoW, logoH],
		align: "center",
		valign: "center",
	});
	doc.restore();
	font(doc, true, 11, NAV);
	const titleX = MX + 0.68 * W;
	doc.text("EARNINGS STATEMENT", titleX, y + height / 2 - 5, {
		width: W - 0.68 * W,
		align: "center",
	});
	return height;
};

/** EmployeeInfo: the light panel with pay and employee details. */
const drawEmployeePanel = (doc, x, y, width, data, company) => {
	const pad = 6;
	const half = (width - 2 * pad) / 2;
	const lines = [
		["Report Type:", getReportName(data.reportType)],
		["Net Pay:", amount(data.currentNetPay)],
		["Pay Date:", dateBar(data.payPeriodPayDate)],
		["Pay Start Date:", dateBar(data.payPeriodStartDate)],
		["Pay End Date:", dateBar(data.payPeriodEndDate)],
		null,
		["Name:", data.empId.fullName],
		["Address:", data.empId.primaryAddress?.streetNumber || "NA"],
		["", cityLine(data.empId.primaryAddress)],
		null,
		["Employee#:", data.empId.employeeNo],
		["Company#:", company.registration_number],
	];
	const measure = (v) => (
		font(doc, true),
		textHeight(doc, String(v || " "), half)
	);
	const height = lines.reduce((s, l) => s + (l ? Math.max(ROW, measure(l[1]) + 3) : ROW), 2 * pad);
	doc.rect(x, y, width, height).fill(PANEL);
	let yy = y + pad;
	for (const line of lines) {
		if (!line) {
			yy += ROW;
			continue;
		}
		cell(doc, line[0], x + pad, yy, half, { bold: true, color: HEAD });
		const h = cell(doc, line[1], x + pad + half, yy, half, { bold: true });
		yy += Math.max(ROW, h + 3);
	}
	return height;
};

/** InformationSection: [type | Current Total | YTD Totals] table. Returns its height. */
const drawInfoTable = (doc, x, y, width, { type, rows }) => {
	const nameW = 0.48 * width;
	const numW = 0.26 * width;
	const cols = [x + 2, x + nameW, x + nameW + numW];
	const headH =
		Math.max(
			(font(doc, true, 7, HEAD), doc.heightOfString(type, { width: nameW - 4 })),
			doc.heightOfString("Current Total", { width: numW - 4 }),
		) + 6;
	doc.rect(x, y, width, headH).fill(PANEL);
	cell(doc, type, cols[0], y + 3, nameW - 4, {
		bold: true,
		size: 7,
		color: HEAD,
	});
	cell(doc, "Current Total", cols[1], y + 3, numW - 4, {
		bold: true,
		size: 7,
		color: HEAD,
		align: "right",
	});
	cell(doc, "YTD Totals", cols[2], y + 3, numW - 4, {
		bold: true,
		size: 7,
		color: HEAD,
		align: "right",
	});
	let yy = y + headH;
	for (const r of rows) {
		font(doc, r.bold);
		const h = Math.max(ROW, textHeight(doc, r.title, nameW - 4) + 3);
		const mid = yy + (h - FS) / 2 - 1;
		cell(doc, r.title, cols[0], yy + 1.5, nameW - 4, { bold: r.bold });
		cell(doc, r.current, cols[1], mid, numW - 4, {
			bold: r.bold,
			align: "right",
		});
		cell(doc, r.ytd, cols[2], mid, numW - 4, { bold: r.bold, align: "right" });
		yy += h;
		thinRule(doc, x, yy, width);
	}
	return yy - y;
};

/** EarningsTable: six columns (name, Rate, Hours, Curr. Total, YTD Hrs., YTD Totals). */
const drawEarningsTable = (doc, x, y, width, cols, rows, { band }) => {
	// right edges of the numeric columns as a share of the table width
	const edges = [0.25, 0.34, 0.47, 0.65, 0.83, 0.995];
	const colX = (i) => x + (i === 0 ? 2 : edges[i - 1] * width);
	const colW = (i) => (i === 0 ? edges[0] * width : (edges[i] - edges[i - 1]) * width) - 2;
	const headH = ROW + 2;
	if (band) doc.rect(x, y, width, headH).fill(PANEL);
	cols.forEach((c, i) =>
		cell(doc, c, colX(i), y + 3, colW(i), {
			bold: true,
			size: 7,
			color: HEAD,
			align: i ? "right" : "left",
		}),
	);
	let yy = y + headH;
	for (const r of rows) {
		[r.title, r.rate, r.hours, r.current, r.ytdHours, r.ytd].forEach((v, i) =>
			cell(doc, v, colX(i), yy + 2, colW(i), {
				bold: r.bold && (i === 0 || i === 3 || i === 5),
				align: i ? "right" : "left",
			}),
		);
		yy += ROW;
		thinRule(doc, x, yy, width);
	}
	return yy - y;
};

/** EmployeePayDetails: Earnings / Current / Year to Date band, then the three tables. */
const drawPayDetails = (doc, x, y, width, rows) => {
	let yy = y;
	doc.rect(x, yy, width, ROW + 2).fill(PANEL);
	cell(doc, "Earnings", x + 2, yy + 3, 0.3 * width, {
		bold: true,
		color: HEAD,
	});
	cell(doc, "Current", x + 0.36 * width, yy + 3, 0.28 * width, {
		bold: true,
		color: HEAD,
		align: "center",
	});
	cell(doc, "Year to Date", x + 0.7 * width, yy + 3, 0.27 * width, {
		bold: true,
		color: HEAD,
		align: "center",
	});
	yy += ROW + 2;
	yy += drawEarningsTable(doc, x, yy, width, EARNINGS_COLS, rows.earnings, {
		band: false,
	});
	yy += 6;
	yy += drawEarningsTable(doc, x, yy, width, DEDUCTIONS_COLS, rows.deductions, {
		band: true,
	});
	yy += 6;
	yy += drawEarningsTable(doc, x, yy, width, NET_SUMMARY_COLS, rows.netSummary, { band: true });
	return yy - y;
};

/** ChequeDetails (desktop / print variant). */
const CHEQUE_HEIGHT = 170;
const drawCheque = (doc, y, data, company) => {
	let yy = y + drawHeader(doc, y, company) + 10;
	const bx = MX + 0.01 * W;
	const bw = 0.98 * W;
	cell(doc, `Payment Date: ${monthDayYear(data.payPeriodPayDate)}`, bx, yy, bw - 23, {
		bold: true,
		align: "right",
	});
	yy += ROW + 4;
	const gap = 6;
	const c1 = 0.2 * bw - gap;
	const c2 = 0.6 * bw - gap;
	const c3 = 0.2 * bw - gap;
	const x2 = bx + 0.2 * bw;
	const x3 = bx + 0.8 * bw;
	const infoText = (label, text, extra, hasBg) => {
		font(doc, true);
		const pad = hasBg ? 3 : 0;
		const h = textHeight(doc, text || " ", c2 - 2 * pad) + 2 * pad;
		const rowH = Math.max(ROW + 2, h + 4);
		const top = yy + (rowH - h) / 2;
		if (hasBg) {
			doc.lineWidth(0.75).rect(x2, top, c2, h).fillAndStroke(AMOUNT_BG, BLACK);
		}
		cell(doc, label, bx, top + pad, c1);
		cell(doc, text, x2 + pad, top + pad, c2 - 2 * pad, { bold: true });
		cell(doc, extra, x3, top + pad, c3, { bold: true });
		yy += rowH;
	};
	infoText("Account holder:", data.empId.fullName);
	infoText("The amount:", amountInWords(data.currentNetPay), amount(data.currentNetPay), true);
	infoText("Payment method:", paymentMethod(data));
	yy += 20;
	cell(doc, "THIS IS NOT A CHEQUE. DO NOT DEPOSIT.", MX, yy, W, {
		bold: true,
		size: 11,
		color: NOTICE,
		align: "center",
	});
};

const LEFT_W = 0.295 * W;
const RIGHT_X = MX + LEFT_W + 0.014 * W;
const RIGHT_W = W - LEFT_W - 0.014 * W;

/**
 * The cover watermark behind the statement body: background-size contain,
 * centred, and (CSS default) repeated, which in print fills the body area.
 */
const COVER_RATIO = 780 / 1200; // assets/paystub/cover.jpg height / width
const drawWatermark = (doc, top, bottom) => {
	const h = W * COVER_RATIO;
	let y = top + (bottom - top - h) / 2;
	while (y > top) y -= h;
	doc
		.save()
		.rect(MX, top, W, bottom - top)
		.clip();
	for (; y < bottom; y += h) doc.image(COVER, MX, y, { width: W, height: h });
	doc.restore();
};

/** The two columns (EmployeeInfo | EmployeePayDetails); returns where each ends. */
const drawBody = (doc, top, data, rows, company) => {
	heavyRule(doc, MX, top + 1, LEFT_W);
	let ly = top + 2.2;
	ly += drawEmployeePanel(doc, MX, ly, LEFT_W, data, company);
	for (const section of rows.accruals) {
		ly += 5;
		ly += drawInfoTable(doc, MX, ly, LEFT_W, section);
	}
	heavyRule(doc, MX, ly + 2, LEFT_W);

	heavyRule(doc, RIGHT_X, top + 1, RIGHT_W);
	const ry = top + 2.2 + drawPayDetails(doc, RIGHT_X, top + 2.2, RIGHT_W, rows);
	heavyRule(doc, RIGHT_X, ry + 2, RIGHT_W);
	return { left: ly + 3.1, right: ry + 3.1 };
};

/**
 * Renders one pay stub to a PDF Buffer: the printed PayStubStatement. No I/O
 * except reading the two image assets.
 */
const buildPayStubPdf = (stub, employee = {}, company = {}) =>
	new Promise((resolve, reject) => {
		const companyInfo = {
			...company,
			name: company.name || stub.companyName || "",
		};
		const data = statementData(stub, employee);
		const rows = statementRows(data);

		const doc = new PDFDocument({
			size: "A4",
			margin: 0, // everything is placed absolutely; no automatic page breaks
			info: { Title: "Earnings Statement", Author: companyInfo.name },
		});
		const chunks = [];
		doc.on("data", (c) => chunks.push(c));
		doc.on("end", () => resolve(Buffer.concat(chunks)));
		doc.on("error", reject);

		try {
			const headerH = drawHeader(doc, MY, companyInfo);
			const top = MY + headerH + 6;
			const chequeTop = PAGE.height - MY - CHEQUE_HEIGHT;

			drawWatermark(doc, top, chequeTop - 2);

			// both columns are white cards (BoxCard) over the watermark: measure them
			// on a scratch document first, then paint the cards and draw for real
			const scratch = new PDFDocument({ size: "A4", margin: 0 });
			const size = drawBody(scratch, top, data, rows, companyInfo);
			scratch.end();
			doc.rect(MX, top, LEFT_W, size.left - top).fill("#ffffff");
			doc.rect(RIGHT_X, top, RIGHT_W, size.right - top).fill("#ffffff");
			const { left: ly, right: ry } = drawBody(doc, top, data, rows, companyInfo);

			// cheque part at the foot of the page; on a new page if the body is too long
			const bodyEnd = Math.max(ly, ry) + 8;
			if (bodyEnd > chequeTop) {
				doc.addPage({ size: "A4", margin: 0 });
				drawCheque(doc, MY, data, companyInfo);
			} else {
				drawCheque(doc, chequeTop, data, companyInfo);
			}
			doc.end();
		} catch (error) {
			reject(error);
		}
	});

/** ASCII letters and digits only (accents dropped, not the letter: "José" -> "Jose"). */
const fileSafe = (value) =>
	String(value ?? "")
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "")
		.replace(/[^A-Za-z0-9]+/g, "");

const payStubFileName = (stub, employee = {}) => {
	const name = fileSafe(employee.fullName || employee.firstName) || "employee";
	const period = fileSafe(stub.payPeriodNum) || "0";
	const extra = stub.isExtraRun ? "-extra" : "";
	const day = dateBar(stub.payPeriodPayDate).replace(/\//g, "-");
	return ["Paystub", `PP${period}${extra}`, day, name].filter(Boolean).join("_") + ".pdf";
};

module.exports = {
	buildPayStubPdf,
	payStubFileName,
	statementData,
	statementRows,
	amountInWords,
	paymentMethod,
};
