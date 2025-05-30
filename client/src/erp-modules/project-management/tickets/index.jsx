import { HStack } from "@chakra-ui/react";
import LeftIconButton from "components/ui/button/LeftIconButton";
import TabsButtonGroup from "components/ui/tab/TabsButtonGroup";
import useCompany from "hooks/useCompany";
import PageLayout from "layouts/PageLayout";
import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
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
		<PageLayout width="full" title={"Tickets"} showDate isTimesheet bg="#f9f9fb">
			<HStack spacing={3} justify={"flex-end"} mt={-8}>
				<LeftIconButton
					name="New Ticket"
					size="sm"
					icon={<FaPlus color="#fff" fontSize="14px" />}
					handleClick={() => setShowAddEntry(true)}
					bg="#371f37"
					color="white"
					_hover={{
						bg: "#4e2847",
						transform: "scale(1.02)",
						transition: "all 0.2s ease-in-out",
					}}
					px={4}
				/>
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
