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

const RolesPanel = () => {
	const [roles, setRoles] = useState(null);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [roleName, setRoleName] = useState("");
	const [roleDescription, setRoleDescription] = useState("");

	useEffect(() => {
		const fetchAllRoles = async () => {
			try {
				const response = await SettingService.getAllRoles();
				setRoles(response.data);
			} catch (error) {
				console.error(error);
			}
		};
		fetchAllRoles();
	}, [isSubmitting]);

	const handleRoleSubmit = async () => {
		setIsSubmitting(true);
		try {
			await SettingService.addRole({
				name: roleName,
				description: roleDescription,
			});
			setRoleName("");
			setRoleDescription("");
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
					placeholder="Enter Role Name"
					value={roleName}
					onChange={(e) => setRoleName(e.target.value)}
				/>
				<Input
					placeholder="Enter Role Description"
					value={roleDescription}
					onChange={(e) => setRoleDescription(e.target.value)}
				/>
			</HStack>
			<ActionButton mt={2} name={"Add Role"} onClick={handleRoleSubmit} />
			{roles && (
				<Table variant="simple">
					<Thead>
						<Tr>
							<Th>Name</Th>
							<Th>Description</Th>
							{/* <Th>Action</Th> */}
						</Tr>
					</Thead>
					<Tbody>
						{roles.map((role) => (
							<Tr key={role._id}>
								<Td>{role.name}</Td>
								<Td>{role.description}</Td>
								{/* <Td>
									<HStack>
										<Button
											size="sm"
											colorScheme="green"
											onClick={() => editRole(role._id)}
										>
											Edit
										</Button>
									</HStack>
								</Td> */}
							</Tr>
						))}
					</Tbody>
				</Table>
			)}
		</>
	);
};

export default RolesPanel;
