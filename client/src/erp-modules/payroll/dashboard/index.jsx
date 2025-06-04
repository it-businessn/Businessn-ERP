import { SimpleGrid } from "@chakra-ui/react";

import useCompany from "hooks/useCompany";
import usePaygroup from "hooks/usePaygroup";
import PageLayout from "layouts/PageLayout";
import LocalStorageService from "services/LocalStorageService";
import LeftPane from "./leftpane";
import RightPane from "./rightpane";

const Dashboard = () => {
	const loggedInUser = LocalStorageService.getItem("user");
	const { company } = useCompany(LocalStorageService.getItem("selectedCompany"));
	const {
		hasMultiPaygroups,
		payGroups,
		selectedPayGroup,
		closestRecord,
		payGroupSchedule,
		closestRecordIndex,
		selectedPayGroupOption,
		setSelectedPayGroupOption,
	} = usePaygroup(company, false);

	const handleChange = (value) => {
		if (value !== "") {
			setSelectedPayGroupOption(value);
		}
	};

	return (
		<PageLayout
			hasMultiPaygroups={hasMultiPaygroups}
			width={"35%"}
			title="Dashboard"
			showPayGroup={true}
			data={payGroups}
			selectAttr="name"
			selectPlaceholder="Select Paygroup"
			selectedValue={selectedPayGroupOption}
			handleChange={handleChange}
		>
			<SimpleGrid
				h={"100%"}
				columns={{ base: 1, md: 1, lg: 2 }}
				spacing="4"
				mt="4"
				templateColumns={{ lg: "70% 30%" }}
			>
				<LeftPane
					company={company}
					closestRecord={closestRecord}
					payGroupSchedule={payGroupSchedule}
					closestRecordIndex={closestRecordIndex}
					selectedUser={loggedInUser}
				/>
				<RightPane
					selectedUser={loggedInUser}
					selectedPayGroup={selectedPayGroup}
					payGroupSchedule={payGroupSchedule}
					closestRecord={closestRecord}
					closestRecordIndex={closestRecordIndex}
					company={company}
				/>
			</SimpleGrid>
		</PageLayout>
	);
};
export default Dashboard;
