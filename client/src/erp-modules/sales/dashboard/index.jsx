import { SimpleGrid } from "@chakra-ui/react";
import useCompany from "hooks/useCompany";
import useSalesAgentData from "hooks/useSalesAgentData";
import useSelectUser from "hooks/useSelectUser";
import PageLayout from "layouts/PageLayout";
import { useState } from "react";
import "react-big-calendar/lib/css/react-big-calendar.css";
import LocalStorageService from "services/LocalStorageService";
import { isManager } from "utils";
import { STATS } from "./data";
import LeftPane from "./leftpane";
import RightPane from "./rightpane";

const CRMDashboard = () => {
	const loggedInUser = LocalStorageService.getItem("user");
	const [stats, setStats] = useState(STATS);

	const { company } = useCompany();

	const { selectedUser, setSelectedUser } = useSelectUser(loggedInUser);

	const employees = useSalesAgentData(company);
	const isManagerRole = isManager(loggedInUser?.role);

	const handleChange = (value) => {
		if (value === "") {
			setSelectedUser(loggedInUser);
		} else {
			setSelectedUser(employees?.find(({ fullName }) => fullName === value));
		}
	};

	return (
		<PageLayout
			showSelectBox={isManagerRole && employees}
			handleChange={handleChange}
			title={`CRM ${isManagerRole ? "Manager " : ""}Dashboard`}
			data={employees}
			selectedValue={selectedUser?.fullName}
		>
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
					user={loggedInUser}
				/>
				<RightPane
					stats={stats}
					selectedUser={selectedUser}
					company={company}
				/>
			</SimpleGrid>
		</PageLayout>
	);
};

export default CRMDashboard;
