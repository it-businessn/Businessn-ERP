import {
	Box,
	Button,
	FormControl,
	FormLabel,
	Input,
	Select,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";

const EditOpportunityForm = ({ selectedOpportunity, onSave, onCancel }) => {
	const [formData, setFormData] = useState(selectedOpportunity);
	useEffect(() => {
		setFormData(selectedOpportunity);
	}, [selectedOpportunity]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prevData) => ({ ...prevData, [name]: value }));
	};

	const handleSave = () => {
		onSave(formData);
	};
	return (
		<Box maxW="md" mx="auto" mt={8} p={4} borderWidth="1px" borderRadius="lg">
			<form>
				<FormControl mb={4}>
					<FormLabel>Name</FormLabel>
					<Input
						type="text"
						name="name"
						value={formData.name}
						onChange={handleChange}
						placeholder="Opportunity Name"
					/>
				</FormControl>
				<FormControl mb={4}>
					<FormLabel>Client Name</FormLabel>
					<Input
						type="text"
						name="clientName"
						value={formData.clientName}
						onChange={handleChange}
						placeholder="Client Name"
					/>
				</FormControl>
				<FormControl mb={4}>
					<FormLabel>Stage</FormLabel>
					<Select
						name="stage"
						value={formData.stage}
						onChange={handleChange}
						placeholder="Select stage"
					>
						<option value="New">New</option>
						<option value="Presentation">Presentation</option>
						<option value="Meeting">Meeting</option>
						<option value="Negotiating">Negotiating</option>
						<option value="Won">Won</option>
					</Select>
				</FormControl>
				<FormControl mb={4}>
					<FormLabel>Probability (in %)</FormLabel>
					<Input
						type="number"
						name="probability"
						value={formData.probability}
						onChange={handleChange}
						placeholder="Probability of success"
					/>
				</FormControl>
				<FormControl mb={4}>
					<FormLabel>Deal Amount</FormLabel>
					<Input
						type="number"
						name="dealAmount"
						value={formData.dealAmount}
						onChange={handleChange}
						placeholder="Deal Amount"
					/>
				</FormControl>
				<Button bg="var(--logo_bg)" onClick={handleSave}>
					Save
				</Button>
				<Button colorScheme="gray" ml={2} onClick={onCancel}>
					Cancel
				</Button>
			</form>
		</Box>
	);
};

export default EditOpportunityForm;
