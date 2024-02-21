import {
	Flex,
	HStack,
	Input,
	Table,
	Tbody,
	Td,
	Th,
	Thead,
	Tr,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import * as api from "services";

const OpportunitiesList = () => {
	const [opportunities, setOpportunities] = useState([]);

	useEffect(() => {
		const fetchOpportunities = async () => {
			try {
				const response = await api.getOpportunities();
				setOpportunities(response.data);
			} catch (error) {
				console.error(error);
			}
		};
		fetchOpportunities();
	}, []);

	const [filter, setFilter] = useState({
		name: "",
		clientName: "",
		stage: "",
		dealAmount: 0,
	});

	const handleFilterChange = (field, value) => {
		setFilter((prevFilter) => ({
			...prevFilter,
			[field]: value,
		}));
	};

	const filteredOpportunities = opportunities.filter((opp) => {
		return (
			opp.name.toLowerCase().includes(filter.name.toLowerCase()) &&
			opp.clientName.toLowerCase().includes(filter.clientName.toLowerCase()) &&
			opp.stage.toLowerCase().includes(filter.stage.toLowerCase())
		);
	});

	return (
		<Flex direction="column" p={4}>
			<Flex mb={4}>
				<HStack width="100%">
					<Input
						placeholder="Filter by Opportunity Name"
						value={filter.name}
						onChange={(e) => handleFilterChange("name", e.target.value)}
					/>
					<Input
						placeholder="Filter by Client Name"
						value={filter.clientName}
						onChange={(e) => handleFilterChange("clientName", e.target.value)}
					/>
					<Input
						placeholder="Filter by Stage"
						value={filter.stage}
						onChange={(e) => handleFilterChange("stage", e.target.value)}
					/>
					{/* <Input
            placeholder="Filter by Deal Amount"
            value={filter.dealAmount}
            onChange={(e) => handleFilterChange("dealAmount", e.target.value)}
          /> */}
					{/* <Input
            placeholder="Filter by Probability"
            value={filter.probability}
            onChange={(e) => handleFilterChange("probability", e.target.value)}
          /> */}
				</HStack>
			</Flex>

			<Table variant="striped" bg="brand.logo_bg">
				<Thead>
					<Tr>
						<Th>Opportunity Name</Th>
						<Th>Client Name</Th>
						<Th>Stage</Th>
						<Th>Deal Amount</Th>
						<Th>Probability</Th>
					</Tr>
				</Thead>
				<Tbody>
					{filteredOpportunities.map((opp) => (
						<Tr key={opp._id}>
							<Td>{opp.name}</Td>
							<Td>{opp.clientName}</Td>
							<Td>{opp.stage}</Td>
							<Td>{opp.dealAmount}</Td>
							<Td>{opp.probability}</Td>
						</Tr>
					))}
				</Tbody>
			</Table>
		</Flex>
	);
};

export default OpportunitiesList;
