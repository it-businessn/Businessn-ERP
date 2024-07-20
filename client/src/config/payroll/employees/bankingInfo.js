export const EMP_BANKING_CONFIG = [
	{
		type: "ss40",
		params: [
			{
				name: "Deposit paycheque via direct deposit ",
				param_key: "directDeposit",
				control: "radio",
			}, //Yes and No
			{ name: "Bank", param_key: "bankNum" },
		],
	},
	{
		type: "ss3",
		params: [
			{ name: "ss", param_key: "ss3", control: "radio" },
			{ name: "Transit Number", param_key: "transitNum" },
		],
	},
	{
		type: "ss4",
		params: [
			{ name: "ss", param_key: "ss4", control: "radio" },
			{ name: "Account Number", param_key: "accountNum" },
		],
	},
];

export const EMP_PAYMENT_NOTIFICATION_CONFIG = [
	{
		type: "ss10",
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
