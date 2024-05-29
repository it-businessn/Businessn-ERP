import { Box, SimpleGrid, Text } from "@chakra-ui/react";
import { useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import HeaderCards from "./HeaderCards";
import QuickSelection from "./quick-selection";
import Scheduler from "./scheduler";

const ScheduleWorkView = () => {
	const [newEmployeeAdded, setNewEmployeeAdded] = useState(null);

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
			<DndProvider backend={HTML5Backend}>
				<SimpleGrid
					columns={{ base: 1, md: 1, lg: 2 }}
					spacing="4"
					mt="4"
					templateColumns={{ lg: "30% 70%" }}
				>
					<QuickSelection setNewEmployeeAdded={setNewEmployeeAdded} />
					<Scheduler newEmployeeAdded={newEmployeeAdded} />
				</SimpleGrid>
			</DndProvider>
		</Box>
	);
};

export default ScheduleWorkView;
