import {
	HStack,
	Input,
	Table,
	Tbody,
	Td,
	Th,
	Thead,
	Tr,
} from "@chakra-ui/react";
import ActionButton from "components/ui/button/ActionButton";
import { useEffect, useState } from "react";
import SettingService from "services/SettingService";

const DepartmentsPanel = () => {
	const [departments, setDepartments] = useState(null);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isRefresh, setIsRefresh] = useState(false);
	const [deptName, setDeptName] = useState("");
	const [deptDescription, setDeptDescription] = useState("");

	useEffect(() => {
		const fetchAllDepartments = async () => {
			try {
				const response = await SettingService.getAllDepartments();
				setDepartments(response.data);
			} catch (error) {
				console.error(error);
			}
		};
		fetchAllDepartments();
	}, [isRefresh]);

	const handleDepartmentSubmit = async () => {
		setIsSubmitting(true);
		try {
			await SettingService.addDepartment({
				name: deptName,
				description: deptDescription,
			});
			setIsRefresh(true);
			setDeptName("");
			setDeptDescription("");
		} catch (error) {
			console.log("An error occurred. Please try again.");
		} finally {
			setIsSubmitting(false);
		}
	};
	return (
		<>
			<HStack>
				<Input
					placeholder="Enter Department Name"
					value={deptName}
					onChange={(e) => setDeptName(e.target.value)}
				/>
				<Input
					placeholder="Enter Department Description"
					value={deptDescription}
					onChange={(e) => setDeptDescription(e.target.value)}
				/>
			</HStack>
			<ActionButton
				mt={2}
				isLoading={isSubmitting}
				name={"Add Department"}
				onClick={handleDepartmentSubmit}
			/>
			{departments && (
				<Table variant="simple">
					<Thead>
						<Tr>
							<Th>Name</Th>
							<Th>Description</Th>
						</Tr>
					</Thead>
					<Tbody>
						{departments.map((role) => (
							<Tr key={role._id}>
								<Td>{role.name}</Td>
								<Td>{role.description}</Td>
							</Tr>
						))}
					</Tbody>
				</Table>
			)}
		</>
	);
};

export default DepartmentsPanel;
