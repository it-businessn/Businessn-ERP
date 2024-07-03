import { Box, SimpleGrid } from "@chakra-ui/react";
import TextTitle from "components/ui/text/TextTitle";

import { useEffect, useState } from "react";
import LocalStorageService from "services/LocalStorageService";
import LeftPane from "./leftpane";
import RightPane from "./rightpane";

const EmployeeDashboard = () => {
	const user = LocalStorageService.getItem("user");

	const [selectedUser, setSelectedUser] = useState(user);
	const STATS = [
		{
			name: "In Progress",
			value: 0,
		},
		{
			name: "Completed",
			value: 0,
		},
		{
			name: "Estimate",
			value: 0,
		},
	];
	const [stats, setStats] = useState(STATS);
	const [company, setCompany] = useState(
		LocalStorageService.getItem("selectedCompany"),
	);

	useEffect(() => {
		const handleSelectedCompanyChange = (event) => setCompany(event.detail);

		document.addEventListener(
			"selectedCompanyChanged",
			handleSelectedCompanyChange,
		);

		return () => {
			document.removeEventListener(
				"selectedCompanyChanged",
				handleSelectedCompanyChange,
			);
		};
	}, []);
	return (
		<Box p={{ base: "1em" }} overflow={"hidden"}>
			<TextTitle title={"Employee Dashboard"} mb={"0.5em"} w={"50%"} />

			<SimpleGrid
				columns={{ base: 1, md: 1, lg: 2 }}
				spacing="4"
				mt="4"
				templateColumns={{ lg: "70% 30%" }}
			>
				<LeftPane
					selectedUser={selectedUser}
					setStats={setStats}
					company={company}
				/>
				<RightPane
					stats={stats}
					selectedUser={selectedUser}
					company={company}
				/>
			</SimpleGrid>
		</Box>
	);
};
export default EmployeeDashboard;
