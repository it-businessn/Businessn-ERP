import {
	Avatar,
	Badge,
	Checkbox,
	HStack,
	SimpleGrid,
	Spacer,
	VStack,
} from "@chakra-ui/react";
import RadioButtonGroup from "components/ui/tab/RadioButtonGroup";
import TextTitle from "components/ui/text/TextTitle";
import EmpSearchMenu from "features/setup/EmpSearchMenu";
import useCompany from "hooks/useCompany";
import useEmployees from "hooks/useEmployees";
import PageLayout from "layouts/PageLayout";
import { useState } from "react";
import LocalStorageService from "services/LocalStorageService";
import BalanceInfo from "./employee-tabs/BalancesInfo";
import BankingInfo from "./employee-tabs/BankingInfo";
import CorporateInfo from "./employee-tabs/CorporateInfo";
import GovernmentInfo from "./employee-tabs/GovernmentContribution";
import PayInfo from "./employee-tabs/PayInfo";
import PersonalInfo from "./employee-tabs/PersonalInfo";

const Employees = () => {
	const loggedInUser = LocalStorageService.getItem("user");
	const [employee, setEmployee] = useState(loggedInUser?.fullName);
	const [isRefresh, setIsRefresh] = useState(false);
	const { company } = useCompany();
	const { employees, filteredEmployees, setFilteredEmployees } = useEmployees(
		isRefresh,
		company,
	);
	const [empName, setEmpName] = useState(null);

	const handleInputChange = (value) => {
		setEmpName(value);
		setFilteredEmployees(
			employees.filter((emp) =>
				emp?.fullName?.toLowerCase().includes(value.toLowerCase()),
			),
		);
	};

	const handleSelect = (emp) => {
		setEmpName(emp.fullName);
	};

	const SETUP_LIST = [
		{
			id: 0,
			type: "Pay",
			name: <PayInfo />,
		},
		{
			id: 1,
			type: "Info",

			name: <PersonalInfo />,
		},
		{
			id: 2,
			type: "Employment",

			name: <CorporateInfo />,
		},
		{
			id: 3,
			type: "Government",

			name: <GovernmentInfo />,
		},
		{
			id: 4,
			type: "Banking",

			name: <BankingInfo />,
		},
		{
			id: 5,
			type: "Balances",

			name: <BalanceInfo />,
		},
	];
	const [viewMode, setViewMode] = useState(SETUP_LIST[0].type);
	const showComponent = (viewMode) =>
		SETUP_LIST.find(({ type }) => type === viewMode)?.name;

	return (
		<PageLayout title={"Employees"}>
			<HStack spacing="1em" mt="1em" justifyContent={"space-between"}>
				<HStack spacing="1em" mt="1em" justifyContent={"space-between"}>
					<Avatar
						// onClick={handleToggle}
						name={employee}
						src=""
						boxSize="15"
					/>
					<VStack spacing={0} align={"start"}>
						<TextTitle size="sm" title={loggedInUser?.fullName} />
						<TextTitle
							size="xs"
							weight="normal"
							title={loggedInUser?.employeeId}
						/>
						<Badge bg="var(--correct_ans)" color="var(--primary_bg)">
							Active
						</Badge>
					</VStack>
				</HStack>
				<Spacer />
				<VStack spacing={1} w={"30%"} align={"start"}>
					<EmpSearchMenu
						width={"full"}
						filteredEmployees={filteredEmployees}
						empName={empName}
						handleInputChange={handleInputChange}
						handleSelect={handleSelect}
					/>
					<Checkbox
						colorScheme={"facebook"}
						// isChecked={hasChecklist}
						// onChange={() => setHasChecklist(!hasChecklist)}
					>
						Terminated
					</Checkbox>
				</VStack>
			</HStack>

			<HStack
				spacing="1em"
				mt="1em"
				justifyContent={"space-between"}
				w={"100%"}
			>
				<SimpleGrid
					columns={{ base: 4, lg: 6 }}
					spacing="1em"
					my="5"
					bg={"var(--primary_bg)"}
					borderRadius={"20px"}
					p={"8px"}
				>
					{SETUP_LIST.map((_) => (
						<RadioButtonGroup
							key={_.id}
							name={_.type}
							selectedFilter={viewMode}
							handleFilterClick={(name) => setViewMode(name)}
						/>
					))}
				</SimpleGrid>

				{/* <Button
					borderRadius={"50px"}
					border={"1px"}
					w={"17%"}
					color={"var(--tab_radio)"}
					bgColor={generateLighterShade("#537eee", 0.8)}
					// onClick={() => handleFilterClick(name)}
					variant={"outline"}
					leftIcon={<FaSearch />}
				>
					Search here
				</Button> */}
			</HStack>
			{showComponent(viewMode)}
		</PageLayout>
	);
};

export default Employees;
