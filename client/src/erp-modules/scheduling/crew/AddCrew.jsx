import { Card, CardBody, Input, Stack, Text, useToast } from "@chakra-ui/react";
import PrimaryButton from "components/ui/button/PrimaryButton";
import SelectFormControl from "components/ui/form/SelectFormControl";
import ModalForm from "components/ui/modal/ModalForm";
import { useEffect, useState } from "react";
import SettingService from "services/SettingService";
import CrewMultiSelectDropdown from "./CrewMultiSelectDropdown";

const AddCrew = ({ company, isOpen, onClose, costCenters, departments, setRefresh, employees }) => {
	const toast = useToast();
	const [publisher, setPublisher] = useState("");
	const [crewName, setCrewName] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [selectedCostCenters, setSelectedCostCenters] = useState([]);
	const [filteredDepartments, setFilteredDepartments] = useState(null);
	const [filteredEmployees, setFilteredEmployees] = useState([]);
	const [selectedDepartments, setSelectedDepartments] = useState([]);
	const [selectedEmployees, setSelectedEmployees] = useState([]);
	const [openMenu, setOpenMenu] = useState(null);

	useEffect(() => {
		if (selectedCostCenters?.length) {
			setFilteredDepartments(selectedCostCenters?.map((cc) => cc.departments));
		}
	}, [selectedCostCenters?.length]);

	useEffect(() => {
		if (selectedDepartments?.length) {
			const selectedEmps = employees?.filter((emp) =>
				selectedDepartments.some((dept) =>
					emp?.positions?.find((pos) => pos.employmentDepartment === dept.name),
				),
			);
			setFilteredEmployees(selectedEmps);
		}
	}, [selectedDepartments?.length, employees]);

	const handleMenuToggle = (menu) => {
		setOpenMenu(openMenu === menu ? null : menu);
	};

	const handleCloseMenu = (menu) => {
		if (openMenu === menu) setOpenMenu(null);
	};

	const handleCreateCrew = async () => {
		setIsSubmitting(true);
		const result = {
			createdBy: publisher,
			crewName,
			include: {
				costCenter: selectedCostCenters,
				department: selectedDepartments,
				employee: selectedEmployees,
			},
			companyName: company,
			// exclude: {
			// 	costCenter: excludeCostCenter,
			// 	department: excludeDepartment,
			// 	employee: excludeEmployee,
			// },
		};
		try {
			await SettingService.addCrew(result);
			toast({
				title: "Crew added successfully",
				status: "success",
				duration: 1500,
				isClosable: true,
				position: "top-right",
			});
			setRefresh((prev) => !prev);
			setCrewName("");
			onClose();
		} catch (error) {
			console.log("An error occurred. Please try again.", error);
		} finally {
			setIsSubmitting(false);
		}
	};
	return (
		<ModalForm title="Setup New Crew" isOpen={isOpen} onClose={onClose}>
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
							handleChange={(e) => {
								if (e.target.value) setPublisher(e.target.value);
							}}
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
					name="Create Crew"
					onOpen={() => handleCreateCrew()}
					isLoading={isSubmitting}
				/>
			</Stack>
			{/* </Box> */}
		</ModalForm>
	);
};
export default AddCrew;
