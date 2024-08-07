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
		primaryAddress,
		employmentType,
		manager,
		companyId,
		employeeId,
		payrollStatus,
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
		this.primaryAddress = primaryAddress;
		this.employmentType = employmentType;
		this.manager = manager;
		this.companyId = companyId;
		this.employeeId = employeeId;
		this.payrollStatus = payrollStatus;
	}
}

export default User;
