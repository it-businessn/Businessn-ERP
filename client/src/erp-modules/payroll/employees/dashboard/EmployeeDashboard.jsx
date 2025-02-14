import { SimpleGrid } from "@chakra-ui/react";

import useCompany from "hooks/useCompany";
import PageLayout from "layouts/PageLayout";
import { useState } from "react";
import { useBreakpointValue } from "services/Breakpoint";
import LocalStorageService from "services/LocalStorageService";
import LeftPane from "./leftpane";
import RightPane from "./rightpane";

const EmployeeDashboard = () => {
	const { isMobile } = useBreakpointValue();
	const { company } = useCompany(LocalStorageService.getItem("selectedCompany"));
	const selectedUser = LocalStorageService.getItem("user");
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

	return (
		<PageLayout title="Employee Dashboard">
			<SimpleGrid
				columns={{ base: 1, md: 1, lg: 2 }}
				spacing="4"
				mt="4"
				templateColumns={{ lg: "70% 30%" }}
			>
				<LeftPane
					isMobile={isMobile}
					selectedUser={selectedUser}
					setStats={setStats}
					company={company}
				/>
				{!isMobile && <RightPane stats={stats} selectedUser={selectedUser} company={company} />}
			</SimpleGrid>
		</PageLayout>
	);
};
export default EmployeeDashboard;
