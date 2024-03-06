class User {
	constructor(
		_id,
		firstName,
		lastName,
		middleName,
		fullName,
		email,
		role,
		department,
		phoneNumber,
		address,
	) {
		this._id = _id;
		this.fullName = fullName;
		this.firstName = firstName;
		this.lastName = lastName;
		this.middleName = middleName;
		this.email = email;
		this.role = role;
		this.department = department;
		this.phoneNumber = phoneNumber;
		this.address = address;
	}
}

export default User;
