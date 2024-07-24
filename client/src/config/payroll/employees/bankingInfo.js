export const EMP_BANKING_CONFIG = [
	{
		type: "sfsgdsgdsgdsg40",
		params: [
			{
				name: "Deposit paycheque via direct deposit",
				param_key: "directDeposit",
				control: "radio",
			}, //Yes and No
			{ name: "Bank", param_key: "bankNum" },
		],
	},
	{
		type: "sfsgdsgdsgdsg3",
		params: [
			{ name: "sfsgdsgdsgdsg", param_key: "sfsgdsgdsgdsg3", control: "radio" },
			{ name: "Transit Number", param_key: "transitNum" },
		],
	},
	{
		type: "sfsgdsgdsgdsg4",
		params: [
			{ name: "sfsgdsgdsgdsg", param_key: "sfsgdsgdsgdsg4", control: "radio" },
			{ name: "Account Number", param_key: "accountNum" },
		],
	},
];

export const EMP_PAYMENT_NOTIFICATION_CONFIG = [
	{
		type: "sfsgdsgdsgdsg10",
		params: [
			{
				name: "Send Paystub by email on pay day",
				param_key: "payStubSendByEmail",
				control: "radio",
			}, //Yes and No
			{ name: "Email", param_key: "paymentEmail" },
		],
	},
];

export const getInitialBankingInfo = (empId, companyName) => {
	return {
		empId,
		companyName,
		directDeposit: "",
		bankNum: "",
		transitNum: "",
		accountNum: "",
		payStubSendByEmail: "",
		paymentEmail: "",
	};
};
