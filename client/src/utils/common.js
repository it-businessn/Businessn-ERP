import User from "models/User";
import LocalStorageService from "services/LocalStorageService";
import { toCapitalize } from "utils";

export const storeUser = (user) => {
	LocalStorageService.setItem("user", user);
};

export const buildUserInfo = (user) => {
	const {
		isShadowAdmin,
		_id,
		firstName,
		lastName,
		middleName,
		fullName,
		email,
		role,
		department,
		phoneNumber,
		primaryAddress,
		employmentType,
		manager,
		companyId,
		employeeId,
		payrollStatus,
	} = user;

	return new User(
		_id,
		firstName,
		lastName,
		middleName,
		fullName,
		email,
		role,
		department,
		phoneNumber,
		primaryAddress,
		employmentType,
		manager,
		companyId,
		employeeId,
		payrollStatus,
		isShadowAdmin,
	);
};
export const getAddress = (address) =>
	address
		? toCapitalize(
				`${address.streetNumber} ${address.city} ${address.state} ${address.country} ${address.postalCode}`,
		  )
		: "";

export const isEmptyOrNullOrUndefined = (value) => !value || value === "";
