import DateTimeFormControl from "components/ui/form/DateTimeFormControl";
import { HIDE_ONBOARDING_SECTION } from "erp-modules/payroll/workview/data";
import { getDefaultDate } from "utils/convertDate";

const DateTypeRecord = ({
	param,
	setFormData,
	formData,
	handleConfirm,
	isOnboarding,
	required,
}) => {
	return (
		(!isOnboarding || (isOnboarding && !HIDE_ONBOARDING_SECTION.includes(param.name))) && (
			<DateTimeFormControl
				label={param.name}
				valueText1={formData[param.param_key] ? getDefaultDate(formData[param.param_key]) : ""}
				name1={param.param_key}
				handleChange={(e) => {
					setFormData((prev) => ({
						...prev,
						[param.param_key]: e.target.value,
					}));
					handleConfirm();
				}}
				required={required}
			/>
		)
	);
};

export default DateTypeRecord;
