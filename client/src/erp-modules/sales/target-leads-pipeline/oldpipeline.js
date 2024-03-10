import {
	Badge,
	Box,
	Card,
	CardBody,
	Flex,
	Grid,
	GridItem,
	HStack,
	Stack,
	Text,
} from "@chakra-ui/react";
import { PIPELINE_STAGES } from "constant";
import { useEffect, useState } from "react";
import OpportunityService from "services/OpportunityService";
import { userCurrency } from "utils";
import GradientAreaFillColorChart from "./AreaFillColorChart";

const Pipeline = () => {
	const [opportunities, setOpportunities] = useState([]);
	const [opportunityData, setOpportunityData] = useState([]);

	useEffect(() => {
		const fetchOpportunities = async () => {
			try {
				const response = await OpportunityService.getOpportunitiesByCategory();
				setOpportunities(response.data);
				const opportunityStat = [];
				const sortOrder = [
					"New",
					"Presentation",
					"Meeting",
					"Negotiating",
					"Won",
				];
				PIPELINE_STAGES.map((stage) =>
					opportunityStat.push({
						name: stage.name,
						value: response.data[stage.name]?.opportunities?.length || 0,
						color: stage.color,
					}),
				);
				const sortedData = opportunityStat.sort((a, b) => {
					const indexA = sortOrder.indexOf(a.name);
					const indexB = sortOrder.indexOf(b.name);

					return indexA - indexB;
				});
				setOpportunityData(sortedData);
			} catch (error) {
				console.error(error);
			}
		};

		fetchOpportunities();
	}, []);
	return (
		<Box width="100%">
			<Box ml={-30} width="100%">
				{opportunityData && (
					<GradientAreaFillColorChart opportunityData={opportunityData} />
				)}
			</Box>
			<Grid templateColumns="repeat(5, 1fr)" mx={5}>
				{PIPELINE_STAGES?.map((item) => (
					<GridItem key={item.name}>
						<Box
							height="50px"
							bg={item.color}
							borderRadius="md"
							marginBottom="2"
						>
							<Text color="var(--main_color)" p={2.1} px={5}>
								{item.name}
								{opportunities && (
									<Text fontSize="xs" color="var(--main_color)">
										{opportunities[item.name]?.opportunities?.length} records
									</Text>
								)}
							</Text>
							{opportunities[item.name]?.opportunities?.map((opportunity) => (
								<Card mt={2} mx={2.5} key={opportunity._id}>
									<CardBody p={2}>
										<Flex>
											<Stack>
												<Text
													fontWeight="medium"
													fontSize="sm"
													textTransform="capitalize"
												>
													{opportunity.name}
												</Text>
												<Text color="muted" fontSize="sm">
													{opportunity.clientName}
												</Text>
												<HStack>
													<Text color="muted" fontSize="xs">
														Probability:
													</Text>
													<Badge bg="brand.logo_bg" fontSize="0.8em" mr={2}>
														{opportunity.probability} %
													</Badge>
												</HStack>
												<HStack>
													<Text color="muted" fontSize="xs">
														Deal Amount:
													</Text>
													<Text color="muted" fontSize="xs" fontWeight="bold">
														{userCurrency("CAD").format(opportunity.dealAmount)}
													</Text>
												</HStack>
											</Stack>
										</Flex>
									</CardBody>
								</Card>
							))}
						</Box>
					</GridItem>
				))}
			</Grid>
		</Box>
	);
};

export default Pipeline;
