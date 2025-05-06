import { Box, Flex, SimpleGrid, Text, VStack } from "@chakra-ui/react";
import { activityChartData, doughnutOptions } from "constant";
import { Doughnut } from "react-chartjs-2";

const OrderGraph = () => {
	return (
		<Box
			p="1em"
			bg={"var(--primary_bg)"}
			border="3px solid var(--main_color)"
			borderRadius="10px"
			fontWeight="bold"
			mb="1em"
		>
			<Text fontWeight="bold" mb="1em" color={"var(--nav_color)"}>
				Order Categories
			</Text>
			<SimpleGrid columns={{ base: 1, lg: 3 }} spacing="1em">
				<Box
					px="1em"
					bg={"var(--primary_bg)"}
					border="3px solid var(--main_color)"
					borderRadius="10px"
					fontWeight="bold"
				>
					<Text fontWeight="bold" color={"var(--main_color_black)"} mt="2" mb="1">
						Open stage mix
					</Text>
					<VStack>
						<Box h={"40px"} />
						<Box w={{ base: "70%", md: "50%", lg: "100%", xl: "65%" }} mx={"auto"}>
							<Doughnut data={activityChartData} options={doughnutOptions("0%")} />
						</Box>
					</VStack>
				</Box>
				<Box
					p="1em"
					bg={"var(--primary_bg)"}
					border="3px solid var(--main_color)"
					borderRadius="10px"
					fontWeight="bold"
				>
					<Flex justify="space-between" align="center" mb="2">
						<Text fontWeight="bold">Orders to fulfill</Text>
					</Flex>
					<SimpleGrid columns={{ base: 2, md: 1 }} gap={4} h={"85%"}>
						<Box
							p={4}
							border={"2px solid var(--filter_border_color)"}
							borderRadius={"10px"}
							justifyContent="space-evenly"
							display="flex"
							flexDir="column"
						>
							<Text fontSize="xs" fontWeight="bold" color={"var(--nav_color)"}>
								Orders to be Fulfilled
							</Text>
							<Text mr="3" fontSize={"1.25em"}>
								123
							</Text>
						</Box>
						<Box
							p={4}
							border={"2px solid var(--filter_border_color)"}
							borderRadius={"10px"}
							justifyContent="space-evenly"
							display="flex"
							flexDir="column"
						>
							<Text fontSize="xs" fontWeight="bold" color={"var(--nav_color)"}>
								New Order
							</Text>
							<Text mr="3" fontSize={"1.25em"}>
								455
							</Text>
						</Box>
						<Box
							p={4}
							border={"2px solid var(--filter_border_color)"}
							borderRadius={"10px"}
							justifyContent="space-evenly"
							display="flex"
							flexDir="column"
						>
							<Text fontSize="xs" fontWeight="bold" color={"var(--nav_color)"}>
								Approved Orders
							</Text>
							<Text mr="3" fontSize={"1.25em"}>
								$55
							</Text>
						</Box>
					</SimpleGrid>
				</Box>
				<Box
					p="1em"
					bg={"var(--primary_bg)"}
					border="3px solid var(--main_color)"
					borderRadius="10px"
					fontWeight="bold"
				>
					<Flex justify="space-between" align="center" mb="2">
						<Text fontWeight="bold">Key Metrics</Text>
					</Flex>
					<SimpleGrid columns={{ base: 2, md: 1 }} gap={4} h={"80%"}>
						<Box
							p={4}
							border={"2px solid var(--filter_border_color)"}
							borderRadius={"10px"}
							justifyContent="space-evenly"
							display="flex"
							flexDir="column"
						>
							<Text fontSize="xs" fontWeight="bold">
								Fulfillment Rate
							</Text>
							<Text mr="3" fontSize={"1.25em"}>
								45%
							</Text>
						</Box>
						<Box
							p={4}
							border={"2px solid var(--filter_border_color)"}
							borderRadius={"10px"}
							justifyContent="space-evenly"
							display="flex"
							flexDir="column"
						>
							<Text fontSize="xs" fontWeight="bold">
								Time to fulfill
							</Text>
							<Text mr="3" fontSize={"1.25em"}>
								5 days
							</Text>
						</Box>

						<Box
							p={4}
							border={"2px solid var(--filter_border_color)"}
							borderRadius={"10px"}
							justifyContent="space-evenly"
							display="flex"
							flexDir="column"
						>
							<Text fontSize="xs" fontWeight="bold">
								Average order value
							</Text>
							<Text mr="3" fontSize={"1.25em"}>
								$100
							</Text>
						</Box>
					</SimpleGrid>
				</Box>
			</SimpleGrid>
		</Box>
	);
};
export default OrderGraph;
