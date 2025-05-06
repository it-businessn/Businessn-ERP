import InputFormControl from "components/ui/form/InputFormControl";
import { HIDE_ONBOARDING_SECTION } from "erp-modules/payroll/workview/data";
import { convertDecimal } from "utils/convertAmt";
import { hideLabel } from "../Record";

const InputRecord = ({
	formData,
	param,
	setFormData,
	handleConfirm,
	isOnboarding,
	readOnly,
	isBalanceInfo,
	isContribution,
	hasPassword,
	autoComplete,
}) => {
	const isHourlyEarning = formData.typeOfEarning === "Hourly";
	const isFTSalaried = formData.typeOfEarning === "Full Time Salaried";
	const isPTSalaried = formData.typeOfEarning === "Part Time Salaried";

	const standardHrsHidden = isHourlyEarning && param.name.includes("Standard Hours");
	const PTSalariedHidden = isFTSalaried && param.name.includes("(PT)");
	const FTSalariedHidden = isPTSalaried && param.name.includes("(FT)");
	const fullTimeSalariedReadonly = isFTSalaried && param.name.includes("(FT)");
	const passwordExists = param.param_key === "password" && hasPassword;

	const showField =
		!isOnboarding || (isOnboarding && !HIDE_ONBOARDING_SECTION.includes(param.name));

	const hideField = passwordExists || standardHrsHidden || PTSalariedHidden || FTSalariedHidden;

	const controlType = param.name.includes("Email") ? "email" : "text"; // text or number

	const valueText =
		isContribution && readOnly
			? 0
			: isBalanceInfo
			? convertDecimal(formData?.empPayStub?.[param.param_key]) || ""
			: formData[param.param_key]?.toLocaleString() || "";

	return hideField ? (
		<></>
	) : (
		showField && (
			<InputFormControl
				autoComplete={autoComplete}
				required={param?.mandatory}
				subRequired={param?.submandatory}
				readOnly={readOnly || fullTimeSalariedReadonly}
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
