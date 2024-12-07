export const EMP_BANKING_CONFIG = [
	{
		type: "sfsgdsgdsgdsg40",
		params: [
			{
				name: "Deposit paycheque via direct deposit",
				param_key: "directDeposit",
				control: "radio",
				options: ["Yes", "No"],
			},
			{ name: "Bank", param_key: "bankNum", mandatory: true },
		],
	},
	{
		type: "sfsgdsgdsgdsg3",
		params: [
			{ name: "sfsgdsgdsgdsg", param_key: "sfsgdsgdsgdsg3", control: "radio" },
			{ name: "Transit Number", param_key: "transitNum", mandatory: true },
		],
	},
	{
		type: "sfsgdsgdsgdsg4",
		params: [
			{ name: "sfsgdsgdsgdsg", param_key: "sfsgdsgdsgdsg4", control: "radio" },
			{ name: "Account Number", param_key: "accountNum", mandatory: true },
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
				options: ["Yes", "No"],
			},
			{ name: "Email", param_key: "paymentEmail", mandatory: true },
		],
	},
];

export const getInitialBankingInfo = (empId, companyName) => {
	return {
		empId,
		companyName,
		directDeposit: "Yes",
		bankNum: "",
		transitNum: "",
		accountNum: "",
		payStubSendByEmail: "Yes",
		paymentEmail: "",
	};
};
