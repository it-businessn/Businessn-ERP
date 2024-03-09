import {
	Button,
	FormControl,
	FormLabel,
	HStack,
	Input,
	Select,
	Stack,
} from "@chakra-ui/react";
import ModalLayout from "components/ui/ModalLayout";
import PrimaryButton from "components/ui/PrimaryButton";
import { PROJECT_ASSIGNEES } from "features/project/workview/data";
import { useState } from "react";
import { FaCaretDown } from "react-icons/fa";
import LeadsService from "services/LeadsService";
import AssigneeSelector from "./AssigneeSelector";
import { LEAD_STAGES } from "./data";

const AddNewOpportunity = ({ isOpen, onClose, setIsAdded }) => {
	const defaultOpportunity = {
		opportunityName: "",
		abbreviation: "",
		email: "",
		stage: "",
		primaryAssignee: [],
		supervisorAssignee: [],
	};

	const [isSubmitting, setSubmitting] = useState(false);
	const [error, setError] = useState(false);
	const [formData, setFormData] = useState(defaultOpportunity);

	const [selectedPrimaryAssignees, setSelectedPrimaryAssignees] = useState([]);
	const [selectedSupervisorAssignees, setSelectedSupervisorAssignees] =
		useState([]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prevData) => ({ ...prevData, [name]: value }));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		formData.primaryAssignee = selectedPrimaryAssignees;
		formData.supervisorAssignee = selectedSupervisorAssignees;

		setSubmitting(true);

		try {
			await LeadsService.createOpportunity(formData);
			setIsAdded(true);
			onClose();
			setFormData(defaultOpportunity);
			setSubmitting(false);
		} catch (error) {
			setError("An error occurred while creating new opportunity");
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<ModalLayout
			title={"Add New Opportunity"}
			isOpen={isOpen}
			onClose={onClose}
			error={error}
		>
			<form onSubmit={handleSubmit}>
				<Stack spacing={4}>
					<FormControl>
						<FormLabel>Opportunity name</FormLabel>
						<Input
							type="text"
							name="opportunityName"
							value={formData.opportunityName}
							onChange={handleChange}
							required
						/>
					</FormControl>
					<FormControl>
						<FormLabel>Abbreviation</FormLabel>
						<Input
							type="text"
							name="abbreviation"
							value={formData.abbreviation}
							onChange={handleChange}
							required
						/>
					</FormControl>
					<FormControl>
						<FormLabel>Email</FormLabel>
						<Input
							type="email"
							name="email"
							value={formData.email}
							onChange={handleChange}
							required
						/>
					</FormControl>
					<FormControl>
						<FormLabel>Stage</FormLabel>
						<Select
							icon={<FaCaretDown />}
							borderRadius="10px"
							size="sm"
							placeholder="Select Stage"
							name="stage"
							value={formData.stage}
							onChange={handleChange}
						>
							{LEAD_STAGES.map(({ abbr, name }) => (
								<option value={abbr} key={abbr}>
									{`${abbr} - ${name}`}
								</option>
							))}
						</Select>
					</FormControl>

					<AssigneeSelector
						assignees={PROJECT_ASSIGNEES}
						selectedAssignees={selectedPrimaryAssignees}
						onAssigneeChange={setSelectedPrimaryAssignees}
						onRemoveAssignee={setSelectedPrimaryAssignees}
						label="Primary Assignee"
						name="primaryAssignee"
					/>

					<AssigneeSelector
						assignees={PROJECT_ASSIGNEES}
						selectedAssignees={selectedSupervisorAssignees}
						onAssigneeChange={setSelectedSupervisorAssignees}
						onRemoveAssignee={setSelectedSupervisorAssignees}
						label="Supervisor Assignee"
						name="supervisorAssignee"
					/>

					<HStack justifyContent={"end"}>
						<PrimaryButton name="Add" isLoading={isSubmitting} px="2em" />

						<Button onClick={onClose} colorScheme="gray">
							Cancel
						</Button>
					</HStack>
				</Stack>
			</form>
		</ModalLayout>
	);
};

export default AddNewOpportunity;
