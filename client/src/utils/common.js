import { COMPANIES } from "constant";
import User from "models/User";
import LocalStorageService from "services/LocalStorageService";
import { toCapitalize } from "utils";

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

export const getFormattedAddress = (address) =>
	address
		? toCapitalize(
				`${address?.streetNumber || ""} ${address?.city || ""}, ${address?.state || ""} ${
					address?.country || ""
				} ${address?.postalCode || ""}`,
		  )
		: "";

export const payrunType = (payroll) => (payroll?.isExtraRun ? "Extra" : "Regular");

export const isEmptyOrNullOrUndefined = (value) => !value || value === "";

export const getTaskCheckboxCss = (isTaskComplete) => {
	const bg = isTaskComplete ? "var(--action_status_approve)" : "var(--calendar_border)";
	return {
		verticalAlign: "middle",
		".chakra-checkbox__control": {
			borderColor: "gray.400",
			_checked: {
				bg,
				borderColor: bg,
			},
		},
		".chakra-checkbox__icon": {
			color: "var(--action_status_bg)",
		},
	};
};

export const isBusinessN = (company) => company === COMPANIES.BUSINESSN_ORG;
export const isCornerStone = (company) => company === COMPANIES.CORNERSTONE;
export const isNW = (company) => company === COMPANIES.NW;
