import { Box, Button, Input, Stack, Text } from "@chakra-ui/react";
import { useState } from "react";

const OpportunityList = ({ opportunities, onEdit }) => {
	const [filter, setFilter] = useState("");
	const filteredOpportunities = opportunities.filter((opp) =>
		opp.opportunityName.toLowerCase().includes(filter.toLowerCase()),
	);

	return (
		<Box>
			<Stack direction="row" spacing={4} mb={4}>
				<Input
					placeholder="Search Opportunity..."
					value={filter}
					onChange={(e) => setFilter(e.target.value)}
				/>
			</Stack>
			{filteredOpportunities.map((opp) => (
				<Box key={opp.opportunityName} borderWidth="1px" p={4} mb={4}>
					<Text>{opp.opportunityName}</Text>
					<Text>Client: {opp.clientName}</Text>
					<Button bg="brand.logo_bg" onClick={() => onEdit(opp)}>
						Edit
					</Button>
				</Box>
			))}
		</Box>
	);
};

export default OpportunityList;
