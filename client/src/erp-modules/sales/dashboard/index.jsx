import { Box, Flex, SimpleGrid, Text } from "@chakra-ui/react";
import SelectBox from "components/ui/form/select/SelectBox";
import { useEffect, useState } from "react";
import "react-big-calendar/lib/css/react-big-calendar.css";
import LocalStorageService from "services/LocalStorageService";
import UserService from "services/UserService";
import { isManager } from "utils";
import LeftPane from "./leftpane";
import RightPane from "./rightpane";

const CRMDashboard = () => {
	const user = LocalStorageService.getItem("user");
	const [employees, setEmployees] = useState(null);
	const [selectedUser, setSelectedUser] = useState(user);
	const STATS = [
		{
			name: "Events",
			count: 0,
		},
		{
			name: "Meetings",
			count: 0,
		},
		{
			name: "Appointments",
			count: 0,
		},
	];
	const [stats, setStats] = useState(STATS);

	const role = user?.role;

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

	useEffect(() => {
		const fetchAllEmployees = async () => {
			try {
				const response = await UserService.getAllCompanyUsers(company);
				setEmployees(response.data.filter(({ role }) => !isManager(role)));
			} catch (error) {
				console.error(error);
			}
		};
		fetchAllEmployees();
		LocalStorageService.setItem("selectedUser", selectedUser.fullName);
	}, [selectedUser, company]);

	const handleChange = (value) => {
		if (value === "") {
			setSelectedUser(user);
		} else {
			setSelectedUser(employees.find(({ fullName }) => fullName === value));
		}
		LocalStorageService.setItem("selectedUser", selectedUser.fullName);
		document.dispatchEvent(
			new CustomEvent("selectedUserChanged", {
				detail: selectedUser.fullName,
			}),
		);
	};

	return (
		<Box p={{ base: "1em" }} overflow={"hidden"}>
			<Flex w={"50%"}>
				<Text fontWeight="bold" mb={"0.5em"} w={"50%"}>
					CRM {isManager(role) && "Manager"} Dashboard
				</Text>
				{isManager(role) && employees && (
					<SelectBox
						handleChange={handleChange}
						data={employees}
						name="fullName"
						border="1px solid var(--primary_button_bg)"
						color={"brand.primary_button_bg"}
						value={selectedUser?.fullName}
						placeholder="Select"
						size={"sm"}
					/>
				)}
			</Flex>
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
					user={user}
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

export default CRMDashboard;
