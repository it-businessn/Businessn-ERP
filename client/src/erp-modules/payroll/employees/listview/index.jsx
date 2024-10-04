import { Checkbox, HStack, SimpleGrid, VStack } from "@chakra-ui/react";
import PrimaryButton from "components/ui/button/PrimaryButton";
import OtherFilter from "erp-modules/payroll/timesheets/OtherFilter";
import OnboardEmpModal from "erp-modules/payroll/workview/paygroup-header-table/OnboardEmpModal";
import PayrollActions from "erp-modules/payroll/workview/paygroup-header-table/PayrollActions";
import useCompany from "hooks/useCompany";
import useEmployees from "hooks/useEmployees";
import usePaygroup from "hooks/usePaygroup";
import { useSignup } from "hooks/useSignup";
import PageLayout from "layouts/PageLayout";
import { useState } from "react";
import { useParams } from "react-router-dom";
import LocalStorageService from "services/LocalStorageService";
import EmpProfileSearch from "../EmpProfileSearch";
import EmployeeList from "./EmployeeList";

const EmployeeListView = () => {
	const { id } = useParams();
	const { company } = useCompany(
		LocalStorageService.getItem("selectedCompany"),
	);
	const loggedInUser = LocalStorageService.getItem("user");
	const [employee, setEmployee] = useState(loggedInUser);
	const [userId, setUserId] = useState(id ?? loggedInUser._id);
	const [isRefresh, setIsRefresh] = useState(false);
	const { employees, filteredEmployees, setFilteredEmployees } = useEmployees(
		isRefresh,
		company,
	);
	const [showEmpFilter, setShowEmpFilter] = useState(false);
	const [showDeptFilter, setShowDeptFilter] = useState(false);
	const [showCCFilter, setShowCCFilter] = useState(false);

	const toggleEmpFilter = () => setShowEmpFilter((prev) => !prev);
	const toggleDeptFilter = () => setShowDeptFilter((prev) => !prev);
	const toggleCCFilter = () => setShowCCFilter((prev) => !prev);
	const handleFilter = () => console.log(filteredEmployees);
	const { departments, roles } = useSignup(false, company);
	const [filteredDept, setFilteredDept] = useState([]);
	const [filteredCC, setFilteredCC] = useState([]);

	const [showOnboard, setShowOnboard] = useState(false);
	const [showTerminate, setShowTerminate] = useState(false);

	const { selectedPayGroup } = usePaygroup(company, false);
	const handleClick = (val) => {
		if (val === "terminate") {
			setShowTerminate(true);
		}
	};
	return (
		<PageLayout
			width={"35%"}
			title={"Employees"}
			selectPlaceholder="Select Paygroup"
			selectAttr="name"
		>
			<SimpleGrid
				columns={{ base: 1, md: 1, lg: 2 }}
				spacing="4"
				my="4"
				mr="4"
				templateColumns={{ lg: "70% 30%" }}
			>
				<VStack>
					<HStack w={"100%"} spacing={2} justifyContent={"space-between"}>
						<EmpProfileSearch
							filteredEmployees={filteredEmployees}
							setFilteredEmployees={setFilteredEmployees}
							setUserId={setUserId}
							setEmployee={setEmployee}
							employees={employees}
						/>
						<PrimaryButton
							name={"Add Employee"}
							size="xs"
							px={0}
							onOpen={() => setShowOnboard(true)}
						/>
					</HStack>
					<HStack w={"100%"}>
						<OtherFilter
							showOtherFilter={showEmpFilter}
							toggleOtherFilter={toggleEmpFilter}
							handleFilter={handleFilter}
							data={employees}
							filteredData={filteredEmployees}
							setFilteredData={setFilteredEmployees}
							helperText="employee"
						/>
						<OtherFilter
							showOtherFilter={showDeptFilter}
							toggleOtherFilter={toggleDeptFilter}
							handleFilter={handleFilter}
							data={departments}
							filteredData={filteredDept}
							setFilteredData={setFilteredDept}
							helperText="department"
						/>
						<OtherFilter
							showOtherFilter={showCCFilter}
							toggleOtherFilter={toggleCCFilter}
							handleFilter={handleFilter}
							data={roles}
							filteredData={filteredCC}
							setFilteredData={setFilteredCC}
							helperText="cost center"
						/>
					</HStack>
					<HStack w={"100%"}>
						<Checkbox
							colorScheme={"facebook"}
							// isChecked={hasChecklist}
							// onChange={() => setHasChecklist(!hasChecklist)}
						>
							Active
						</Checkbox>
						<Checkbox
							colorScheme={"facebook"}
							// isChecked={hasChecklist}
							// onChange={() => setHasChecklist(!hasChecklist)}
						>
							Terminated
						</Checkbox>
					</HStack>
				</VStack>

				<PayrollActions
					handleClick={handleClick}
					actions={[
						{ key: "terminate", name: "Terminate" },
						{ key: "form", name: "Issue Forms" },
						{ key: "extra", name: "Send Login" },
					]}
				/>
			</SimpleGrid>
			<EmployeeList />
			{showOnboard && (
				<OnboardEmpModal
					title={"Onboard employee"}
					showOnboard={showOnboard}
					setShowOnboard={setShowOnboard}
					selectedPayGroupName={selectedPayGroup?.name}
				/>
			)}
			{showTerminate && (
				<OnboardEmpModal
					title={"Terminate employee"}
					showOnboard={showTerminate}
					setShowOnboard={setShowTerminate}
					selectedPayGroupName={selectedPayGroup?.name}
				/>
			)}
		</PageLayout>
	);
};

export default EmployeeListView;
