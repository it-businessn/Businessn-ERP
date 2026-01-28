const { generateVopaySignature } = require("../services/encryptDataService");
const { apiFetch } = require("../helpers/apiFetch");
const { COMPANIES } = require("../services/data");
const moment = require("moment");

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
	CORNERSTONE_ACCOUNT_ID,
	CORNERSTONE_SHARED_KEY,
	CORNERSTONE_SHARED_SECRET,
	TECHCORP_ACCOUNT_ID,
	TECHCORP_SHARED_KEY,
	TECHCORP_SHARED_SECRET,
} = process.env;

const CONFIG = {
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

let currentEnv = CONFIG.STAGING;
const { SHARED_KEY, SHARED_SECRET, ACCOUNT_ID, BASE_URL } = currentEnv;

const SIGNATURE = generateVopaySignature(SHARED_KEY, SHARED_SECRET);

const getPartnerEmployerAccounts = async (req, res) => {
	try {
		const data = await apiFetch(`${BASE_URL}partner/account`, {
			data: {
				AccountID: ACCOUNT_ID,
				Key: SHARED_KEY,
				Signature: SIGNATURE,
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
				Signature: SIGNATURE,
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
				Signature: SIGNATURE,
			},
		});

		// all events
		const allWebHooks = await apiFetch(`${BASE_URL}account/webhooks`, {
			data: {
				AccountID: ACCOUNT_ID,
				Key: SHARED_KEY,
				Signature: SIGNATURE,
			},
		});

		// all partner webhooks - needs businessn creds
		// const partner = await apiFetch(`${BASE_URL}partner/webhooks`, {
		// 	data: {
		// 		AccountID: ACCOUNT_ID,
		// 		Key: SHARED_KEY,
		// 		Signature: SIGNATURE,
		// 	},
		// });
		if (!allWebHooks.Success) {
			await apiFetch(`${BASE_URL}account/webhook-url`, {
				method: "POST",
				data: {
					AccountID: ACCOUNT_ID,
					Key: SHARED_KEY,
					Signature: SIGNATURE,
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

const vopayFundTransfer = async (companyName, fundTotals, employeePayStubs) => {
	const isCornerStone = companyName === COMPANIES.CORNERSTONE;

	if (isCornerStone) {
		currentEnv = CONFIG.CORNERSTONE;

		const { SHARED_KEY, SHARED_SECRET, ACCOUNT_ID, BASE_URL } = currentEnv;
		const SIGNATURE = generateVopaySignature(SHARED_KEY, SHARED_SECRET);
		const DebitorClientAccountID = process.env.CORNERSTONE_CLIENTACCOUNTID;

		const ClientAmount = employeePayStubs.find((emp) => emp.empId === "67c1360568f8bcf1d10d240b");

		if (fundTotals?.totalFundingWithDrawals > 0) {
			try {
				await apiFetch(`${BASE_URL}account/client-accounts/fund-transfer-withdraw`, {
					method: "POST",
					data: {
						AccountID: ACCOUNT_ID,
						Key: SHARED_KEY,
						Signature: SIGNATURE,
						DebitorClientAccountID,
						RecipientClientAccountIDSplit: JSON.stringify([
							{
								ClientAccountID: "business_cornerstone_maintenance_group_ltd_primary1",
								Amount: ClientAmount.currentNetPay.toFixed(2),
							},
						]),
						Amount: fundTotals?.totalFundingWithDrawals.toFixed(2),
						Currency: "CAD",
						Notes: "Processed Payroll Transfer",
					},
				});
			} catch (error) {
				console.log("fundEmployerWallet error:=", JSON.stringify(error));
			}
		}
	}
};

const transferWithdraw = async (req, res) => {
	try {
		const { RecipientClientAccountID, Amount, company } = req.body;

		const isCornerStone = company === COMPANIES.CORNERSTONE;
		if (isCornerStone) {
			currentEnv = CONFIG.CORNERSTONE;
			const DebitorClientAccountID = process.env.CORNERSTONE_CLIENTACCOUNTID;

			const data = await apiFetch(`${BASE_URL}account/client-accounts/transfer-withdraw`, {
				method: "POST",
				data: {
					AccountID: ACCOUNT_ID,
					Key: SHARED_KEY,
					Signature: SIGNATURE,
					DebitorClientAccountID,
					RecipientClientAccountID,
					Amount,
				},
			});

			res.status(200).json(data);
		}
	} catch (error) {
		return res
			.status(500)
			.json({ message: "Internal Server Error", error: error.response?.data || error.message });
	}
};

const fundEmployerWallet = async (req, res) => {
	try {
		const { CompanyName, Address1, City, Province, Country, PostalCode, Amount, Currency } =
			req.body;

		//if conrn
		currentEnv = CONFIG.CORNERSTONE;
		const ClientAccountID = process.env.CORNERSTONE_CLIENTACCOUNTID;
		const data = await apiFetch(`${BASE_URL}eft/fund`, {
			method: "POST",
			data: {
				AccountID: ACCOUNT_ID,
				Key: SHARED_KEY,
				Signature: SIGNATURE,
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
		currentEnv = CONFIG.CORNERSTONE;
		const ClientAccountID = process.env.CORNERSTONE_CLIENTACCOUNTID;
		const data = await apiFetch(`${BASE_URL}account/client-accounts/individual`, {
			method: "POST",
			data: {
				AccountID: ACCOUNT_ID,
				Key: SHARED_KEY,
				Signature: SIGNATURE,
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

const receiveWebhook = (io) => (req, res) => {
	const signature = req.headers["x-vopay-signature"];
	const expected = SIGNATURE;

	if (signature !== expected) {
		return res.status(401).send("Invalid signature");
	}
	// const data = await apiFetch(`${BASE_URL}iq11/generate-embed-url`, {
	// 		method: "POST",
	// 		data: {
	// 			AccountID: ACCOUNT_ID,
	// 			Key: SHARED_KEY,
	// 			Signature: SIGNATURE,
	// 			ClientAccountID: clientAccountId,
	// 			RedirectURL: "https://businessn.com/",
	// 		},
	// 	});

	// const data = await apiFetch(`${BASE_URL}partner/account/onboarding-url`, {
	// 	data: {
	// 		AccountID: ACCOUNT_ID,
	// 		Key: SHARED_KEY,
	// 		Signature: SIGNATURE,
	// 		VopayAccountID: vopayAccountId,
	// 	},
	// });

	// 	const transactiongwtResponse = await fetch(
	// 		`${BASE_URL}account/webhook-url/info?AccountID=${TECHCORP_CREDS.AccountID}&Key=${TECHCORP_CREDS.KEY}&Signature=${TECHCORP_CREDS_Signature}`,
	// 		{
	// 			method: "GET",
	// 			headers: {
	// 				accept: "application/json",
	// 			},
	// 		},
	// 	);
	// 	const transactionRes = await transactiongwtResponse.json();

	// checkTransactionStatus(transactionID) { /eft/fund/status
	//   const res = await axios.get(`${process.env.BASE_URL}/eft/fund/status`, {
	//     params: {
	//       AccountID: process.env.VOPAY_ACCOUNT_ID,
	//       Key: process.env.VOPAY_API_KEY,
	//       Signature: generateVopaySignature({ TransactionID: transactionID }),
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

	const event = req.body;
	console.log("Webhook Received:", event);

	io.emit("vopay-event", event); // Emit real-time update to React

	res.status(200).send("OK");
};

const createPartnerEmployerAccount = async (req, res) => {
	try {
		const { name, email, country } = req.body;
		const data = await apiFetch(`${BASE_URL}partner/account`, {
			method: "POST",
			data: {
				AccountID: ACCOUNT_ID,
				Key: SHARED_KEY,
				Signature: SIGNATURE,
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
				Signature: SIGNATURE,
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
				Signature: SIGNATURE,
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
				Signature: SIGNATURE,
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

		// const url = `${BASE_URL}?AccountID=${accountId}&Key=${TECHCORP_CREDS.KEY}&Signature=${TECHCORP_CREDS_Signature}`;

		const data = await apiFetch(`${BASE_URL}bank-account`, {
			data: {
				AccountID: accountId,
				Key: SHARED_KEY,
				Signature: SIGNATURE,
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
				Signature: SIGNATURE,
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
				Signature: SIGNATURE,
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
				Signature: SIGNATURE,
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
				Signature: SIGNATURE,
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
				Signature: SIGNATURE,
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

const createClientAccountWallet = async (req, res) => {
	try {
		const { ClientAccountID, WalletName, Currency } = req.body;

		const data = await apiFetch(`${BASE_URL}account/client-accounts/wallets/create`, {
			method: "POST",
			data: {
				AccountID: TECHCORP_CREDS.AccountID,
				Key: TECHCORP_CREDS.KEY,
				Signature: TECHCORP_CREDS_Signature,
				ClientAccountID: "individual_jane_d",
				Currency: "CAD",
				WalletName: "Jane_wallet",
			},
		});
		res.status(200).json(data);
	} catch (error) {
		return res
			.status(500)
			.json({ message: "Internal Server Error", error: error.response?.data || error.message });
	}
};

const getAccountBalance = async (req, res) => {
	try {
		const data = await apiFetch(`${BASE_URL}account/balance`, {
			data: {
				AccountID: ACCOUNT_ID,
				Key: SHARED_KEY,
				Signature: SIGNATURE,
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
	transferWithdraw,
	getTransactions,
	getAccountBalance,
	vopayFundTransfer,
	getAccountWebHooks,
};
