import { Box, SimpleGrid, Text } from "@chakra-ui/react";
import HeaderCards from "./HeaderCards";
import SchedulingCalendar from "./SchedulingCalendar";

const ScheduleWorkView = () => {
	return (
		<Box p={{ base: "1em" }} overflow={"hidden"}>
			<Text fontWeight="bold" mb={"0.5em"}>
				WorkView
			</Text>
			<SimpleGrid
				mb={"1em"}
				columns={{ base: 1, md: 3 }}
				spacing="1em"
				color={"brand.200"}
			>
				<HeaderCards />
			</SimpleGrid>
			<SimpleGrid
				columns={{ base: 1, md: 1, lg: 2 }}
				spacing="4"
				mt="4"
				templateColumns={{ lg: "30% 70%" }}
			>
				<Box
					p="1em"
					bg={"brand.primary_bg"}
					border="3px solid var(--main_color)"
					borderRadius="10px"
					fontWeight="bold"
				>
					Quick Selections
				</Box>{" "}
				<Box
					p="1em"
					bg={"brand.primary_bg"}
					border="3px solid var(--main_color)"
					borderRadius="10px"
					fontWeight="bold"
				>
					Location 1<SchedulingCalendar />
				</Box>
			</SimpleGrid>
		</Box>
	);
};

export default ScheduleWorkView;
