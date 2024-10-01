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
import useSelectedEmp from "hooks/useSelectedEmp";
import PageLayout from "layouts/PageLayout";
import { useEffect, useState } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { useParams } from "react-router-dom";
import LocalStorageService from "services/LocalStorageService";
import BalanceInfo from "./employee-tabs/BalancesInfo";
import BankingInfo from "./employee-tabs/BankingInfo";
import CorporateInfo from "./employee-tabs/CorporateInfo";
import GovernmentInfo from "./employee-tabs/GovernmentContribution";
import PayInfo from "./employee-tabs/PayInfo";
import PersonalInfo from "./employee-tabs/PersonalInfo";

const Employees = ({ isOnboarding, selectedPayGroupName, handleClose }) => {
	const { id, stepNo } = useParams();
	const { company } = useCompany(
		LocalStorageService.getItem("selectedCompany"),
	);
	const loggedInUser = LocalStorageService.getItem("user");
	const [employee, setEmployee] = useState(loggedInUser);
	const [userId, setUserId] = useState(id ?? loggedInUser._id);
	const { setEmpId } = useSelectedEmp(userId);
	const [isRefresh, setIsRefresh] = useState(false);
	const [empName, setEmpName] = useState("");

	const isActivePayroll = employee?.payrollStatus?.includes("Active");

	const { employees, filteredEmployees, setFilteredEmployees } = useEmployees(
		isRefresh,
		company,
		isOnboarding,
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

	useEffect(() => {
		if (isOnboarding) {
			setTabs((prev) => prev.filter((item, index) => index < 5));
			setEmployee(null);
			setUserId(null);
		}
	}, [isOnboarding]);

	const handleSelect = (emp) => {
		setEmpName(emp.fullName);
		setEmployee(emp);
		setUserId(emp._id);
	};

	useEffect(() => {
		setEmpId(userId);
	}, [userId]);

	const handleNext = (id) => setViewMode(SETUP_LIST[id]?.type);
	const handlePrev = (id) => setViewMode(SETUP_LIST[id - 2]?.type);
	const SETUP_LIST = [
		{
			id: 0,
			type: "Personal Info",

			name: (
				<PersonalInfo
					id={1}
					company={company}
					isOnboarding={isOnboarding}
					handleNext={handleNext}
				/>
			),
		},
		{
			id: 1,
			type: "Pay",
			name: (
				<PayInfo
					id={2}
					company={company}
					isOnboarding={isOnboarding}
					handleNext={handleNext}
					handlePrev={handlePrev}
				/>
			),
		},
		{
			id: 2,
			type: "Employment",

			name: (
				<CorporateInfo
					id={3}
					company={company}
					isOnboarding={isOnboarding}
					selectedPayGroupName={selectedPayGroupName}
					handleNext={handleNext}
					handlePrev={handlePrev}
				/>
			),
		},
		{
			id: 3,
			type: "Government",

			name: (
				<GovernmentInfo
					id={4}
					company={company}
					isOnboarding={isOnboarding}
					handleNext={handleNext}
					handlePrev={handlePrev}
				/>
			),
		},
		{
			id: 4,
			type: "Banking",
			name: (
				<BankingInfo
					id={5}
					company={company}
					handlePrev={handlePrev}
					isOnboarding={isOnboarding}
					handleClose={handleClose}
				/>
			),
		},
		{
			id: 5,
			type: "Balances",
			name: <BalanceInfo company={company} />,
		},
	];

	const [tabs, setTabs] = useState(SETUP_LIST);
	const tabContent = id ? SETUP_LIST[stepNo]?.type : SETUP_LIST[0]?.type;
	const [viewMode, setViewMode] = useState(tabContent);

	const currentTab = tabs.find(({ type }) => type === viewMode)?.id;

	const showComponent = (viewMode) =>
		tabs.find(({ type }) => type === viewMode)?.name;

	return (
		<PageLayout title={isOnboarding ? "" : "Employees"}>
			{!isOnboarding && (
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
			)}

			<HStack
				spacing="1em"
				mt={isOnboarding ? 0 : "1em"}
				justifyContent={"space-between"}
				w={"100%"}
			>
				<SimpleGrid
					columns={{ base: 4, lg: isOnboarding ? 5 : 6 }}
					spacing="1em"
					my="5"
					bg={"var(--primary_bg)"}
					borderRadius={"20px"}
					p={"8px"}
					w={"100%"}
				>
					{tabs?.map((_) => (
						<RadioButtonGroup
							key={_?.id}
							name={_?.type}
							selectedFilter={viewMode}
							handleFilterClick={(name) => setViewMode(name)}
							fontSize={"1em"}
							rightIcon={
								isOnboarding && (
									<FaCheckCircle
										color={_?.id <= currentTab ? "green" : "grey"}
									/>
								)
							}
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
