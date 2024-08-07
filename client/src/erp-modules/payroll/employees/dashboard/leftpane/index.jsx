import { Box, SimpleGrid } from "@chakra-ui/react";

import TimeCard from "./TimeCard";

const LeftPane = ({ selectedUser, setStats, company }) => {
	return (
		<Box>
			<SimpleGrid
				mb={"1em"}
				columns={{ base: 1 }}
				spacing="1em"
				color={"var(--menu_item_color)"}
			>
				<TimeCard selectedUser={selectedUser} company={company} />
			</SimpleGrid>
		</Box>
	);
};

export default LeftPane;
