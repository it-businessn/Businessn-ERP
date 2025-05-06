import { Box, Stack, Table, Tbody, Td, Th, Thead, Tr, useToast } from "@chakra-ui/react";
import EmptyRowRecord from "components/ui/EmptyRowRecord";
import ActionButtonGroup from "components/ui/form/ActionButtonGroup";
import InputFormControl from "components/ui/form/InputFormControl";
import TextTitle from "components/ui/text/TextTitle";
import { useState } from "react";
import SettingService from "services/SettingService";

const RoleForm = ({ companyName, setOptionDataRefresh, handleClose, showList, roles }) => {
	const toast = useToast();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [roleName, setRoleName] = useState("");
	const [roleDescription, setRoleDescription] = useState("");

	const handleRoleSubmit = async () => {
		setIsSubmitting(true);
		try {
			await SettingService.addRole({
				name: roleName,
				description: roleDescription,
				companyName,
			});
			toast({
				title: "Role added successfully",
				status: "success",
				duration: 1500,
				isClosable: true,
			});
			if (setOptionDataRefresh) setOptionDataRefresh((prev) => !prev);
			setRoleName("");
			setRoleDescription("");
			handleClose();
		} catch (error) {
			console.log("An error occurred. Please try again.", error);
		} finally {
			setIsSubmitting(false);
		}
	};
	return (
		<>
			<Stack spacing={4}>
				<InputFormControl
					label={"Name"}
					name="roleName"
					valueText={roleName}
					handleChange={(e) => setRoleName(e.target.value)}
					required
					placeholder="Enter Role Name"
				/>
				<InputFormControl
					label={"Description"}
					name="roleDescription"
					valueText={roleDescription}
					handleChange={(e) => setRoleDescription(e.target.value)}
					required
					placeholder="Enter Role Description"
				/>
				<ActionButtonGroup
					submitBtnName={"Add Role"}
					isDisabled={roleName === "" || roleDescription === ""}
					isLoading={isSubmitting}
					onClose={handleClose}
					onOpen={handleRoleSubmit}
				/>
			</Stack>
			{showList && roles && (
				<Box>
					<TextTitle mt={3} title="All roles" />
					<Table variant="simple" size="sm">
						<Thead>
							<Tr>
								<Th>Name</Th>
							</Tr>
						</Thead>
						<Tbody>
							{(!roles || roles?.length === 0) && <EmptyRowRecord data={roles} colSpan={2} />}
							{roles?.map(({ _id, name, isActive }) => (
								<Tr key={_id}>
									<Td>{name}</Td>
								</Tr>
							))}
						</Tbody>
					</Table>
				</Box>
			)}
		</>
	);
};

export default RoleForm;
