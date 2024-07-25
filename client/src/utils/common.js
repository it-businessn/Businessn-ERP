import User from "models/User";
import LocalStorageService from "services/LocalStorageService";

export const storeUser = (user) => {
	LocalStorageService.setItem("user", user);
};

export const buildUserInfo = (user) => {
	const {
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
	);
};
