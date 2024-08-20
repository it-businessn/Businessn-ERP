import { Box, SimpleGrid } from "@chakra-ui/react";

import EmployeeTimeCard from "./EmployeeTimeCard";

const LeftPane = ({ selectedUser, setStats, company }) => {
	return (
		<Box>
			<SimpleGrid
				mb={"1em"}
				columns={{ base: 1 }}
				spacing="1em"
				color={"var(--menu_item_color)"}
			>
				<EmployeeTimeCard selectedUser={selectedUser} company={company} />
			</SimpleGrid>
		</Box>
	);
};

export default LeftPane;
