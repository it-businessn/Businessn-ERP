import { Box, SimpleGrid } from "@chakra-ui/react";
import "react-big-calendar/lib/css/react-big-calendar.css";
import TimeCard from "./TimeCard";

const LeftPane = ({ selectedUser, setStats }) => {
	return (
		<Box>
			<SimpleGrid
				mb={"1em"}
				columns={{ base: 1 }}
				spacing="1em"
				color={"brand.200"}
			>
				<TimeCard />
			</SimpleGrid>
		</Box>
	);
};

export default LeftPane;
