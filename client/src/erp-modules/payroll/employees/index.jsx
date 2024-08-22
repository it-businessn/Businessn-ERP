import {
	Avatar,
	Badge,
	Checkbox,
	HStack,
	SimpleGrid,
	Spacer,
	VStack,
} from "@chakra-ui/react";
import NormalTextTitle from "components/ui/NormalTextTitle";
import RadioButtonGroup from "components/ui/tab/RadioButtonGroup";
import TextTitle from "components/ui/text/TextTitle";
import EmpSearchMenu from "features/setup/company/group-tab/EmpSearchMenu";
import useCompany from "hooks/useCompany";
import useEmployees from "hooks/useEmployees";
import PageLayout from "layouts/PageLayout";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import LocalStorageService from "services/LocalStorageService";
import BalanceInfo from "./employee-tabs/BalancesInfo";
import BankingInfo from "./employee-tabs/BankingInfo";
import CorporateInfo from "./employee-tabs/CorporateInfo";
import GovernmentInfo from "./employee-tabs/GovernmentContribution";
import PayInfo from "./employee-tabs/PayInfo";
import PersonalInfo from "./employee-tabs/PersonalInfo";

const Employees = () => {
	const { id, stepNo } = useParams();
	const { company } = useCompany(
		LocalStorageService.getItem("selectedCompany"),
	);
	const loggedInUser = LocalStorageService.getItem("user");
	const [employee, setEmployee] = useState(loggedInUser);
	const [userId, setUserId] = useState(id ?? loggedInUser._id);
	const [isRefresh, setIsRefresh] = useState(false);
	const [empName, setEmpName] = useState("");

	const isActivePayroll = employee?.payrollStatus?.includes("Active");

	const { employees, filteredEmployees, setFilteredEmployees } = useEmployees(
		isRefresh,
		company,
	);

	useEffect(() => {
		if (id && employees) {
			setEmployee(employees?.find(({ _id }) => _id === id));
		}
	}, [id, employees]);

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
		setEmployee(emp);
		setUserId(emp._id);
	};

	const SETUP_LIST = [
		{
			id: 0,
			type: "Pay",
			name: <PayInfo company={company} empId={userId} />,
		},
		{
			id: 1,
			type: "Info",

			name: <PersonalInfo company={company} empId={userId} />,
		},
		{
			id: 2,
			type: "Employment",

			name: <CorporateInfo company={company} empId={userId} />,
		},
		{
			id: 3,
			type: "Government",

			name: <GovernmentInfo company={company} empId={userId} />,
		},
		{
			id: 4,
			type: "Banking",

			name: <BankingInfo company={company} empId={userId} />,
		},
		{
			id: 5,
			type: "Balances",

			name: <BalanceInfo company={company} empId={userId} />,
		},
	];

	const tabContent = id ? SETUP_LIST[stepNo].type : SETUP_LIST[0].type;
	const [viewMode, setViewMode] = useState(tabContent);
	const showComponent = (viewMode) =>
		SETUP_LIST.find(({ type }) => type === viewMode)?.name;

	return (
		<PageLayout title={"Employees"}>
			<HStack spacing="1em" mt="1em" justifyContent={"space-between"}>
				<HStack spacing="1em" mt="1em" justifyContent={"space-between"}>
					<Avatar
						// onClick={handleToggle}
						name={employee?.fullName}
						src=""
						boxSize="15"
					/>
					<VStack spacing={0} align={"start"}>
						<TextTitle size="sm" title={employee?.fullName} />
						<NormalTextTitle size="xs" title={employee?.employeeId} />
						{isActivePayroll && (
							<Badge bg="var(--correct_ans)" color="var(--primary_bg)">
								<TextTitle title={"Payroll Activated"} />
							</Badge>
						)}
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
					w={"100%"}
				>
					{SETUP_LIST.map((_) => (
						<RadioButtonGroup
							key={_.id}
							name={_.type}
							selectedFilter={viewMode}
							handleFilterClick={(name) => setViewMode(name)}
							fontSize={"1em"}
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
