const crypto = require("crypto");

const {
	VOPAY_API_KEY,
	VOPAY_BASE_URL,
	VOPAY_PARTNER_ACCOUNT_ID,
	VOPAY_SHARED_SECRET,
	VOPAY_API_KEY_PROD,
	VOPAY_BASE_URL_PROD,
	VOPAY_PARTNER_ACCOUNT_ID_PROD,
	VOPAY_SHARED_SECRET_PROD,
} = process.env;

const Key = VOPAY_API_KEY_PROD;
const SECRET_KEY = VOPAY_SHARED_SECRET_PROD;
const AccountID = VOPAY_PARTNER_ACCOUNT_ID_PROD;

const BASE_URL = VOPAY_BASE_URL_PROD;
const PARTNER_URL = `${VOPAY_BASE_URL_PROD}partner/account`;

const generateSignature = (key = Key, secret_key = SECRET_KEY) => {
	const date = new Date().toISOString().split("T")[0];
	const shasum = crypto.createHash("sha1");
	shasum.update(key + secret_key + date);
	const signature = shasum.digest("hex");
	return signature;
};

const TECHCORP_CREDS = {
	AccountID: "techcorpltd",
	KEY: "UezsdpfRSEbmu6HkNGJo1yV4vc9CXg8PrnhBtQL3",
	Signature: generateSignature("UezsdpfRSEbmu6HkNGJo1yV4vc9CXg8PrnhBtQL3", "sL8iMY96vUkNHLVMc6=="),
};

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
				AccountID,
				Key,
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
				AccountID,
				Key,
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
		const url = `${PARTNER_URL}?AccountID=${AccountID}&Key=${Key}&Signature=${generateSignature()}`;

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
		const url = `${PARTNER_URL}/onboarding-url?AccountID=${AccountID}&Key=${Key}&Signature=${Signature}&VopayAccountID=${vopayAccountId}`;
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
		const url = `${BASE_URL}bank-account?AccountID=${accountId}&Key=${TECHCORP_CREDS.KEY}&Signature=${TECHCORP_CREDS.Signature}`;
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
		const url = `${BASE_URL}bank-account/default-bank-account?AccountID=${accountId}&Key=${TECHCORP_CREDS.KEY}&Signature=${TECHCORP_CREDS.Signature}`;
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
		const url = `${BASE_URL}account/client-accounts/wallets?AccountID=${TECHCORP_CREDS.AccountID}&Key=${TECHCORP_CREDS.KEY}&Signature=${TECHCORP_CREDS.Signature}&ClientAccountID=${clientAccountId}`;
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
		const url = `${BASE_URL}account/client-accounts?AccountID=${TECHCORP_CREDS.AccountID}&Key=${TECHCORP_CREDS.KEY}&Signature=${TECHCORP_CREDS.Signature}`;

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
				AccountID: TECHCORP_CREDS.AccountID,
				Key: TECHCORP_CREDS.KEY,
				Signature: TECHCORP_CREDS.Signature,
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
				AccountID: TECHCORP_CREDS.AccountID,
				Key: TECHCORP_CREDS.KEY,
				Signature: TECHCORP_CREDS.Signature,
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
				Signature: TECHCORP_CREDS.Signature,
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

		const options = {
			method: "POST",
			headers: {
				accept: "application/json",
				"content-type": "application/x-www-form-urlencoded",
			},
			body: new URLSearchParams({
				AccountID: TECHCORP_CREDS.AccountID,
				Key: TECHCORP_CREDS.KEY,
				Signature: TECHCORP_CREDS.Signature,
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
				AccountID: TECHCORP_CREDS.AccountID,
				Key: TECHCORP_CREDS.KEY,
				Signature: TECHCORP_CREDS.Signature,
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
				AccountID: TECHCORP_CREDS.AccountID,
				Key: TECHCORP_CREDS.KEY,
				Signature: TECHCORP_CREDS.Signature,
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
				Signature: TECHCORP_CREDS.Signature,
				WebHookUrl: "https://businessn-erp.com/payroll/timesheets",
				// Type: "transaction",
				// Disabled: true,
			}),
		};

		const transactionResponse = await fetch(`${BASE_URL}account/webhook-url`, transactionOptions);
		const transactiongwtResponse = await fetch(
			`${BASE_URL}account/webhook-url/info?AccountID=${TECHCORP_CREDS.AccountID}&Key=${TECHCORP_CREDS.KEY}&Signature=${TECHCORP_CREDS.Signature}`,
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
};
