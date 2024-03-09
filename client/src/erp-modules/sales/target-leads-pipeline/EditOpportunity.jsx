import {
	Box,
	Button,
	HStack,
	Input,
	Spacer,
	Stack,
	Text,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import OpportunityService from "services/OpportunityService";
import EditOpportunityForm from "./EditOpportunityForm";

const EditOpportunity = () => {
	const [opportunities, setOpportunities] = useState([]);

	useEffect(() => {
		const fetchOpportunities = async () => {
			try {
				const response = await OpportunityService.getOpportunities();
				setOpportunities(response.data);
			} catch (error) {
				console.error(error);
			}
		};

		fetchOpportunities();
	}, []);
	const [filter, setFilter] = useState("");
	const [edit, setEditForm] = useState(false);
	const [opportunity, setSelectedOpportunity] = useState("");
	const filteredOpportunities = opportunities.filter((opp) =>
		opp.clientName.toLowerCase().includes(filter.toLowerCase()),
	);
	const navigate = useNavigate();
	const editOpportunity = (opp) => {
		setEditForm(true);
		setSelectedOpportunity(opp);
	};
	const handleSave = async (updatedOpportunity) => {
		try {
			await OpportunityService.updateOpportunity(
				updatedOpportunity,
				updatedOpportunity._id,
			);
			setSelectedOpportunity(null);
			setEditForm((prev) => !prev);
			navigate("/pipeline");
		} catch (error) {
			console.error("Error adding opportunity:", error);
		}
	};

	const handleCancel = () => {
		setSelectedOpportunity(null);
		setEditForm((prev) => !prev);
		navigate("/pipeline");
	};
	return (
		<Box>
			<Stack direction="row" spacing={4} mb={4}>
				<Input
					placeholder="Search Opportunity..."
					value={filter}
					onChange={(e) => setFilter(e.target.value)}
				/>
			</Stack>
			{!edit &&
				filteredOpportunities.map((opp) => (
					<Box key={opp.name} borderWidth="1px" p={2}>
						<HStack>
							<Text>{opp.name}</Text>
							<Text fontWeight="bold">Client: {opp.clientName}</Text>
							<Spacer />
							<Button bg="brand.logo_bg" onClick={() => editOpportunity(opp)}>
								Edit
							</Button>
						</HStack>
					</Box>
				))}
			{edit && (
				<EditOpportunityForm
					onSave={handleSave}
					onCancel={handleCancel}
					selectedOpportunity={opportunity}
				/>
			)}
		</Box>
	);
};

export default EditOpportunity;
