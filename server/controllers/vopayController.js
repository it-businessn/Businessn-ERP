const { generateVopaySignature } = require("../services/encryptDataService");
const { apiFetch } = require("../helpers/apiFetch");
const moment = require("moment");
const crypto = require("crypto");
const requireEnv = require("../helpers/requireEnv");
const { COMPANIES } = require("../constants/constant");
const { emitToCompany } = require("../helpers/socketAuth");

const VOPAY_PARTNER_ACCOUNT_ID = requireEnv("VOPAY_PARTNER_ACCOUNT_ID");
const VOPAY_API_KEY_PROD = requireEnv("VOPAY_API_KEY_PROD");
const VOPAY_SHARED_SECRET_PROD = requireEnv("VOPAY_SHARED_SECRET_PROD");
const VOPAY_API_KEY_STAGING = requireEnv("VOPAY_API_KEY_STAGING");
const VOPAY_SHARED_SECRET_STAGING = requireEnv("VOPAY_SHARED_SECRET_STAGING");
const VOPAY_BASE_URL_STAGING = requireEnv("VOPAY_BASE_URL_STAGING");
const VOPAY_PARTNER_ACCOUNT_ID_PROD_TEST = requireEnv("VOPAY_PARTNER_ACCOUNT_ID_PROD_TEST");
const VOPAY_API_KEY_PROD_TEST = requireEnv("VOPAY_API_KEY_PROD_TEST");
const VOPAY_BASE_URL_PROD = requireEnv("VOPAY_BASE_URL_PROD");
const VOPAY_SHARED_SECRET_PROD_TEST = requireEnv("VOPAY_SHARED_SECRET_PROD_TEST");

const TECHCORP_ACCOUNT_ID = requireEnv("TECHCORP_ACCOUNT_ID");
const TECHCORP_SHARED_KEY = requireEnv("TECHCORP_SHARED_KEY");
const TECHCORP_SHARED_SECRET = requireEnv("TECHCORP_SHARED_SECRET");

const CORNERSTONE_ACCOUNT_ID = requireEnv("CORNERSTONE_ACCOUNT_ID");
const CORNERSTONE_SHARED_KEY = requireEnv("CORNERSTONE_SHARED_KEY");
const CORNERSTONE_SHARED_SECRET = requireEnv("CORNERSTONE_SHARED_SECRET");
const CORNERSTONE_CLIENT_ACCOUNT_ID = requireEnv("CORNERSTONE_CLIENTACCOUNTID");

const VOPAY_CONFIG = {
	STAGING: {
		ACCOUNT_ID: VOPAY_PARTNER_ACCOUNT_ID,
		SHARED_KEY: VOPAY_API_KEY_STAGING,
		SHARED_SECRET: VOPAY_SHARED_SECRET_STAGING,
		BASE_URL: VOPAY_BASE_URL_STAGING,
	},
	TECHCORP: {
		ACCOUNT_ID: TECHCORP_ACCOUNT_ID,
		SHARED_KEY: TECHCORP_SHARED_KEY,
		SHARED_SECRET: TECHCORP_SHARED_SECRET,
		BASE_URL: VOPAY_BASE_URL_STAGING,
	},
	BUSINESSN: {
		ACCOUNT_ID: VOPAY_PARTNER_ACCOUNT_ID,
		SHARED_KEY: VOPAY_API_KEY_PROD,
		SHARED_SECRET: VOPAY_SHARED_SECRET_PROD,
		BASE_URL: VOPAY_BASE_URL_PROD,
	},
	CORNERSTONE: {
		ACCOUNT_ID: CORNERSTONE_ACCOUNT_ID,
		SHARED_KEY: CORNERSTONE_SHARED_KEY,
		SHARED_SECRET: CORNERSTONE_SHARED_SECRET,
		BASE_URL: VOPAY_BASE_URL_PROD,
	},
	PROD_TEST: {
		ACCOUNT_ID: VOPAY_PARTNER_ACCOUNT_ID_PROD_TEST,
		SHARED_KEY: VOPAY_API_KEY_PROD_TEST,
		SHARED_SECRET: VOPAY_SHARED_SECRET_PROD_TEST,
		BASE_URL: VOPAY_BASE_URL_PROD,
	},
};

// NEW-04: there is no mutable module-level "current environment" any more. The
// default account (STAGING) is fixed here; a handler that needs another account
// (only vopayFundTransfer -> CORNERSTONE today) selects it in a local const and
// signs with that same account's key/secret.
const DEFAULT_ENV = VOPAY_CONFIG.STAGING;
const { SHARED_KEY, SHARED_SECRET, ACCOUNT_ID, BASE_URL } = DEFAULT_ENV;

// CHANGES.md API #3 / NEW-15: disabled or unfinished endpoints answer instead of hanging.
const notImplemented = (res, what) =>
	res.status(501).json({ message: `${what} is not enabled`, code: "NOT_IMPLEMENTED" });

// Cornerstone employee ClientAccountIDs that receive payroll (used by
// vopayFundTransfer and to route webhook events to the company room).
const CORNERSTONE_RECIPIENT_ACCOUNTS = {
	"67c1360568f8bcf1d10d240b": "business_cornerstone_maintenance_group_ltd_primary1",
	"6a28906efcc68f0aad5eab3a": "business_cornerstone_maintenance_group_ltd_primary3",
	"6a9b0e6ac2eed18508624742": "business_cornerstone_maintenance_group_ltd_primary4",
};

// Strip query strings (GET calls carry Key/Signature there) from error text.
const redactUrls = (text) => String(text || "").replace(/(https?:\/\/[^\s?]+)\?\S*/g, "$1");

// FIX (AUD-010): VoPay signatures are sha1(key + secret + YYYY-MM-DD). This was
// computed once at startup, so every VoPay call (and webhook check) failed after
// the first midnight until the process restarted. Compute it lazily per use.
const SIGNATURE_HOLDER = {
	get value() {
		return generateVopaySignature(SHARED_KEY, SHARED_SECRET);
	},
};
const { value: _sigAtLoad } = SIGNATURE_HOLDER; // sanity: ensures creds are usable at boot
void _sigAtLoad;

const getPartnerEmployerAccounts = async (req, res) => {
	try {
		const data = await apiFetch(`${BASE_URL}partner/account`, {
			data: {
				AccountID: ACCOUNT_ID,
				Key: SHARED_KEY,
				Signature: SIGNATURE_HOLDER.value,
			},
		});

		res.status(200).json(data);
	} catch (error) {
		res
			.status(500)
			.json({ message: "Internal Server Error", error: error.response?.data || error.message });
	}
};

const getVopayAccountOnboardingUrl = async (req, res) => {
	try {
		const { vopayAccountId } = req.params;

		const data = await apiFetch(`${BASE_URL}partner/account/onboarding-url`, {
			data: {
				AccountID: ACCOUNT_ID,
				Key: SHARED_KEY,
				Signature: SIGNATURE_HOLDER.value,
				VopayAccountID: vopayAccountId,
			},
		});

		res.status(200).json(data);
	} catch (error) {
		res
			.status(500)
			.json({ message: "Internal Server Error", error: error.response?.data || error.message });
	}
};

const getAccountWebHooks = async (req, res) => {
	try {
		// const isCornerStone = companyName === COMPANIES.CORNERSTONE;
		// if (isCornerStone) {
		// 	currentEnv = CONFIG.CORNERSTONE;

		// 	const { SHARED_KEY, SHARED_SECRET, ACCOUNT_ID, BASE_URL } = currentEnv;
		// 	const SIGNATURE = generateVopaySignature(SHARED_KEY, SHARED_SECRET);
		// }
		// all events
		const webhookUrlInfo = await apiFetch(`${BASE_URL}account/webhook-url/info`, {
			data: {
				AccountID: ACCOUNT_ID,
				Key: SHARED_KEY,
				Signature: SIGNATURE_HOLDER.value,
			},
		});

		// all events
		const allWebHooks = await apiFetch(`${BASE_URL}account/webhooks`, {
			data: {
				AccountID: ACCOUNT_ID,
				Key: SHARED_KEY,
				Signature: SIGNATURE_HOLDER.value,
			},
		});

		// all partner webhooks - needs businessn creds
		// const partner = await apiFetch(`${BASE_URL}partner/webhooks`, {
		// 	data: {
		// 		AccountID: ACCOUNT_ID,
		// 		Key: SHARED_KEY,
		// 		Signature: SIGNATURE_HOLDER.value,
		// 	},
		// });
		if (!allWebHooks.Success) {
			await apiFetch(`${BASE_URL}account/webhook-url`, {
				method: "POST",
				data: {
					AccountID: ACCOUNT_ID,
					Key: SHARED_KEY,
					Signature: SIGNATURE_HOLDER.value,
					WebHookUrl: "https://businessn-erp.com/payroll/webhooks",
				},
			});
		}
		res.status(200).json({ webhookUrlInfo, allWebHooks });
	} catch (error) {
		res
			.status(500)
			.json({ message: "Internal Server Error", error: error.response?.data || error.message });
	}
};

// NEW-04: returns the outcome ({ status: "sent" | "failed" | "skipped", error?, reason? })
// instead of only logging it, so the payroll submit response can report it.
const vopayFundTransfer = async (companyName, fundTotals, employeePayStubs = []) => {
	const isCornerStone = companyName === COMPANIES.CORNERSTONE;

	if (isCornerStone) {
		// NEW-04: local, per-call environment; the Signature below is now computed
		// from Cornerstone's key/secret (it used the default account's before).
		const env = VOPAY_CONFIG.CORNERSTONE;
		const { SHARED_KEY, SHARED_SECRET, ACCOUNT_ID, BASE_URL } = env;
		const SIGNATURE = generateVopaySignature(SHARED_KEY, SHARED_SECRET);
		const DebitorClientAccountID = CORNERSTONE_CLIENT_ACCOUNT_ID;

		const accountMap = CORNERSTONE_RECIPIENT_ACCOUNTS;

		const recipientSplit = employeePayStubs
			.filter((emp) => accountMap[emp.empId])
			.map((emp) => ({
				ClientAccountID: accountMap[emp.empId],
				Amount: Number(emp.currentNetPay).toFixed(2),
			}));

		// const totalAmount = selectedEmployees
		// 	.reduce((sum, emp) => sum + Number(emp.currentNetPay), 0)
		// 	.toFixed(2);
		if (fundTotals?.totalEmpPaymentRemitCost > 0) {
			try {
				await apiFetch(`${BASE_URL}account/client-accounts/fund-transfer-withdraw`, {
					method: "POST",
					data: {
						AccountID: ACCOUNT_ID,
						Key: SHARED_KEY,
						Signature: SIGNATURE,
						DebitorClientAccountID,
						RecipientClientAccountIDSplit: JSON.stringify(recipientSplit),
						Amount: fundTotals?.totalEmpPaymentRemitCost.toFixed(2),
						Currency: "CAD",
						Notes: "Processed Payroll Transfer",
					},
				});
				return { status: "sent" };
			} catch (error) {
				const message = redactUrls(error?.message);
				console.error("vopayFundTransfer failed", {
					companyName,
					amount: fundTotals?.totalEmpPaymentRemitCost,
					recipients: recipientSplit.length,
					error: message,
				});
				return { status: "failed", error: message };
			}
		}
		return { status: "skipped", reason: "NO_AMOUNT" };
	}
	return { status: "skipped", reason: "COMPANY_NOT_ENABLED" };
};

// CHANGES.md API #3: this handler hit a bare `return;` before responding, so the request
// hung. Its body was a hard-coded test transfer (Amount 0, fixed account names,
// signed with whatever account was "current"). Disabled explicitly until the
// partner-transfer flow is specified.
const partnerAccountTransfer = async (req, res) => notImplemented(res, "Partner account transfer");

// CHANGES.md API #3: hit a bare `return;` and never responded (and sent nothing for a
// non-Cornerstone company). The unreachable body also signed with the default
// account despite setting a Cornerstone environment. The client call site is
// commented out (ClientEmployeeList.jsx), so it is disabled explicitly.
const transferWithdraw = async (req, res) => notImplemented(res, "Transfer/withdraw");

const fundEmployerWallet = async (req, res) => {
	try {
		const { CompanyName, Address1, City, Province, Country, PostalCode, Amount, Currency } =
			req.body;

		//if conrn
		// NEW-04: this assigned `currentEnv = CORNERSTONE`, which never took effect
		// (the request below always used the default account's constants). Removed;
		// the account actually used (default/STAGING) is unchanged.
		const ClientAccountID = CORNERSTONE_CLIENT_ACCOUNT_ID;
		const data = await apiFetch(`${BASE_URL}eft/fund`, {
			method: "POST",
			data: {
				AccountID: ACCOUNT_ID,
				Key: SHARED_KEY,
				Signature: SIGNATURE_HOLDER.value,
				ClientAccountID,
				CompanyName,
				Address1,
				City,
				Province,
				Country,
				PostalCode,
				Amount,
				Currency,
			},
		});

		res.status(200).json(data);
	} catch (error) {
		res
			.status(500)
			.json({ message: "Internal Server Error", error: error.response?.data || error.message });
	}
};

const createClientAccountEmployee = async (req, res) => {
	try {
		const {
			FirstName,
			LastName,
			EmailAddress,
			Address1,
			City,
			Province,
			Country,
			Nationality,
			PostalCode,
			Currency,
			PhoneNumber,
			DOB,
			SINLastDigits,
		} = req.body;

		//if CORNERSTONE
		// NEW-04: removed the ineffective `currentEnv = CORNERSTONE` assignment; the
		// account actually used (default/STAGING) is unchanged.
		const ClientAccountID = CORNERSTONE_CLIENT_ACCOUNT_ID;
		const data = await apiFetch(`${BASE_URL}account/client-accounts/individual`, {
			method: "POST",
			data: {
				AccountID: ACCOUNT_ID,
				Key: SHARED_KEY,
				Signature: SIGNATURE_HOLDER.value,
				ClientAccountID,
				FirstName,
				LastName,
				EmailAddress,
				Address1,
				City,
				Province,
				Country,
				Nationality,
				PostalCode,
				Currency,
				PhoneNumber,
				DOB,
				SINLastDigits,
			},
		});
		res.status(200).json(data);
	} catch (error) {
		return res
			.status(500)
			.json({ message: "Internal Server Error", error: error.response?.data || error.message });
	}
};

const safeEqual = (a, b) => {
	if (typeof a !== "string" || typeof b !== "string") return false;
	const bufA = Buffer.from(a);
	const bufB = Buffer.from(b);
	if (bufA.length !== bufB.length) return false;
	return crypto.timingSafeEqual(bufA, bufB);
};

const receiveWebhook = (io) => (req, res) => {
	const signature = req.headers["x-vopay-signature"];
	const expected = SIGNATURE_HOLDER.value;

	// FIX (AUD-007): constant-time comparison; reject when header is missing.
	if (!safeEqual(signature, expected)) {
		return res.status(401).send("Invalid signature");
	}
	// const data = await apiFetch(`${BASE_URL}iq11/generate-embed-url`, {
	//const  method: "POST",
	//const  data: {
	//const  	AccountID: ACCOUNT_ID,
	//const  	Key: SHARED_KEY,
	//const  	Signature: SIGNATURE_HOLDER.value,
	//const  	ClientAccountID: clientAccountId,
	//const  	RedirectURL: "https://businessn.com/",
	//const  },
	// 	});

	// const data = await apiFetch(`${BASE_URL}partner/account/onboarding-url`, {
	// 	data: {
	//const  AccountID: ACCOUNT_ID,
	//const  Key: SHARED_KEY,
	//const  Signature: SIGNATURE_HOLDER.value,
	//const  VopayAccountID: vopayAccountId,
	// 	},
	// });

	// 	const transactiongwtResponse = await fetch(
	//const  `${BASE_URL}account/webhook-url/info?AccountID=${TECHCORP_CREDS.AccountID}&Key=${TECHCORP_CREDS.KEY}&Signature=${TECHCORP_CREDS_Signature}`,
	//const  {
	//const  	method: "GET",
	//const  	headers: {
	//const  		accept: "application/json",
	//const  	},
	//const  },
	// 	);
	// 	const transactionRes = await transactiongwtResponse.json();

	// checkTransactionStatus(transactionID) { /eft/fund/status
	//   const res = await axios.get(`${BASE_URL}/eft/fund/status`, {
	//     params: {
	//   AccountID: VOPAY_ACCOUNT_ID,
	//   Key:  VOPAY_API_KEY,
	//       Signature: generateVopaySignature({ TransactionID: transactionID }),
	//       TransactionID: transactionID,
	//     },
	//   });
	//const  payEmployee={
	//     ClientAccountID: "CLIENT_ACCOUNT_ID_JANE",
	//     FirstName: "Jane",
	//     LastName: "Doe",
	//     Address1: "456 Oak St",
	//     City: "Vancouver",
	//     Province: "BC",
	//     Country: "CA",
	//     PostalCode: "V6B1L2",
	//     Amount: 2500,
	//     Currency: "CAD",
	//   };

	const event = req.body;
	console.log("Webhook Received:", event);

	// NEW-15 / CHANGES.md API #16: was io.emit (every socket, unauthenticated). Now only
	// sockets of the company the event belongs to receive it.
	emitVopayEvent(io, event);

	res.status(200).send("OK");
};

// NEW-15 / CHANGES.md API #16: map a webhook payload to the company it belongs to.
// Only the Cornerstone account is wired today; anything else maps to nobody.
const resolveVopayEventCompany = (event) => {
	if (!event || typeof event !== "object") return null;
	const accountIds = [event.AccountID, event.ClientAccountID].filter(
		(v) => typeof v === "string" && v,
	);
	const cornerstoneIds = new Set([
		CORNERSTONE_ACCOUNT_ID,
		CORNERSTONE_CLIENT_ACCOUNT_ID,
		...Object.values(CORNERSTONE_RECIPIENT_ACCOUNTS),
	]);
	if (accountIds.some((id) => cornerstoneIds.has(id))) return COMPANIES.CORNERSTONE;
	return null;
};

const emitVopayEvent = (io, event) => {
	const companyName = resolveVopayEventCompany(event);
	if (!companyName) {
		console.warn("VoPay webhook event not mapped to a company; not emitted", {
			AccountID: event?.AccountID,
			ClientAccountID: event?.ClientAccountID,
		});
		return null;
	}
	emitToCompany(io, companyName, "vopay-event", event);
	return companyName;
};

const createPartnerEmployerAccount = async (req, res) => {
	try {
		const { name, email, country } = req.body;
		const data = await apiFetch(`${BASE_URL}partner/account`, {
			method: "POST",
			data: {
				AccountID: ACCOUNT_ID,
				Key: SHARED_KEY,
				Signature: SIGNATURE_HOLDER.value,
				Name: name,
				Country: country,
				EmailAddress: email,
				ClientAccountsEnabled: true,
			},
		});
		res.status(200).json(data);
	} catch (error) {
		return res
			.status(500)
			.json({ message: "Internal Server Error", error: error.response?.data || error.message });
	}
};

const getTransactions = async (req, res) => {
	try {
		const { clientAccountId } = req.params;
		const data = await apiFetch(`${BASE_URL}account/transactions`, {
			data: {
				AccountID: ACCOUNT_ID,
				Key: SHARED_KEY,
				Signature: SIGNATURE_HOLDER.value,
				ClientAccountID: clientAccountId,
				StartDateTime: moment().subtract(1, "month").format("YYYY-MM-DD"),
				EndDateTime: moment().format("YYYY-MM-DD"),
			},
		});
		res.status(200).json(data);
	} catch (error) {
		res
			.status(500)
			.json({ message: "Internal Server Error", error: error.response?.data || error.message });
	}
};

const getEmployeeBankEmbedUrl = async (req, res) => {
	try {
		const { clientAccountId } = req.params;
		const data = await apiFetch(`${BASE_URL}iq11/generate-embed-url`, {
			method: "POST",
			data: {
				AccountID: ACCOUNT_ID,
				Key: SHARED_KEY,
				Signature: SIGNATURE_HOLDER.value,
				ClientAccountID: clientAccountId,
				RedirectURL: "https://businessn.com/",
			},
		});

		res.status(200).json(data);
	} catch (error) {
		res
			.status(500)
			.json({ message: "Internal Server Error", error: error.response?.data || error.message });
	}
};

const submitEmployerInfo = async (req, res) => {
	try {
		const {
			address,
			province,
			city,
			country,
			phoneNumber,
			postalCode,
			legalBusinessName,
			organizationalType,
			registrationNumber,
			registrationProvince,
			financialInstitutionNumber,
			branchTransitNumber,
			accountNumber,
		} = req.body;

		const data = await apiFetch(`${BASE_URL}partner/account`, {
			method: "POST",
			data: {
				AccountID: ACCOUNT_ID,
				Key: SHARED_KEY,
				Signature: SIGNATURE_HOLDER.value,
				Address: address,
				City: city,
				Province: province,
				PostalCode: postalCode,
				Country: country,
				PhoneNumber: phoneNumber,
				LegalBusinessName: legalBusinessName,
				OrganizationalType: organizationalType,
				RegistrationNumber: registrationNumber,
				RegistrationProvince: registrationProvince,
				FinancialInstitutionNumber: financialInstitutionNumber,
				BranchTransitNumber: branchTransitNumber,
				AccountNumber: accountNumber,
			},
		});
		res.status(200).json(data);
	} catch (error) {
		return res
			.status(500)
			.json({ message: "Internal Server Error", error: error.response?.data || error.message });
	}
};

const getLinkedBankAccounts = async (req, res) => {
	try {
		const { accountId } = req.params;

		// currentEnv = CONFIG.CORNERSTONE;

		const data = await apiFetch(`${BASE_URL}bank-account`, {
			data: {
				AccountID: ACCOUNT_ID,
				Key: SHARED_KEY,
				Signature: SIGNATURE_HOLDER.value,
				ClientAccountID: accountId,
			},
		});

		res.status(200).json(data);
	} catch (error) {
		res
			.status(500)
			.json({ message: "Internal Server Error", error: error.response?.data || error.message });
	}
};

const getClientDefaultBankAccount = async (req, res) => {
	try {
		const { accountId } = req.params;

		// const url = `${BASE_URL}bank-account?AccountID=${accountId}&Key=${TECHCORP_CREDS.KEY}&Signature=${TECHCORP_CREDS_Signature}`;

		const data = await apiFetch(`${BASE_URL}bank-account/default-bank-account`, {
			data: {
				AccountID: accountId,
				Key: SHARED_KEY,
				Signature: SIGNATURE_HOLDER.value,
			},
		});
		res.status(200).json(data);
	} catch (error) {
		res
			.status(500)
			.json({ message: "Internal Server Error", error: error.response?.data || error.message });
	}
};

const getClientAccountWallet = async (req, res) => {
	try {
		const { clientAccountId } = req.params;
		const data = await apiFetch(`${BASE_URL}account/client-accounts/wallets`, {
			data: {
				AccountID: ACCOUNT_ID,
				Key: SHARED_KEY,
				Signature: SIGNATURE_HOLDER.value,
				ClientAccountID: clientAccountId,
			},
		});
		res.status(200).json(data);
	} catch (error) {
		res
			.status(500)
			.json({ message: "Internal Server Error", error: error.response?.data || error.message });
	}
};

const getClientAccountWallets = async (req, res) => {
	try {
		const data = await apiFetch(`${BASE_URL}account/client-accounts`, {
			data: {
				AccountID: ACCOUNT_ID,
				Key: SHARED_KEY,
				Signature: SIGNATURE_HOLDER.value,
			},
		});

		res.status(200).json(data);
	} catch (error) {
		res
			.status(500)
			.json({ message: "Internal Server Error", error: error.response?.data || error.message });
	}
};

const setBankAccount = async (req, res) => {
	try {
		const { ClientAccountID, Token } = req.body;
		const data = await apiFetch(`${BASE_URL}bank-account/set-my-bank-account`, {
			method: "POST",
			data: {
				AccountID: ACCOUNT_ID,
				Key: SHARED_KEY,
				Signature: SIGNATURE_HOLDER.value,
				Token,
				SetAsDefault: true,
				ClientAccountID,
			},
		});

		res.status(200).json(data);
	} catch (error) {
		return res
			.status(500)
			.json({ message: "Internal Server Error", error: error.response?.data || error.message });
	}
};

const fundBankAccount = async (req, res) => {
	try {
		const { ClientAccountID, Amount } = req.body;
		const data = await apiFetch(`${BASE_URL}account/fund-my-account`, {
			method: "POST",
			data: {
				AccountID: ACCOUNT_ID,
				Key: SHARED_KEY,
				Signature: SIGNATURE_HOLDER.value,
				ClientAccountID,
				Amount,
			},
		});

		res.status(200).json(data);
	} catch (error) {
		return res
			.status(500)
			.json({ message: "Internal Server Error", error: error.response?.data || error.message });
	}
};

// NEW-15: referenced undefined TECHCORP_CREDS / TECHCORP_CREDS_Signature (every
// call answered 500 "TECHCORP_CREDS is not defined") and ignored the request
// body in favour of hard-coded test values ("individual_jane_d"/"Jane_wallet").
// Which account should own client wallets is not specified, so the endpoint is
// disabled explicitly instead of guessing (VOPAY_CONFIG.TECHCORP holds the creds).
const createClientAccountWallet = async (req, res) =>
	notImplemented(res, "Client wallet creation");

const getAccountBalance = async (req, res) => {
	try {
		const data = await apiFetch(`${BASE_URL}account/balance`, {
			data: {
				AccountID: ACCOUNT_ID,
				Key: SHARED_KEY,
				Signature: SIGNATURE_HOLDER.value,
				Currency: "CAD",
			},
		});

		res.status(200).json(data);
	} catch (error) {
		res
			.status(500)
			.json({ message: "Internal Server Error", error: error.response?.data || error.message });
	}
};

module.exports = {
	createPartnerEmployerAccount,
	createClientAccountEmployee,
	getClientAccountWallets,
	getPartnerEmployerAccounts,
	getVopayAccountOnboardingUrl,
	submitEmployerInfo,
	getEmployeeBankEmbedUrl,
	fundEmployerWallet,
	createClientAccountWallet,
	getClientAccountWallet,
	getClientDefaultBankAccount,
	fundBankAccount,
	setBankAccount,
	getLinkedBankAccounts,
	generateVopaySignature,
	receiveWebhook,
	emitVopayEvent,
	transferWithdraw,
	getTransactions,
	getAccountBalance,
	vopayFundTransfer,
	getAccountWebHooks,
	partnerAccountTransfer,
};
