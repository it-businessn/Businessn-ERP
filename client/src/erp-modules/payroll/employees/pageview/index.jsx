import {
	Avatar,
	HStack,
	Spacer,
	Tab,
	TabList,
	TabPanel,
	TabPanels,
	Tabs,
	VStack,
} from "@chakra-ui/react";
import ActiveBadge from "components/ActiveBadge";
import NormalTextTitle from "components/ui/NormalTextTitle";
import TextTitle from "components/ui/text/TextTitle";
import { ROLES } from "constant";
import { tabStyleCss } from "erp-modules/payroll/onboard-user/customInfo";
import useCompany from "hooks/useCompany";
import useCompanyEmployees from "hooks/useCompanyEmployees";
import usePaygroup from "hooks/usePaygroup";
import PageLayout from "layouts/PageLayout";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import LocalStorageService from "services/LocalStorageService";
import EmpProfileSearch from "../EmpProfileSearch";
import BankingInfo from "./edit-user/bank-info/BankingInfo";
import BenefitInfo from "./edit-user/benefit-info/BenefitInfo";
import EmploymentInfo from "./edit-user/employment-info/EmploymentInfo";
import GovernmentInfo from "./edit-user/govt-info/GovernmentInfo";
import PayInfo from "./edit-user/pay-info/PayInfo";
import PersonalInfo from "./edit-user/personal-info/PersonalInfo";

const Employees = () => {
	const loggedInUser = LocalStorageService.getItem("user");
	const deptName = loggedInUser?.role === ROLES.MANAGER ? loggedInUser?.department : null;

	const { id, stepNo } = useParams();
	const { company } = useCompany(LocalStorageService.getItem("selectedCompany"));
	const [employee, setEmployee] = useState(null);
	const [userId, setUserId] = useState(id || loggedInUser._id);
	const [filteredEmployees, setFilteredEmployees] = useState(null);
	const [tabIndex, setTabIndex] = useState(parseInt(stepNo) || 0);

	const { payGroups, selectedPayGroupOption } = usePaygroup(company, false);
	const employees = useCompanyEmployees(company, deptName, selectedPayGroupOption);

	useEffect(() => {
		setFilteredEmployees(employees);
	}, [employees]);

	useEffect(() => {
		if (id && employees) {
			const user = employees?.find(({ empId }) => empId?._id === id);
			setEmployee(user);
		}
	}, [id, employees]);

	const isActivePayroll =
		employee?.payrollStatus?.includes("Active") ||
		(!id && !employee && loggedInUser?.payrollStatus?.includes("Active"));

	const employeeID = employee?.employeeNo || (!id && !employee && loggedInUser?.employeeId);
	const employeeName = employee?.empId?.fullName || (!id && !employee && loggedInUser?.fullName);

	const EMP_INFO_TABS = [
		{
			name: "Personal Info",
			content: <PersonalInfo company={company} userId={userId} />,
		},
		{
			name: "Employment",
			content: (
				<EmploymentInfo
					company={company}
					userId={userId}
					payGroups={payGroups}
					selectedPayGroupOption={selectedPayGroupOption}
				/>
			),
		},
		{
			name: "Pay",
			content: <PayInfo company={company} userId={userId} />,
		},
		{
			name: "Benefits",
			content: <BenefitInfo company={company} userId={userId} />,
		},
		{
			name: "Government",
			content: <GovernmentInfo company={company} userId={userId} />,
		},
		{
			name: "Banking",
			content: <BankingInfo company={company} userId={userId} />,
		},
	];

	return (
		<PageLayout title="Employee Info">
			<HStack spacing="1em" mt="1em" justifyContent={"space-between"}>
				<HStack spacing="1em" justifyContent={"space-between"}>
					<Avatar
						borderRadius="10%"
						// onClick={handleToggle}
						name={employeeName}
						src={null}
						boxSize="15"
					/>
					<VStack spacing={0} align={"start"}>
						<TextTitle size="sm" title={employeeName} />
						<NormalTextTitle size="xs" title={employeeID} />
						{isActivePayroll && <ActiveBadge title={"Payroll Activated"} />}
					</VStack>
				</HStack>
				<Spacer />
				<EmpProfileSearch
					filteredEmployees={filteredEmployees}
					setFilteredEmployees={setFilteredEmployees}
					setUserId={setUserId}
					setEmployee={setEmployee}
					employees={employees}
				/>
			</HStack>
			<Tabs
				index={tabIndex}
				onChange={setTabIndex}
				variant="enclosed"
				colorScheme="purple"
				display="flex"
				flexDirection="column"
				height="100%"
				sx={tabStyleCss}
				isLazy
				lazyBehavior="unmount"
			>
				<TabList bg="gray.50" px={6} pt={5} pb={2} justifyContent="space-between">
					{EMP_INFO_TABS.map(({ name }) => (
						<Tab
							w="100%"
							key={name}
							fontWeight="semibold"
							px={8}
							_selected={{ color: "white", bg: "var(--banner_bg)" }}
						>
							{name}
						</Tab>
					))}
				</TabList>

				<TabPanels flex="1" overflow="hidden">
					{EMP_INFO_TABS.map(({ name, content }, i) => (
						<TabPanel key={`${name}_content_${i}`}>{content}</TabPanel>
					))}
				</TabPanels>
			</Tabs>
		</PageLayout>
	);
};

export default Employees;
