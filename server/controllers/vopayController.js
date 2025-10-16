const crypto = require("crypto");
const vopayApi = require("@api/vopay-api");

const Key = process.env.VOPAY_API_KEY;
const SECRET_KEY = process.env.VOPAY_SECRET_KEY;
const AccountID = process.env.VOPAY_PARENT_ACC_ID;

const date = new Date().toISOString().split("T")[0];
const shasum = crypto.createHash("sha1");
shasum.update(Key + SECRET_KEY + date);
const Signature = shasum.digest("hex");

const getPartnerAccount = async (req, res) => {
	try {
		const { data } = await vopayApi.accountGET({
			AccountID,
			Key,
			Signature,
		});

		res.status(200).json(JSON.parse(data));
	} catch (error) {
		res
			.status(500)
			.json({ message: "Internal Server Error", error: error.response?.data || error.message });
	}
};

const getAccountOnboardingUrl = async (req, res) => {
	try {
		const { accountId } = req.params;

		const { data } = await vopayApi.partnerAccountOnboardingURLGET({
			AccountID,
			Key,
			Signature,
			VopayAccountID: accountId,
		});
		// console.log(accountId, AccountID, Key, Signature);
		res.status(200).json(JSON.parse(data));
	} catch (error) {
		res
			.status(500)
			.json({ message: "Internal Server Error", error: error.response?.data || error.message });
	}
};

const createVoPayAccountEmployer = async (req, res) => {
	try {
		const { name, email, country } = req.body;

		const { data } = await vopayApi.accountPOST({
			AccountID,
			Key,
			Signature,
			Name: name,
			EmailAddress: email,
			Country: country,
		});
		res.status(200).json(JSON.parse(data));
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

		const { data } = await vopayApi.clientAccountIndividualPOST({
			AccountID,
			Key,
			Signature,
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
		});
		res.status(200).json(JSON.parse(data));
	} catch (error) {
		return res
			.status(500)
			.json({ message: "Internal Server Error", error: error.response?.data || error.message });
	}
};
module.exports = {
	createVoPayAccountEmployer,
	createClientAccountEmployee,
	getPartnerAccount,
	getAccountOnboardingUrl,
};
