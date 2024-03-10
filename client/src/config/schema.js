import { object, string } from "yup";

export const UserSchema = object().shape({
	email: string()
		.required("Please enter email")
		.email("Email must be a valid email address"),
	password: string()
		.required("Please enter password")
		.min(4, "Password should be minimum 4 characters long"),
});

export const LoginSchema = object().shape({
	email: string()
		.required("Please enter email")
		.email("Email must be a valid email address"),
	password: string()
		.required("Please enter password")
		.min(4, "Password should be minimum 4 characters long"),
});

export const RegisterSchema = object().shape({
	name: string()
		.min(4, "Too Short!")
		.max(50, "Too Long!")
		.required("Please enter name"),
	email: string()
		.required("Please enter email")
		.email("Email must be a valid email address"),
	password: string()
		.required("Please enter password")
		.min(4, "Password should be minimum 4 characters long"),
});

export const ResetPasswordSchema = object().shape({
	email: string()
		.required("Please enter email")
		.email("Email must be a valid email address"),
});
