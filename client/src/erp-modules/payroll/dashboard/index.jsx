import { SimpleGrid } from "@chakra-ui/react";

import useCompany from "hooks/useCompany";
import usePaygroup from "hooks/usePaygroup";
import PageLayout from "layouts/PageLayout";
import { useEffect, useState } from "react";
import LocalStorageService from "services/LocalStorageService";
import LeftPane from "./leftpane";
import RightPane from "./rightpane";

const Dashboard = () => {
	const [selectedPayGroupOption, setSelectedPayGroupOption] = useState(null);
	const { company } = useCompany(LocalStorageService.getItem("selectedCompany"));
	const { payGroups, selectedPayGroup, closestRecord, payGroupSchedule, closestRecordIndex } =
		usePaygroup(company, false);

	useEffect(() => {
		setSelectedPayGroupOption(selectedPayGroup?.name);
	}, [selectedPayGroup]);

	const loggedInUser = LocalStorageService.getItem("user");

	const handleChange = (value) => {
		if (value !== "") {
			setSelectedPayGroupOption(value);
		}
	};
	return (
		<PageLayout
			width={"35%"}
			title="Dashboard"
			showSelectBox={true}
			data={payGroups}
			selectAttr="name"
			selectPlaceholder="Select Paygroup"
			selectedValue={selectedPayGroupOption}
			handleChange={handleChange}
		>
			<SimpleGrid
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
