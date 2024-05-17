import { Box, SimpleGrid } from "@chakra-ui/react";
import TextTitle from "components/ui/text/TextTitle";

import { useState } from "react";
import LocalStorageService from "services/LocalStorageService";
import LeftPane from "../leftpane";
import RightPane from "../rightpane";

const EmployeeDashboard = () => {
	const user = LocalStorageService.getItem("user");

	const [selectedUser, setSelectedUser] = useState(user);
	const STATS = [
		{
			name: "In Progress",
			count: 0,
		},
		{
			name: "Completed",
			count: 0,
		},
		{
			name: "Estimate",
			count: 0,
		},
	];
	const [stats, setStats] = useState(STATS);
	return (
		<Box p={{ base: "1em" }} overflow={"hidden"}>
			<TextTitle title={"Employee Dashboard"} mb={"0.5em"} w={"50%"} />

			<SimpleGrid
				columns={{ base: 1, md: 1, lg: 2 }}
				spacing="4"
				mt="4"
				templateColumns={{ lg: "70% 30%" }}
			>
				<LeftPane selectedUser={selectedUser} setStats={setStats} />
				<RightPane stats={stats} selectedUser={selectedUser} />
			</SimpleGrid>
		</Box>
	);
};
export default EmployeeDashboard;
