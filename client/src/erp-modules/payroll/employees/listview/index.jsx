import { Checkbox, HStack, SimpleGrid, VStack } from "@chakra-ui/react";
import PrimaryButton from "components/ui/button/PrimaryButton";
import OnboardEmpModal from "erp-modules/payroll/workview/paygroup-header-table/OnboardEmpModal";
import PayrollActions from "erp-modules/payroll/workview/paygroup-header-table/PayrollActions";
import useCompany from "hooks/useCompany";
import useEmployees from "hooks/useEmployees";
import usePaygroup from "hooks/usePaygroup";
import PageLayout from "layouts/PageLayout";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { payrollEmployeePath } from "routes";
import LocalStorageService from "services/LocalStorageService";
import EmpProfileSearch from "../EmpProfileSearch";
import EmployeeList from "./EmployeeList";

const EmployeeListView = () => {
	const { company } = useCompany(LocalStorageService.getItem("selectedCompany"));

	const [formData, setFormData] = useState({
		isPayrollActive: true,
		isPayrollInactive: false,
	});

	const [isRefresh, setIsRefresh] = useState(false);

	const { employees, filteredEmployees, setFilteredEmployees } = useEmployees(
		isRefresh,
		company,
		false,
		formData,
		// userId,
	);
	const [showEmpFilter, setShowEmpFilter] = useState(false);
	const [showDeptFilter, setShowDeptFilter] = useState(false);
	const [showCCFilter, setShowCCFilter] = useState(false);

	const toggleEmpFilter = () => setShowEmpFilter((prev) => !prev);
	const toggleDeptFilter = () => setShowDeptFilter((prev) => !prev);
	const toggleCCFilter = () => setShowCCFilter((prev) => !prev);
	const handleFilter = () => console.log(filteredEmployees);
	// const { departments, roles } = useSignup(false, company);
	const [filteredDept, setFilteredDept] = useState([]);
	const [filteredCC, setFilteredCC] = useState([]);

	const [showOnboard, setShowOnboard] = useState(false);

	const navigate = useNavigate();

	useEffect(() => {
		setIsRefresh(showOnboard);
	}, [showOnboard]);

	const loggedInUser = LocalStorageService.getItem("user");

	const { selectedPayGroup } = usePaygroup(company, false);

	const handleClick = (val) => {
		if (val === "terminate") {
			const empPath = `${payrollEmployeePath}/info/${loggedInUser._id}/3`;
			navigate(empPath);
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
							hideMenu
							filteredEmployees={filteredEmployees}
							setFilteredEmployees={setFilteredEmployees}
							// setUserId={setUserId}
							// setEmployee={setEmployee}
							employees={employees}
						/>
						<PrimaryButton
							name={"Add Employee"}
							size="xs"
							px={0}
							onOpen={() => setShowOnboard(true)}
						/>
					</HStack>
					<HStack w={"100%"} pt={"5em"} spacing={"3em"} justifyContent={"start"}>
						<HStack spacing={2}>
							<Checkbox
								colorScheme={"facebook"}
								isChecked={formData.isPayrollActive}
								onChange={(e) =>
									setFormData((prevData) => ({
										...prevData,
										isPayrollActive: e.target.checked,
									}))
								}
							>
								Active
							</Checkbox>
							<Checkbox
								colorScheme={"facebook"}
								isChecked={formData.isPayrollInactive}
								onChange={(e) =>
									setFormData((prevData) => ({
										...prevData,
										isPayrollInactive: e.target.checked,
									}))
								}
							>
								Inactive
							</Checkbox>
						</HStack>
						{/* <HStack>
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
						</HStack> */}
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
			<EmployeeList employees={employees} />
			{showOnboard && (
				<OnboardEmpModal
					title="Onboard employee"
					showOnboard={showOnboard}
					setShowOnboard={setShowOnboard}
					selectedPayGroupName={selectedPayGroup?.name}
				/>
			)}
		</PageLayout>
	);
};

export default EmployeeListView;
