import {
	Button,
	FormControl,
	FormLabel,
	Input,
	Select,
	Textarea,
	VStack,
} from "@chakra-ui/react";
import { useState } from "react";

const AddLogForm = ({ onSave }) => {
	const [logActivity, setLogActivity] = useState({
		type: "meeting",
		phoneCalls: 0,
		duration: 0,
		description: "",
	});

	const handleInputChange = (e) => {
		setLogActivity({ ...logActivity, [e.target.name]: e.target.value });
	};

	const handleSubmit = () => {
		onSave(logActivity);
		setLogActivity({
			type: "",
			phoneCalls: 0,
			duration: 0,
			description: "",
		});
	};
	return (
		<VStack spacing="4" p="4" width="100%">
			<form className="tab-form">
				<FormControl>
					<FormLabel>Type of Activity</FormLabel>
					<Select
						name="type"
						value={logActivity.type}
						onChange={handleInputChange}
					>
						<option value="meeting">Meeting</option>
						<option value="email">Email</option>
						<option value="call">Phone Call</option>
					</Select>
				</FormControl>

				<FormControl>
					<FormLabel>Duration (minutes)</FormLabel>
					<Input
						type="number"
						name="duration"
						value={logActivity.duration}
						onChange={handleInputChange}
					/>
				</FormControl>

				<FormControl>
					<FormLabel>Description</FormLabel>
					<Textarea
						name="description"
						value={logActivity.description}
						onChange={handleInputChange}
					/>
				</FormControl>

				<Button
					mt={4}
					isDisabled={logActivity.description === ""}
					bg="var(--logo_bg)"
					onClick={handleSubmit}
				>
					Save Activity
				</Button>
			</form>
		</VStack>
	);
};

export default AddLogForm;
