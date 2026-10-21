import { SimpleGrid } from "@chakra-ui/react";
import useSalesAgentData from "hooks/useSalesAgentData";
import useSelectUser from "hooks/useSelectUser";
import PageLayout from "layouts/PageLayout";
import { useState } from "react";
import "react-big-calendar/lib/css/react-big-calendar.css";
import LocalStorageService from "services/LocalStorageService";
import { isNotEnrollerOrEmployee } from "utils";
import { STATS } from "./data";
import LeftPane from "./leftpane";
import RightPane from "./rightpane";

const CRMDashboard = () => {
	const company = LocalStorageService.getItem("selectedCompany");
	const loggedInUser = LocalStorageService.getItem("user");
	const [stats, setStats] = useState(STATS);

	const { selectedUser, setSelectedUser } = useSelectUser(loggedInUser);

	const employees = useSalesAgentData(company, false, true);
	const isManagerRole = isNotEnrollerOrEmployee(loggedInUser?.role);

	const handleChange = (value) => {
		if (value === "") {
			setSelectedUser(loggedInUser);
		} else {
			setSelectedUser(employees?.find(({ fullName }) => fullName === value));
		}
	};

	return (
		<PageLayout
			selectPlaceholder="Select Agent"
			showSelectBox={isManagerRole && employees}
			handleChange={handleChange}
			title={`CRM ${isManagerRole ? "Manager " : ""}Dashboard`}
			data={employees}
			selectedValue={selectedUser?.fullName || ""}
			// UI-01: fixed 4em 8em gutters wasted ~250px of width on laptop screens
			p={{ base: "0.5em", md: "1.5em", xl: "2em 2.5em", "2xl": "3em 5em" }}
		>
			<SimpleGrid
				columns={{ base: 1, md: 1, lg: 2 }}
				spacing="4"
				mt="4"
				templateColumns={{ base: "minmax(0, 1fr)", lg: "minmax(0, 70fr) minmax(0, 30fr)" }}
			>
				<LeftPane
					selectedUser={selectedUser}
					setStats={setStats}
					company={company}
					user={loggedInUser}
				/>
				<RightPane stats={stats} selectedUser={selectedUser} company={company} />
			</SimpleGrid>
		</PageLayout>
	);
};

export default CRMDashboard;
