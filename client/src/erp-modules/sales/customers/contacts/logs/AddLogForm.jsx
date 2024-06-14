import { VStack } from "@chakra-ui/react";
import PrimaryButton from "components/ui/button/PrimaryButton";
import InputFormControl from "components/ui/form/InputFormControl";
import SelectFormControl from "components/ui/form/SelectFormControl";
import TextAreaFormControl from "components/ui/form/TextAreaFormControl";
import { LOG_TYPES } from "./data";

const AddLogForm = ({ onSave, logActivity, handleInputChange }) => {
	const handleSubmit = () => {
		onSave(logActivity);
	};
	return (
		<VStack spacing="4" p="4" width="100%">
			<form className="tab-form">
				<SelectFormControl
					name="type"
					label={"Type of Activity"}
					valueText={logActivity?.type}
					handleChange={handleInputChange}
					options={LOG_TYPES}
				/>
				{(logActivity.type === "Email" ||
					logActivity.type === "Mailing List") && (
					<InputFormControl
						label={"Enter email address"}
						name="email"
						type="email"
						valueText={logActivity.email}
						handleChange={handleInputChange}
						required
					/>
				)}
				{logActivity.type === "Call" && (
					<>
						<InputFormControl
							label={"Enter phone number"}
							name="phone"
							valueText={logActivity.phone}
							handleChange={handleInputChange}
						/>
						<InputFormControl
							label={"Duration (minutes)"}
							name="duration"
							type="number"
							valueText={logActivity.duration}
							handleChange={handleInputChange}
						/>
					</>
				)}
				{(logActivity.type === "LinkedIn Contact" ||
					logActivity.type === "LinkedIn Message") && (
					<InputFormControl
						label={"Enter contact name"}
						name="linkedInContact"
						valueText={logActivity.linkedInContact}
						handleChange={handleInputChange}
					/>
				)}
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
