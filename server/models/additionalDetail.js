const Address = {
	streetNumber: {
		type: String,
		required: true,
	},
	city: {
		type: String,
		required: true,
	},
	postalCode: {
		type: String,
		required: true,
	},
	state: {
		type: String,
		required: true,
	},
	country: {
		type: String,
		required: true,
	},
};

const EmergencyContact = {
	firstName: { type: String, required: true },
	middleName: String,
	lastName: String,
	relationship: String,
	emergencyContactNumber: {
		type: String,
		required: true,
	},
};

const ModeOfPayment = {
	payment_mode: { type: String, required: true },
	description: { type: String, required: true },
	additional_info: { type: String, required: true },
	fees: { type: String, required: true },
};

const LeaveUtilization = {
	leaveType: {
		type: String,
		required: true,
	},
	balance: {
		type: Number,
		required: true,
	},
};

module.exports = { Address, EmergencyContact, ModeOfPayment, LeaveUtilization };
