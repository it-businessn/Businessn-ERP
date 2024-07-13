import User from "models/User";
import LocalStorageService from "services/LocalStorageService";

export const loggedInUser = LocalStorageService.getItem("user");

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
	);
};
