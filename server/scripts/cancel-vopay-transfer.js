#!/usr/bin/env node
/**
 * Cancels a VoPay transaction by its TransactionID (for example a payroll
 * transfer sent by vopayFundTransfer / scripts/run-vopay-transfer.js).
 * VoPay can only cancel a transaction that has not been processed yet.
 * Nothing in the database is changed (pay stubs, funding totals and
 * fundTransferStatus are not touched).
 *
 *   cd server
 *   npm run vopay:cancel -- --id 123456              # shows what would be cancelled
 *   npm run vopay:cancel -- --id 123456 --yes        # cancels it in VoPay
 *
 * Options: --company "<name>" (default Cornerstone: which VoPay account the
 * transaction is on).
 */

//npm run vopay:cancel -- --id 63698084 --yes

if (process.env.NODE_ENV === "development") {
	require("dotenv").config({ path: ".env.local" });
} else {
	require("dotenv").config();
}

const { COMPANIES } = require("../constants/constant");
const { cancelVopayTransaction } = require("../controllers/vopayController");

const parseArgs = (argv) => {
	const args = { company: COMPANIES.CORNERSTONE };
	for (let i = 0; i < argv.length; i++) {
		const a = argv[i];
		if (a === "--yes") args.yes = true;
		else if (a === "--id") args.id = argv[++i];
		else if (a === "--company") args.company = argv[++i];
	}
	return args;
};

const run = async (argv = process.argv.slice(2), { log = console.log } = {}) => {
	const args = parseArgs(argv);
	if (!args.id) {
		log('Usage: npm run vopay:cancel -- --id <TransactionID> [--company "<name>"] [--yes]');
		return { status: "usage" };
	}
	log(`VoPay transaction ${args.id} on the ${args.company} account`);
	if (!args.yes) {
		log("Nothing cancelled. Add --yes to cancel it in VoPay.");
		return { status: "dry_run", transactionId: args.id };
	}
	const result = await cancelVopayTransaction(args.company, args.id);
	log(`Result: ${JSON.stringify(result)}`);
	if (result.status === "cancelled") {
		log(
			"Cancelled in VoPay. The payroll run in the app still shows the transfer as sent; nothing in the database was changed.",
		);
	}
	return result;
};

module.exports = { run, parseArgs };

if (require.main === module) {
	run().then((r) => {
		if (r.status === "failed") process.exitCode = 1;
	});
}
