import { Checkbox, VStack } from "@chakra-ui/react";
import EmpSearchMenu from "features/setup/company/group-tab/EmpSearchMenu";
import { useState } from "react";

const EmpProfileSearch = ({
	filteredEmployees,
	setFilteredEmployees,
	setUserId,
	setEmployee,
	employees,
}) => {
	const [empName, setEmpName] = useState("");
	const handleInputChange = (value) => {
		setEmpName(value);
		setFilteredEmployees(
			employees.filter((emp) => emp?.fullName?.toLowerCase().includes(value.toLowerCase())),
		);
	};

	const handleSelect = (emp) => {
		setEmpName(emp.fullName);
		setEmployee(emp);
		setUserId(emp._id);
	};

	return (
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
	);
};

export default EmpProfileSearch;
