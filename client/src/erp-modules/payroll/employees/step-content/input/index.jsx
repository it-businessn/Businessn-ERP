import InputFormControl from "components/ui/form/InputFormControl";
import { HIDE_ONBOARDING_SECTION } from "erp-modules/payroll/workview/data";
import { hideLabel } from "../Record";

const InputRecord = ({
	formData,
	param,
	setFormData,
	handleConfirm,
	isOnboarding,
}) => {
	const isHourlyEarning = formData.typeOfEarning === "Hourly";
	const isSalaryEarning = formData.typeOfEarning === "Salary";
	return isHourlyEarning && param.name === "Salary Rate" ? (
		<></>
	) : isSalaryEarning && param.name === "Regular Pay" ? (
		<></>
	) : (
		(!isOnboarding ||
			(isOnboarding && !HIDE_ONBOARDING_SECTION.includes(param.name))) && (
			<InputFormControl
				required={param?.mandatory}
				subRequired={param?.submandatory}
				label={param.name}
				name={param.param_key}
				type={param.name === "Email" ? "email" : "text"} // text or number
				valueText={formData[param.param_key]?.toLocaleString()}
				fontWeight={param.name === "Address" && "bold"}
				display={param.name === "Address" && "none"}
				visibility={hideLabel(param.name) && "hidden"}
				handleChange={(e) =>
					setFormData((prev) => ({
						...prev,
						[param.param_key]: e.target.value,
					}))
				}
				border={"none"}
				handleConfirm={handleConfirm}
			/>
		)
	);
};

export default InputRecord;
