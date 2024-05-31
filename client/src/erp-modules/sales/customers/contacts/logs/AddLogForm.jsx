import { VStack } from "@chakra-ui/react";
import PrimaryButton from "components/ui/button/PrimaryButton";
import InputFormControl from "components/ui/form/InputFormControl";
import SelectFormControl from "components/ui/form/SelectFormControl";
import TextAreaFormControl from "components/ui/form/TextAreaFormControl";

const AddLogForm = ({ onSave, logActivity, setLogActivity }) => {
	const handleInputChange = (e) => {
		setLogActivity({ ...logActivity, [e.target.name]: e.target.value });
	};

	const handleSubmit = () => {
		onSave(logActivity);
	};
	return (
		<VStack spacing="4" p="4" width="100%">
			<form className="tab-form">
				<SelectFormControl
					name="type"
					label={"Type of Activity"}
					valueText={logActivity.type}
					handleChange={handleInputChange}
					options={[
						{
							name: "Meeting",
							value: "meeting",
						},
						{
							name: "Email",
							value: "email",
						},
						{
							name: "Phone Call",
							value: "phoneCall",
						},
					]}
				/>
				<InputFormControl
					label={"Duration (minutes)"}
					name="duration"
					type="number"
					valueText={logActivity.duration}
					handleChange={handleInputChange}
				/>
				<TextAreaFormControl
					label={"Description"}
					name="description"
					valueText={logActivity.description}
					handleChange={handleInputChange}
				/>
				<PrimaryButton
					name={"Save Activity"}
					size={"sm"}
					mt={4}
					isDisabled={logActivity.description === ""}
					onOpen={(e) => {
						e.preventDefault();
						handleSubmit();
					}}
				/>
			</form>
		</VStack>
	);
};

export default AddLogForm;
