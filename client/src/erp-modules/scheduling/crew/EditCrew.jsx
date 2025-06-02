import { Card, CardBody, Input, Stack, Text, useToast } from "@chakra-ui/react";
import PrimaryButton from "components/ui/button/PrimaryButton";
import SelectFormControl from "components/ui/form/SelectFormControl";
import ModalForm from "components/ui/modal/ModalForm";
import { COMPANIES } from "constant";
import { useEffect, useState } from "react";
import SettingService from "services/SettingService";
import CrewMultiSelectDropdown from "./CrewMultiSelectDropdown";

const EditCrew = ({
	crew,
	company,
	isOpen,
	costCenters,
	employees,
	departments,
	onClose,
	setRefresh,
}) => {
	const toast = useToast();
	const [publisher, setPublisher] = useState(crew?.createdBy);
	const [crewName, setCrewName] = useState(crew?.name);
	const [selectedCostCenters, setSelectedCostCenters] = useState([]);
	const [selectedDepartments, setSelectedDepartments] = useState([]);
	const [selectedEmployees, setSelectedEmployees] = useState([]);
	const [filteredDepartments, setFilteredDepartments] = useState(null);
	const [filteredEmployees, setFilteredEmployees] = useState([]);
	const [openMenu, setOpenMenu] = useState(null);

	useEffect(() => {
		if (crew) {
			setSelectedCostCenters(crew?.config?.costCenter);
			setSelectedDepartments(crew?.config?.department);
			setSelectedEmployees(crew?.config?.employee);
		}
	}, [crew]);

	useEffect(() => {
		if (departments && selectedCostCenters?.length) {
			if (company === COMPANIES.NW) {
				const selectedDepts = departments?.filter((dept) =>
					selectedCostCenters.some((center) =>
						dept.name.toLowerCase().includes(center.name.toLowerCase().slice(0, 4)),
					),
				);
				setFilteredDepartments(selectedDepts);
			} else {
				setFilteredDepartments(departments);
			}
		}
	}, [selectedCostCenters?.length, departments]);

	useEffect(() => {
		if (selectedDepartments?.length) {
			const selectedEmps = employees?.filter((emp) =>
				selectedDepartments.some((dept) =>
					emp?.positions?.find((pos) => pos.employmentDepartment === dept.name),
				),
			);
			setFilteredEmployees(selectedEmps);
			if (!selectedEmps?.length) setSelectedEmployees(selectedEmps);
		}
	}, [selectedDepartments?.length, employees]);

	const handleMenuToggle = (menu) => {
		setOpenMenu(openMenu === menu ? null : menu);
	};

	const handleCloseMenu = (menu) => {
		if (openMenu === menu) setOpenMenu(null);
	};

	const handleUpdateCrew = async () => {
		const result = {
			createdBy: publisher,
			crewName,
			include: {
				costCenter: selectedCostCenters,
				department: selectedDepartments,
				employee: selectedEmployees,
			},
			companyName: crew.companyName,
			// exclude: {
			// 	costCenter: excludeCostCenter,
			// 	department: excludeDepartment,
			// 	employee: excludeEmployee,
			// },
		};
		try {
			await SettingService.updateCrew(result, crew._id);
			toast({
				title: "Crew updated successfully",
				status: "success",
				duration: 1500,
				isClosable: true,
			});
			onClose();
			setRefresh((prev) => !prev);
		} catch (error) {
			console.log("An error occurred. Please try again.", error);
		}
	};
	return (
		<ModalForm title="Edit Crew" isOpen={isOpen} onClose={onClose}>
			{/* <Box maxW="600px" mx="auto" p={5}> */}
			<Stack spacing={3}>
				<Card>
					<CardBody>
						<Text fontWeight="bold" mb={2}>
							👤 Who is the administrator for this crew?
						</Text>
						<SelectFormControl
							required
							valueParam="fullName"
							name="fullName"
							label=""
							valueText={publisher || ""}
							handleChange={(e) => setPublisher(e.target.value)}
							options={employees}
							placeholder="Select user"
						/>

						<Text fontWeight="bold" mt={4} mb={2}>
							🛠️ What do you want to call this crew?
						</Text>
						<Input
							placeholder="Crew name"
							value={crewName}
							onChange={(e) => setCrewName(e.target.value)}
						/>
					</CardBody>
				</Card>
				{crewName && (
					<Card>
						<CardBody>
							<Text fontWeight="bold" mb={4}>
								📥 What do you want to include in this crew?
							</Text>

							{/* Cost Center Selector */}
							<CrewMultiSelectDropdown
								label={"Select cost centers"}
								tag={"cost centers(s) selected"}
								showMultiSelect={openMenu === "costCenter"}
								data={costCenters}
								handleCloseMenu={() => handleCloseMenu("costCenter")}
								selectedOptions={selectedCostCenters}
								setSelectedOptions={setSelectedCostCenters}
								handleMenuToggle={() => handleMenuToggle("costCenter")}
							/>

							{/* Department Selector */}
							{selectedCostCenters.length > 0 && (
								<CrewMultiSelectDropdown
									label={"Select departments"}
									tag={"department(s) selected"}
									showMultiSelect={openMenu === "department"}
									data={filteredDepartments}
									handleCloseMenu={() => handleCloseMenu("department")}
									selectedOptions={selectedDepartments}
									setSelectedOptions={setSelectedDepartments}
									handleMenuToggle={() => handleMenuToggle("department")}
								/>
							)}

							{/* Employee Selector */}
							{selectedDepartments.length > 0 && (
								<CrewMultiSelectDropdown
									label={"Select employees"}
									tag={"employee(s) selected"}
									showMultiSelect={openMenu === "employee"}
									data={filteredEmployees}
									param="fullName"
									handleCloseMenu={() => handleCloseMenu("employee")}
									selectedOptions={selectedEmployees}
									setSelectedOptions={setSelectedEmployees}
									handleMenuToggle={() => handleMenuToggle("employee")}
									isEmp
								/>
							)}
						</CardBody>
					</Card>
				)}

				<PrimaryButton
					size="sm"
					isDisabled={!crewName}
					name="Submit"
					onOpen={() => handleUpdateCrew()}
				/>
			</Stack>
			{/* </Box> */}
		</ModalForm>
	);
};
export default EditCrew;
