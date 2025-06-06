import {
	Box,
	Flex,
	HStack,
	Input,
	InputGroup,
	InputRightElement,
	SimpleGrid,
	useDisclosure,
} from "@chakra-ui/react";
import LeftIconButton from "components/ui/button/LeftIconButton";
import RadioFormControl from "components/ui/form/RadioFormControl";
import { ROLES } from "constant";
import NewEmployeeOnboardingModal from "erp-modules/payroll/onboard-user/NewEmployeeOnboardingModal";
import PayrollActions from "erp-modules/payroll/workview/paygroup-header-table/PayrollActions";
import useCompany from "hooks/useCompany";
import useEmployees from "hooks/useEmployees";
import usePaygroup from "hooks/usePaygroup";
import PageLayout from "layouts/PageLayout";
import { useEffect, useState } from "react";
import { FaPlus, FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { payrollEmployeePath } from "routes";
import LocalStorageService from "services/LocalStorageService";
import EmployeeList from "./EmployeeList";
import SendEmailList from "./SendEmailList";

const EmployeeListView = () => {
	const loggedInUser = LocalStorageService.getItem("user");
	const { company } = useCompany(LocalStorageService.getItem("selectedCompany"));
	const { isOpen: showOnboard, onOpen: openOnboard, onClose: closeOnboard } = useDisclosure();

	const [payrollState, setPayrollState] = useState({
		isPayrollActive: true,
		isPayrollInactive: false,
		isPayrollTerminated: false,
	});
	const [payrollStatus, setPayrollStatus] = useState("Active");
	const { hasMultiPaygroups, selectedPayGroupOption, setSelectedPayGroupOption, payGroups } =
		usePaygroup(company, false);

	const [isRefresh, setIsRefresh] = useState(false);
	const deptName = loggedInUser?.role === ROLES.MANAGER ? loggedInUser?.department : null;

	const { employees, filteredEmployees, setFilteredEmployees } = useEmployees(
		isRefresh,
		company,
		payrollStatus,
		null,
		deptName,
		selectedPayGroupOption,
	);
	const [showEmpFilter, setShowEmpFilter] = useState(false);
	const [showDeptFilter, setShowDeptFilter] = useState(false);
	const [showCCFilter, setShowCCFilter] = useState(false);

	const toggleEmpFilter = () => setShowEmpFilter((prev) => !prev);
	const toggleDeptFilter = () => setShowDeptFilter((prev) => !prev);
	const toggleCCFilter = () => setShowCCFilter((prev) => !prev);
	const handleFilter = () => console.log(filteredEmployees);
	const [filteredDept, setFilteredDept] = useState([]);
	const [filteredCC, setFilteredCC] = useState([]);
	const [empName, setEmpName] = useState("");
	// const [showOnboard, setShowOnboard] = useState(false);
	const [selectEmpList, setSelectEmpList] = useState(false);
	const [emailType, setEmailType] = useState(null);

	const navigate = useNavigate();

	const handleClick = (val) => {
		if (val === "terminate") {
			const empPath = `${payrollEmployeePath}/info/${loggedInUser._id}/3`;
			navigate(empPath);
		}
		if (val === "send-login") {
			setEmailType("creds");
			setSelectEmpList(true);
		}
		if (val === "send-paystub") {
			setEmailType("paystub");
			setSelectEmpList(true);
		}
	};
	const handleInputChange = (value) => {
		setEmpName(value);
		const selectedEmp = employees?.filter((emp) =>
			emp?.empId?.fullName?.toLowerCase().includes(value.toLowerCase()),
		);
		setFilteredEmployees(selectedEmp);
	};

	const handleChange = (value) => {
		if (value !== "") {
			setSelectedPayGroupOption(value);
		}
	};

	return (
		<PageLayout
			width={"35%"}
			title={"Employees"}
			selectPlaceholder="Select Paygroup"
			selectAttr="name"
			handleChange={handleChange}
			hasMultiPaygroups={hasMultiPaygroups}
			showPayGroup={true}
			selectedValue={selectedPayGroupOption}
			data={payGroups}
		>
			<SimpleGrid
				columns={{ base: 1, md: 1, lg: 2 }}
				spacing="4"
				mt="4"
				mr="4"
				templateColumns={{ lg: "70% 30%" }}
			>
				<Flex direction="column" gap={6}>
					{/* Search Section */}
					<InputGroup
						maxW="300px"
						borderRadius={"10px"}
						border={"1px solid var(--filter_border_color)"}
						fontSize="xs"
						fontWeight="bold"
						size="sm"
					>
						<Input
							_placeholder={{
								color: "var(--nav_color)",
								fontSize: "sm",
							}}
							name="empName"
							value={empName}
							onChange={(e) => handleInputChange(e.target.value)}
							color={"var(--nav_color)"}
							bg={"var(--primary_bg)"}
							type="text"
							placeholder="Search employee"
							pr="4.5rem"
						/>
						<InputRightElement children={<FaSearch />} />
					</InputGroup>
				</Flex>

				{/* Actions Section */}
				<PayrollActions
					handleClick={handleClick}
					actions={[
						{ key: "terminate", name: "Terminate" },
						{ key: "form", name: "Issue Forms" },
						{ key: "send-login", name: "Send Login" },
						{ key: "send-paystub", name: "Send Paystub" },
					]}
				/>
			</SimpleGrid>
			{/* Employee List Section */}
			<Box>
				{/* Action Bar */}
				<Flex mb={1} gap={6} align="center">
					<LeftIconButton
						name="Add Employee"
						size="sm"
						icon={<FaPlus color="#fff" fontSize="14px" />}
						handleClick={openOnboard}
						bg="#381c34"
						color="white"
						_hover={{
							bg: "#4e2847",
							transform: "scale(1.02)",
							transition: "all 0.2s ease-in-out",
						}}
						px={4}
					/>
					<HStack spacing={6} divider={<Box w="1px" h="20px" bg="gray.200" />}>
						{/* <HStack spacing={4}>
							<Checkbox
								colorScheme={"facebook"}
								isChecked={payrollState.isPayrollActive}
								onChange={(e) =>
									setPayrollState((prevData) => ({
										...prevData,
										isPayrollActive: e.target.checked,
									}))
								}
							>
								Active Employees
							</Checkbox>
							<Checkbox
								colorScheme={"facebook"}
								isChecked={payrollState.isPayrollInactive}
								onChange={(e) =>
									setPayrollState((prevData) => ({
										...prevData,
										isPayrollInactive: e.target.checked,
									}))
								}
							>
								Inactive Employees
							</Checkbox>
							<Checkbox
								colorScheme={"facebook"}
								isChecked={payrollState.isPayrollTerminated}
								onChange={(e) =>
									setPayrollState((prevData) => ({
										...prevData,
										isPayrollTerminated: e.target.checked,
									}))
								}
							>
								Terminated Employees
							</Checkbox>
						</HStack> */}
						<HStack spacing={4}>
							<RadioFormControl
								size="sm"
								handleChange={(value) => {
									setPayrollStatus(value);
								}}
								defaultVal="Active"
								options={[
									{ name: "Active Employees", value: "Active" },
									{ name: "Inactive Employees", value: "Inactive" },
									{ name: "Terminated Employees", value: "Terminated" },
									{ name: "All", value: "All" },
								]}
							/>
						</HStack>
					</HStack>
				</Flex>
				<EmployeeList employees={filteredEmployees} />
			</Box>
			{/* New Onboarding Modal */}
			{showOnboard && (
				<NewEmployeeOnboardingModal
					setIsRefresh={setIsRefresh}
					isOpen={showOnboard}
					onClose={closeOnboard}
				/>
			)}
			{selectEmpList && (
				<SendEmailList
					emailType={emailType}
					isOpen={selectEmpList}
					onClose={() => setSelectEmpList(false)}
					employees={filteredEmployees}
					selectedPayGroupOption={selectedPayGroupOption}
					company={company}
				/>
			)}
		</PageLayout>
	);
};

export default EmployeeListView;
