const { Console } = require("console");
const crypto = require("crypto");

const {
	VOPAY_PARTNER_ACCOUNT_ID,
	VOPAY_API_KEY_STAGING,
	VOPAY_BASE_URL_STAGING,
	VOPAY_SHARED_SECRET_STAGING,
	VOPAY_API_KEY_PROD,
	VOPAY_BASE_URL_PROD,
	VOPAY_SHARED_SECRET_PROD,
	VOPAY_PARTNER_ACCOUNT_ID_PROD_TEST,
	VOPAY_API_KEY_PROD_TEST,
	VOPAY_SHARED_SECRET_PROD_TEST,
} = process.env;

const CONFIG = {
	STAGING: {
		ACCOUNT_ID: VOPAY_PARTNER_ACCOUNT_ID,
		SHARED_KEY: VOPAY_API_KEY_STAGING,
		SHARED_SECRET: VOPAY_SHARED_SECRET_STAGING,
		BASE_URL: VOPAY_BASE_URL_STAGING,
	},
	PROD: {
		ACCOUNT_ID: "cornerstonemaintenancegroupltd",
		SHARED_KEY: "xKup5dZh9coUIqrsgLTaNn3R2PF7zEXW1tvbweyC",
		SHARED_SECRET: "uw3V49wvDRSBwkZH0G==",
		BASE_URL: VOPAY_BASE_URL_PROD,
	},
	PROD_TEST: {
		ACCOUNT_ID: VOPAY_PARTNER_ACCOUNT_ID_PROD_TEST,
		SHARED_KEY: VOPAY_API_KEY_PROD_TEST,
		SHARED_SECRET: VOPAY_SHARED_SECRET_PROD_TEST,
		BASE_URL: VOPAY_BASE_URL_PROD,
	},
};
const currentEnv = CONFIG.PROD;
const { SHARED_KEY, SHARED_SECRET, ACCOUNT_ID, BASE_URL } = currentEnv;

const PARTNER_URL = `${BASE_URL}partner/account`;

const generateSignature = (key = SHARED_KEY, secret_key = SHARED_SECRET) => {
	const date = new Date().toISOString().split("T")[0];
	const shasum = crypto.createHash("sha1");
	shasum.update(key + secret_key + date);
	const signature = shasum.digest("hex");
	console.log(signature);
	return signature;
};

const TECHCORP_CREDS = {
	AccountID: "techcorpltd",
	KEY: "UezsdpfRSEbmu6HkNGJo1yV4vc9CXg8PrnhBtQL3",
	SHARED_KEY: "sL8iMY96vUkNHLVMc6==",
	ClientAccountID: "business_techcorp_ltd_primary",
};
const TECHCORP_CREDS_Signature = generateSignature(TECHCORP_CREDS.KEY, TECHCORP_CREDS.SHARED_KEY);

const createPartnerEmployerAccount = async (req, res) => {
	try {
		const { name, email, country } = req.body;
		const options = {
			method: "POST",
			headers: {
				accept: "application/json",
				"content-type": "application/x-www-form-urlencoded",
			},
			body: new URLSearchParams({
				AccountID: ACCOUNT_ID,
				Key: SHARED_KEY,
				Signature: generateSignature(),
				Name: name,
				Country: country,
				EmailAddress: email,
				ClientAccountsEnabled: true,
			}),
		};

		const response = await fetch(PARTNER_URL, options);
		const data = await response.json();
		res.status(200).json(data);
	} catch (error) {
		return res
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

		const options = {
			method: "POST",
			headers: {
				accept: "application/json",
				"content-type": "application/x-www-form-urlencoded",
			},
			body: new URLSearchParams({
				AccountID: ACCOUNT_ID,
				Key: SHARED_KEY,
				Signature: generateSignature(),
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
			}),
		};

		const response = await fetch(PARTNER_URL, options);
		const data = await response.json();
		res.status(200).json(data);
	} catch (error) {
		return res
			.status(500)
			.json({ message: "Internal Server Error", error: error.response?.data || error.message });
	}
};

const getPartnerEmployerAccounts = async (req, res) => {
	try {
		const options = { method: "GET", headers: { accept: "application/json" } };
		const url = `${PARTNER_URL}?AccountID=${ACCOUNT_ID}&Key=${SHARED_KEY}&Signature=${generateSignature()}`;

		const response = await fetch(url, options);
		const data = await response.json();

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
		const Signature = generateSignature();
		const url = `${PARTNER_URL}/onboarding-url?AccountID=${ACCOUNT_ID}&Key=${SHARED_KEY}&Signature=${Signature}&VopayAccountID=${vopayAccountId}`;
		const options = { method: "GET", headers: { accept: "application/json" } };

		const response = await fetch(url, options);
		const data = await response.json();

		res.status(200).json(data);
	} catch (error) {
		res
			.status(500)
			.json({ message: "Internal Server Error", error: error.response?.data || error.message });
	}
};

const getLinkedBankAccounts = async (req, res) => {
	try {
		const { accountId } = req.params;
		const options = {
			method: "GET",
			headers: { accept: "application/json" },
		};
		const url = `${BASE_URL}bank-account?AccountID=${accountId}&Key=${TECHCORP_CREDS.KEY}&Signature=${TECHCORP_CREDS_Signature}`;
		const response = await fetch(url, options);
		const data = await response.json();
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
		const options = {
			method: "GET",
			headers: { accept: "application/json" },
		};
		const url = `${BASE_URL}bank-account/default-bank-account?AccountID=${accountId}&Key=${TECHCORP_CREDS.KEY}&Signature=${TECHCORP_CREDS_Signature}`;
		const response = await fetch(url, options);
		const data = await response.json();
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
		const options = {
			method: "GET",
			headers: { accept: "application/json" },
		};
		const url = `${BASE_URL}account/client-accounts/wallets?AccountID=${TECHCORP_CREDS.AccountID}&Key=${TECHCORP_CREDS.KEY}&Signature=${TECHCORP_CREDS_Signature}&ClientAccountID=${clientAccountId}`;
		const response = await fetch(url, options);
		const data = await response.json();
		res.status(200).json(data);
	} catch (error) {
		res
			.status(500)
			.json({ message: "Internal Server Error", error: error.response?.data || error.message });
	}
};

const getClientAccountWallets = async (req, res) => {
	try {
		const options = { method: "GET", headers: { accept: "application/json" } };
		const url = `${BASE_URL}account/client-accounts?AccountID=${ACCOUNT_ID}&Key=${SHARED_KEY}&Signature=${generateSignature()}`;

		const response = await fetch(url, options);
		const data = await response.json();
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

		const options = {
			method: "POST",
			headers: {
				accept: "application/json",
				"content-type": "application/x-www-form-urlencoded",
			},
			body: new URLSearchParams({
				AccountID: ACCOUNT_ID,
				Key: SHARED_KEY,
				Signature: generateSignature(),
				Token,
				SetAsDefault: true,
				ClientAccountID,
			}),
		};

		const response = await fetch(`${BASE_URL}bank-account/set-my-bank-account`, options);
		const data = await response.json();
		res.status(200).json(data);
	} catch (error) {
		return res
			.status(500)
			.json({ message: "Internal Server Error", error: error.response?.data || error.message });
	}
};

const transferWithdraw = async (req, res) => {
	try {
		const { RecipientClientAccountID, Amount } = req.body;
		const options = {
			method: "POST",
			headers: {
				accept: "application/json",
				"content-type": "application/x-www-form-urlencoded",
			},
			body: new URLSearchParams({
				AccountID: ACCOUNT_ID,
				Key: SHARED_KEY,
				Signature: generateSignature(),
				DebitorClientAccountID: "business_businessn_production_test_primary",
				RecipientClientAccountID: "business_businessn_production_test_primary1",
				Amount: 0.5,
			}),
		};
		const response = await fetch(`${BASE_URL}account/client-accounts/transfer-withdraw`, options);
		const data = await response.json();
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
		const options = {
			method: "POST",
			headers: {
				accept: "application/json",
				"content-type": "application/x-www-form-urlencoded",
			},
			body: new URLSearchParams({
				AccountID: ACCOUNT_ID,
				Key: SHARED_KEY,
				Signature: generateSignature(),
				ClientAccountID,
				Amount,
			}),
		};
		const response = await fetch(`${BASE_URL}account/fund-my-account`, options);
		const data = await response.json();
		res.status(200).json(data);
	} catch (error) {
		return res
			.status(500)
			.json({ message: "Internal Server Error", error: error.response?.data || error.message });
	}
};

const createClientAccountWallet = async (req, res) => {
	try {
		const { ClientAccountID, WalletName, Currency } = req.body;

		const options = {
			method: "POST",
			headers: {
				accept: "application/json",
				"content-type": "application/x-www-form-urlencoded",
			},
			body: new URLSearchParams({
				AccountID: TECHCORP_CREDS.AccountID,
				Key: TECHCORP_CREDS.KEY,
				Signature: TECHCORP_CREDS_Signature,
				ClientAccountID: "individual_jane_d",
				Currency: "CAD",
				WalletName: "Jane_wallet",
			}),
		};

		const response = await fetch(`${BASE_URL}account/client-accounts/wallets/create`, options);
		const data = await response.json();
		res.status(200).json(data);
	} catch (error) {
		return res
			.status(500)
			.json({ message: "Internal Server Error", error: error.response?.data || error.message });
	}
};

const createClientAccountEmployee = async (req, res) => {
	try {
		const {
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
		} = req.body;
		// https://businessn.com/?Token=uwrrfhzljl4c2ky06buelta883v8zea1zha0w0kv2xqswcclne16wolbiv1vi435&PaymentMethod=bank
		const options = {
			method: "POST",
			headers: {
				accept: "application/json",
				"content-type": "application/x-www-form-urlencoded",
			},
			body: new URLSearchParams({
				AccountID: ACCOUNT_ID,
				Key: SHARED_KEY,
				Signature: generateSignature(),
				ClientAccountID: "business_cornerstone_maintenance_group_ltd_primary",
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
			}),
		};

		const response = await fetch(`${BASE_URL}account/client-accounts/individual`, options);
		const data = await response.json();
		res.status(200).json(data);
	} catch (error) {
		return res
			.status(500)
			.json({ message: "Internal Server Error", error: error.response?.data || error.message });
	}
};

const getAccountBalance = async (req, res) => {
	try {
		const options = {
			method: "GET",
			headers: { accept: "application/json" },
		};
		const url = `${BASE_URL}account/balance?AccountID=${ACCOUNT_ID}&Key=${SHARED_KEY}&Signature=${generateSignature()}&Currency=CAD`;
		const response = await fetch(url, options);
		const data = await response.json();
		res.status(200).json(data);
	} catch (error) {
		res
			.status(500)
			.json({ message: "Internal Server Error", error: error.response?.data || error.message });
	}
};

const getTransactions = async (req, res) => {
	try {
		const { clientAccountId } = req.params;
		const options = {
			method: "GET",
			headers: { accept: "application/json" },
		};
		// const url = `${BASE_URL}account/transactions?AccountID=${ACCOUNT_ID}&Key=${SHARED_KEY}&Signature=${generateSignature()}&ClientAccountID=${clientAccountId}&StartDateTime=${YYYY-MM-DD HH:MM:SS or YYYY-MM-DD}`;
		const response = await fetch(url, options);
		const data = await response.json();
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

		const options = {
			method: "POST",
			headers: {
				accept: "application/json",
				"content-type": "application/x-www-form-urlencoded",
			},
			body: new URLSearchParams({
				AccountID: ACCOUNT_ID,
				Key: SHARED_KEY,
				Signature: generateSignature(),
				ClientAccountID: clientAccountId,
				RedirectURL: "https://businessn.com/",
			}),
		};

		const response = await fetch(`${BASE_URL}iq11/generate-embed-url`, options);
		const data = await response.json();
		res.status(200).json(data);
	} catch (error) {
		res
			.status(500)
			.json({ message: "Internal Server Error", error: error.response?.data || error.message });
	}
};

const fundEmployerWallet = async (req, res) => {
	try {
		const {
			CompanyName,
			Address1,
			City,
			Province,
			Country,
			PostalCode,
			AccountNumber,
			FinancialInstitutionNumber,
			BranchTransitNumber,
			Amount,
			Currency,
		} = req.body;
		// checkTransactionStatus(transactionID) { /eft/fund/status
		//   const res = await axios.get(`${process.env.BASE_URL}/eft/fund/status`, {
		//     params: {
		//       AccountID: process.env.VOPAY_ACCOUNT_ID,
		//       Key: process.env.VOPAY_API_KEY,
		//       Signature: generateSignature({ TransactionID: transactionID }),
		//       TransactionID: transactionID,
		//     },
		//   });
		// 		payEmployee={
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

		const options = {
			method: "POST",
			headers: {
				accept: "application/json",
				"content-type": "application/x-www-form-urlencoded",
			},
			body: new URLSearchParams({
				AccountID: ACCOUNT_ID,
				Key: SHARED_KEY,
				Signature: generateSignature(),
				ClientAccountID: "business_techcorp_ltd_primary",
				CompanyName,
				Address1,
				City,
				Province,
				Country,
				PostalCode,
				// AccountNumber,
				// FinancialInstitutionNumber,
				// BranchTransitNumber,
				Amount,
				Currency,
			}),
		};

		const eftResponse = await fetch(`${BASE_URL}eft/fund`, options);

		const fundRes = await eftResponse.json();

		const transactionOptions = {
			method: "POST",
			headers: {
				accept: "application/json",
				"content-type": "application/x-www-form-urlencoded",
			},
			body: new URLSearchParams({
				AccountID: TECHCORP_CREDS.AccountID,
				Key: TECHCORP_CREDS.KEY,
				Signature: TECHCORP_CREDS_Signature,
				WebHookUrl: "https://businessn-erp.com/payroll/timesheets",
				// Type: "transaction",
				// Disabled: true,
			}),
		};

		const transactionResponse = await fetch(`${BASE_URL}account/webhook-url`, transactionOptions);
		const transactiongwtResponse = await fetch(
			`${BASE_URL}account/webhook-url/info?AccountID=${TECHCORP_CREDS.AccountID}&Key=${TECHCORP_CREDS.KEY}&Signature=${TECHCORP_CREDS_Signature}`,
			{
				method: "GET",
				headers: {
					accept: "application/json",
				},
			},
		);
		const transactionRes = await transactiongwtResponse.json();
		res.status(200).json({ fundRes, transactionRes });
	} catch (error) {
		res
			.status(500)
			.json({ message: "Internal Server Error", error: error.response?.data || error.message });
	}
};

const receiveWebhook = (io) => (req, res) => {
	const signature = req.headers["x-vopay-signature"];
	const expected = generateSignature();

	if (signature !== expected) {
		return res.status(401).send("Invalid signature");
	}

	const event = req.body;
	console.log("Webhook Received:", event);

	io.emit("vopay-event", event); // Emit real-time update to React

	res.status(200).send("OK");
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
	generateSignature,
	receiveWebhook,
	transferWithdraw,
	getTransactions,
	getAccountBalance,
};
