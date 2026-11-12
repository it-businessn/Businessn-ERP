#!/usr/bin/env node
/**
 * Runs ONLY the VoPay fund transfer of an already processed pay period, to
 * check that vopayFundTransfer is reached and what VoPay answers. It does not
 * process payroll and writes nothing: pay stubs, funding totals (including
 * fundTransferStatus), journal entries and pay groups are only read.
 *
 * It reads exactly what updatePayrollProcess (reportController) reads:
 *  - the funding totals of the run (amount = totalEmpPaymentRemitCost)
 *  - the processed pay stubs of the run, those with net pay above $0.00
 * and calls the same vopayFundTransfer(companyName, fundTotals, stubs).
 *
 * DRY RUN by default: prints the amount and recipients, sends nothing.
 *
 *   cd server
 *   node scripts/run-vopay-transfer.js --period 22                 # dry run
 *   node scripts/run-vopay-transfer.js --period 22 --send          # REAL transfer
 *
 * Options: --company "<name>" (default Cornerstone), --period <n> (required),
 *   --year <yyyy> (pay-date year, default this year), --frequency Biweekly,
 *   --extra (the extra run of that period), --send, --force (see below).
 *
 * MONEY MOVES with --send (Cornerstone uses the live VoPay account). It
 * refuses when the run's fundTransferStatus is "sent" or "in_progress" (the
 * employees were already paid / are being paid) unless --force is given, and
 * since nothing is written, running --send twice pays twice.
 */

//npm run vopay:transfer -- --period 22 --send

if (process.env.NODE_ENV === "development") {
	require("dotenv").config({ path: ".env.local" });
} else {
	require("dotenv").config();
}

const mongoose = require("mongoose");
const CONFIG = require("../config/app.config");
const { COMPANIES } = require("../constants/constant");
const FundingTotalsPay = require("../models/FundingTotalsPay");
const EmployeePayStub = require("../models/EmployeePayStub");
const { payYearWindow } = require("../utils/payYear.util");
const { vopayFundTransfer } = require("../controllers/vopayController");

const parseArgs = (argv) => {
	const args = {
		company: COMPANIES.CORNERSTONE,
		frequency: "Biweekly",
		year: new Date().getUTCFullYear(),
	};
	for (let i = 0; i < argv.length; i++) {
		const a = argv[i];
		if (a === "--send") args.send = true;
		else if (a === "--force") args.force = true;
		else if (a === "--extra") args.extra = true;
		else if (["--company", "--period", "--year", "--frequency"].includes(a))
			args[a.slice(2)] = argv[++i];
	}
	args.period = Number(args.period);
	args.year = Number(args.year);
	return args;
};

/** The run, read-only: the same lookups as updatePayrollProcess. */
const loadRun = async ({ company, period, year, frequency, extra }) => {
	const searchObj = {
		companyName: company,
		payPeriodNum: period,
		isExtraRun: Boolean(extra),
		scheduleFrequency: frequency,
		payPeriodPayDate: payYearWindow(year),
	};
	const fundTotals = await FundingTotalsPay.findOne(searchObj)
		.select(
			"payPeriodNum payPeriodPayDate totalFundingWithDrawals totalEmpPaymentRemitCost totalGovtContr totalServiceCharges fundTransferStatus fundTransferAt",
		)
		.lean();
	const stubs = await EmployeePayStub.find({ ...searchObj, isProcessed: true })
		.select("empId currentNetPay")
		.lean();
	const payable = (stubs || []).filter((s) => Number(s.currentNetPay) > 0);
	return { fundTotals, stubs: stubs || [], payable };
};

const describe = ({ fundTotals, stubs, payable }) => ({
	fundingTotals: fundTotals
		? {
				id: String(fundTotals._id),
				payPeriodPayDate: fundTotals.payPeriodPayDate,
				amountToEmployees: fundTotals.totalEmpPaymentRemitCost,
				fundTransferStatus: fundTotals.fundTransferStatus || null,
				fundTransferAt: fundTotals.fundTransferAt || null,
			}
		: null,
	processedStubs: stubs.length,
	employeesWithNetPay: payable.length,
	netPay: payable.map((s) => ({ empId: String(s.empId), currentNetPay: s.currentNetPay })),
});

const run = async (argv = process.argv.slice(2), { connect = true, log = console.log } = {}) => {
	const args = parseArgs(argv);
	if (!Number.isInteger(args.period) || args.period < 1) {
		log(
			'Usage: node scripts/run-vopay-transfer.js --period 22 [--year 2026] [--company "..."] [--frequency Biweekly] [--extra] [--send]',
		);
		return { status: "usage" };
	}
	if (connect) await mongoose.connect(CONFIG.MONGO_URI, { autoIndex: false, autoCreate: false });
	try {
		const runData = await loadRun(args);
		log(
			`Pay period ${args.period}${args.extra ? " (extra run)" : ""}, ${args.year}, ${args.frequency}, ${args.company}`,
		);
		log(JSON.stringify(describe(runData), null, 2));

		if (!runData.fundTotals) {
			log(
				"No funding totals for this run: updatePayrollProcess would not call vopayFundTransfer either.",
			);
			return { status: "not_found" };
		}
		const already = runData.fundTotals.fundTransferStatus;
		if (["sent", "in_progress"].includes(already) && !args.force) {
			log(
				`Refused: this run's transfer is already "${already}". Check VoPay first; --force sends again.`,
			);
			return { status: "refused", reason: already };
		}
		if (!args.send) {
			log("DRY RUN: nothing sent. Add --send to call vopayFundTransfer (real money).");
			return { status: "dry_run", ...describe(runData) };
		}
		log("Calling vopayFundTransfer ...");
		const outcome = await vopayFundTransfer(args.company, runData.fundTotals, runData.payable);
		log(`vopayFundTransfer returned: ${JSON.stringify(outcome)}`);
		log("Nothing was written to the database (fundTransferStatus unchanged).");
		return { status: "called", outcome };
	} finally {
		if (connect) await mongoose.disconnect().catch(() => {});
	}
};

module.exports = { run, parseArgs, loadRun };

if (require.main === module) {
	run().catch((error) => {
		console.error("run-vopay-transfer failed:", error.message);
		process.exitCode = 1;
	});
}
