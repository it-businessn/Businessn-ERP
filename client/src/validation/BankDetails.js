import * as Yup from "yup";

export const BankingFormSchema = Yup.object().shape({
	bankNum: Yup.string()
		.matches(/^\d{3}$/, "Bank number must be exactly 3 digits")
		.required("Bank number is required"),
	transitNum: Yup.string()
		.matches(/^\d{5}$/, "Transit number must be exactly 5 digits")
		.required("Transit number is required"),
	accountNum: Yup.string()
		.matches(/^\d{7,16}$/, "Account number must be between 7 and 16 digits")
		.required("Account number is required"),
});
