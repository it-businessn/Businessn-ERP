import { HStack } from "@chakra-ui/react";
import PrimaryButton from "components/ui/button/PrimaryButton";
import TabsButtonGroup from "components/ui/tab/TabsButtonGroup";
import useCompany from "hooks/useCompany";
import PageLayout from "layouts/PageLayout";
import { useEffect, useState } from "react";
import LocalStorageService from "services/LocalStorageService";
import UserService from "services/UserService";
import ClosedTicket from "./ClosedTicket";
import OpenTicket from "./OpenTicket";

const Tickets = () => {
	const { company } = useCompany(LocalStorageService.getItem("selectedCompany"));
	const loggedInUser = LocalStorageService.getItem("user");
	const userId = loggedInUser.fullName;

	const [showAddEntry, setShowAddEntry] = useState(false);
	const [employees, setEmployees] = useState(null);

	useEffect(() => {
		const fetchAllEmployees = async () => {
			try {
				const { data } = await UserService.getCompanyUsers(company);
				data.map((emp) => (emp.fullName = emp?.empId?.fullName));
				setEmployees(data);
			} catch (error) {
				console.error(error);
			}
		};
		fetchAllEmployees();
	}, []);

	const TABS = [
		{
			id: 0,
			type: "Open",
			name: (
				<OpenTicket
					company={company}
					userId={userId}
					showAddEntry={showAddEntry}
					setShowAddEntry={setShowAddEntry}
					employees={employees}
				/>
			),
		},
		{
			id: 1,
			type: "Closed",
			name: (
				<ClosedTicket
					company={company}
					userId={userId}
					showAddEntry={showAddEntry}
					setShowAddEntry={setShowAddEntry}
					employees={employees}
				/>
			),
		},
	];

	const [viewMode, setViewMode] = useState(TABS[0].type);
	const showComponent = (viewMode) => TABS.find(({ type }) => type === viewMode)?.name;
	return (
		<PageLayout width="full" title={"Tickets"} showDate isTimesheet>
			<HStack spacing={3} justify={"flex-end"} mt={-8}>
				<PrimaryButton size={"sm"} name="Add ticket" onOpen={() => setShowAddEntry(true)} />
			</HStack>

			<HStack w={"90%"} justifyContent={"start"} gap={5} position="sticky" zIndex={4}>
				<TabsButtonGroup
					w={"20%"}
					mt={4}
					isOutlineTab
					tabs={TABS}
					setViewMode={setViewMode}
					viewMode={viewMode}
				/>
			</HStack>

			{showComponent(viewMode)}
		</PageLayout>
	);
};

export default Tickets;
