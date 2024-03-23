import User from "./User";

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
	);
};
