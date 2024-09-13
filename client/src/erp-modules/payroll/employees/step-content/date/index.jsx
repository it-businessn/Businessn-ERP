import DateTimeFormControl from "components/ui/form/DateTimeFormControl";
import { getDefaultDate } from "utils";

const DateTypeRecord = ({
	param,
	setFormData,
	formData,
	handleConfirm,
	isOnboarding,
}) => {
	return (
		(!isOnboarding || (isOnboarding && param.name !== "Leave Date")) && (
			<DateTimeFormControl
				label={param.name}
				valueText1={
					formData[param.param_key]
						? getDefaultDate(formData[param.param_key])
						: ""
				}
				name1={param.param_key}
				handleChange={(e) => {
					setFormData((prev) => ({
						...prev,
						[param.param_key]: e.target.value,
					}));
					handleConfirm();
				}}
				required
			/>
		)
	);
};

export default DateTypeRecord;
