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

const EmploymentPanel = () => {
	const [empTypes, setEmpTypes] = useState(null);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isRefresh, setIsRefresh] = useState(false);
	const [empType, setEmpType] = useState("");
	const [empTypeDesc, setEmpTypeDesc] = useState("");

	useEffect(() => {
		const fetchAllEmpTypes = async () => {
			try {
				const response = await SettingService.getAllEmploymentTypes();
				setEmpTypes(response.data);
			} catch (error) {
				console.error(error);
			}
		};
		fetchAllEmpTypes();
	}, [isRefresh]);

	const handleSubmit = async () => {
		setIsSubmitting(true);
		try {
			await SettingService.addEmploymentType({
				name: empType,
				description: empTypeDesc,
			});
			setIsRefresh(true);
			setEmpType("");
			setEmpTypeDesc("");
		} catch (error) {
			console.log("An error occurred while submitting the application.");
		} finally {
			setIsSubmitting(false);
		}
	};
	return (
		<>
			<HStack>
				<Input
					placeholder="Enter Employment Type Name"
					value={empType}
					onChange={(e) => setEmpType(e.target.value)}
				/>
				<Input
					placeholder="Enter Employment Type Description"
					value={empTypeDesc}
					onChange={(e) => setEmpTypeDesc(e.target.value)}
				/>
			</HStack>
			<ActionButton
				mt={2}
				isLoading={isSubmitting}
				name={"Add Employment Type"}
				onClick={handleSubmit}
			/>
			{empTypes && (
				<Table variant="simple">
					<Thead>
						<Tr>
							<Th>Name</Th>
							<Th>Description</Th>
						</Tr>
					</Thead>
					<Tbody>
						{empTypes.map((empType) => (
							<Tr key={empType._id}>
								<Td>{empType.name}</Td>
								<Td>{empType.description}</Td>
							</Tr>
						))}
					</Tbody>
				</Table>
			)}
		</>
	);
};

export default EmploymentPanel;
