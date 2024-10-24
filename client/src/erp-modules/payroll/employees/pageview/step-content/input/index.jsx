import InputFormControl from "components/ui/form/InputFormControl";
import { HIDE_ONBOARDING_SECTION } from "erp-modules/payroll/workview/data";
import { hideLabel } from "../Record";

const InputRecord = ({
	formData,
	param,
	setFormData,
	handleConfirm,
	isOnboarding,
	readOnly,
	isBalanceInfo,
}) => {
	const hideSalary =
		formData.typeOfEarning === "Hourly" && param.name === "Salary Rate";
	const hideSalaried =
		formData.typeOfEarning === "Hourly" && param.name === "Standard Hours";

	const fullTimeSalaried =
		formData.typeOfEarning === "Full Time Salaried" &&
		param.name === "Standard Hours";

	const showField =
		!isOnboarding ||
		(isOnboarding && !HIDE_ONBOARDING_SECTION.includes(param.name));
	const controlType = param.name.includes("Email") ? "email" : "text"; // text or number

	const valueText = isBalanceInfo
		? formData?.empPayStub?.[param.param_key] ?? ""
		: formData[param.param_key]?.toLocaleString() ?? "";

	return hideSalary || hideSalaried ? (
		<></>
	) : (
		showField && (
			<InputFormControl
				required={param?.mandatory}
				subRequired={param?.submandatory}
				readOnly={readOnly || fullTimeSalaried}
				label={param.name}
				name={param.param_key}
				type={controlType}
				valueText={valueText}
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
