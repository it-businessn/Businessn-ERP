import { Box, Flex, SimpleGrid, Text } from "@chakra-ui/react";
import SelectBox from "components/ui/form/select/SelectBox";
import useFetchData from "hooks/useFetchData";
import useSelectUser from "hooks/useSelectUser";
import { useState } from "react";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { isManager } from "utils";
import { STATS } from "./data";
import LeftPane from "./leftpane";
import RightPane from "./rightpane";

const CRMDashboard = () => {
	const [stats, setStats] = useState(STATS);

	const { user, employees, company } = useFetchData();

	const [selectedUser, setSelectedUser] = useState(user);
	useSelectUser(selectedUser);

	const role = user?.role;

	const handleChange = (value) => {
		if (value === "") {
			setSelectedUser(user);
		} else {
			setSelectedUser(employees?.find(({ fullName }) => fullName === value));
		}
	};

	return (
		<Box p={{ base: "1em" }} overflow={"hidden"}>
			<Flex w={"50%"}>
				<Text fontWeight="bold" mb={"0.5em"} w={"50%"}>
					CRM {isManager(role) && "Manager"} Dashboard
				</Text>
				{isManager(role) && employees ? (
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
				) : null}
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
