import { Box, Flex, SimpleGrid } from "@chakra-ui/react";
import TextTitle from "components/ui/text/TextTitle";

import SelectBox from "components/ui/form/select/SelectBox";
import useLoggedInUser from "hooks/useLoggedInUser";
import { useEffect, useState } from "react";
import LocalStorageService from "services/LocalStorageService";
import PayrollService from "services/PayrollService";
import { formatDate } from "utils";
import LeftPane from "./leftpane";
import RightPane from "./rightpane";

const Dashboard = () => {
	const loggedInUser = useLoggedInUser();

	const [selectedPayGroup, setSelectedPayGroup] = useState(null);
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
	const [company, setCompany] = useState(
		LocalStorageService.getItem("selectedCompany"),
	);
	const [payGroups, setPayGroups] = useState(null);

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
		const fetchAllPaygroups = async () => {
			try {
				const response = await PayrollService.getAllPaygroups(company);
				setPayGroups(response.data);
			} catch (error) {
				console.error(error);
			}
		};
		fetchAllPaygroups();
	}, [company]);

	const handleChange = (value) => {
		if (value !== "") {
			setSelectedPayGroup(value);
		}
	};
	return (
		<Box p={{ base: "1em" }} overflow={"hidden"}>
			<Flex width={"40%"}>
				<TextTitle title={"Dashboard"} mb={"0.5em"} width={"10em"} />
				{/* {isManager(role) && employees && ( */}
				<SelectBox
					handleChange={handleChange}
					data={payGroups}
					name="name"
					border="1px solid var(--primary_button_bg)"
					color={"var(--primary_button_bg)"}
					value={selectedPayGroup}
					placeholder="Select Paygroup"
					size={"sm"}
				/>
				{/* )} */}
			</Flex>

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
		</Box>
	);
};
export default Dashboard;
