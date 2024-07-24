import InputFormControl from "components/ui/form/InputFormControl";
import { hideLabel } from "../Record";

const InputRecord = ({ formData, param, setFormData, handleConfirm }) => (
	<InputFormControl
		label={param.name}
		name={param.param_key}
		// type={param.param_type}// text or number
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
);

export default InputRecord;
