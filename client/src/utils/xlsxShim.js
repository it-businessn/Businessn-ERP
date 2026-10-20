/**
 * Minimal safe replacement for the SheetJS xlsx package.
 * Uses exceljs (actively maintained, no known CVEs) under the hood.
 * Matches only the XLSX.read() + XLSX.utils.sheet_to_json() surface used in this project.
 *
 * WHY: xlsx@0.18.5 has two unpatched CVEs (Prototype Pollution GHSA-4r6h-8v6p-xvw6,
 * ReDoS GHSA-5pgg-2g8v-p4x9). SheetJS CE is no longer published to npm.
 */
import ExcelJS from "exceljs";

/**
 * Parse an ArrayBuffer or binary string into a workbook-like object.
 * @param {ArrayBuffer|string} data
 * @param {{ type?: 'binary'|'array' }} opts
 * @returns {{ SheetNames: string[], Sheets: Record<string, any[][]> }}
 */
async function read(data, opts = {}) {
	const wb = new ExcelJS.Workbook();
	let buffer;

	if (typeof data === "string") {
		// binary string -> Uint8Array
		const len = data.length;
		const bytes = new Uint8Array(len);
		for (let i = 0; i < len; i++) bytes[i] = data.charCodeAt(i) & 0xff;
		buffer = bytes.buffer;
	} else {
		buffer = data;
	}

	await wb.xlsx.load(buffer);

	const SheetNames = [];
	const Sheets = {};

	wb.eachSheet((ws) => {
		SheetNames.push(ws.name);
		// Store raw worksheet reference for sheet_to_json
		Sheets[ws.name] = ws;
	});

	return { SheetNames, Sheets, _wb: wb };
}

/**
 * Convert a worksheet to an array of row objects (like XLSX.utils.sheet_to_json).
 * First row is treated as headers.
 * @param {ExcelJS.Worksheet} ws
 * @returns {Record<string, any>[]}
 */
function sheet_to_json(ws) {
	if (!ws || typeof ws.getRow !== "function") return [];

	const rows = [];
	let headers = [];

	ws.eachRow({ includeEmpty: false }, (row, rowNumber) => {
		const values = row.values.slice(1); // exceljs row.values[0] is always null
		if (rowNumber === 1) {
			headers = values.map((v) => (v != null ? String(v) : `col${rowNumber}`));
		} else {
			const obj = {};
			headers.forEach((h, i) => {
				const cell = values[i];
				obj[h] = cell?.result !== undefined ? cell.result : cell ?? "";
			});
			rows.push(obj);
		}
	});

	return rows;
}

/**
 * Drop-in replacement for: import * as XLSX from 'xlsx'
 * Usage:
 *   const workbook = await XLSX.read(e.target.result, { type: 'binary' });
 *   const data = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
 *
 * Note: read() is now async — callers must await it.
 */
const XLSX = {
	read,
	utils: { sheet_to_json },
};

export default XLSX;
