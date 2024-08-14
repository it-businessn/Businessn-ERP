import { SimpleGrid } from "@chakra-ui/react";

import usePaygroup from "hooks/usePaygroup";
import PageLayout from "layouts/PageLayout";
import { useState } from "react";
import LocalStorageService from "services/LocalStorageService";
import { formatDate } from "utils";
import LeftPane from "./leftpane";
import RightPane from "./rightpane";

const Dashboard = () => {
	const company = LocalStorageService.getItem("selectedCompany");
	const { payGroups, selectedPayGroup, setSelectedPayGroup } = usePaygroup(
		company,
		false,
	);

	const loggedInUser = LocalStorageService.getItem("user");

	const STATS = [
		{
			name: "Days till next",
			value: 3,
		},
		{
			name: "Approval Date",
			value: formatDate(new Date()),
		},
		{
			name: "Payment Date",
			value: formatDate(new Date()),
		},
	];
	const [stats, setStats] = useState(STATS);

	const handleChange = (value) => {
		if (value !== "") {
			setSelectedPayGroup(value);
		}
	};
	return (
		<PageLayout
			width={"35%"}
			title={"Dashboard"}
			showSelectBox={true}
			data={payGroups}
			selectAttr="name"
			selectPlaceholder="Select Paygroup"
			selectedValue={selectedPayGroup?.name}
			handleChange={handleChange}
		>
			<SimpleGrid
				columns={{ base: 1, md: 1, lg: 2 }}
				spacing="4"
				mt="4"
				templateColumns={{ lg: "70% 30%" }}
			>
				<LeftPane
					selectedPayGroup={selectedPayGroup}
					setStats={setStats}
					company={company}
				/>
				<RightPane
					selectedUser={loggedInUser}
					stats={stats}
					selectedPayGroup={selectedPayGroup}
					company={company}
				/>
			</SimpleGrid>
		</PageLayout>
	);
};
export default Dashboard;
