import { Stack, Table, Tbody, Td, Th, Thead, Tr, useToast } from "@chakra-ui/react";
import ActionButton from "components/ui/button/ActionButton";
import EmptyRowRecord from "components/ui/EmptyRowRecord";
import InputFormControl from "components/ui/form/InputFormControl";
import TextTitle from "components/ui/text/TextTitle";
import { useState } from "react";
import SettingService from "services/SettingService";
import { ConfigTabLayout } from "./ConfigTabLayout";

const RoleForm = ({ companyName, setOptionDataRefresh, handleClose, roles }) => {
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
			if (handleClose) handleClose();
			if (setOptionDataRefresh) setOptionDataRefresh((prev) => !prev);
			setRoleName("");
			setRoleDescription("");
		} catch (error) {
			toast({
				title: "Error",
				description: error?.response?.data?.message,
				status: "error",
				duration: 3000,
				isClosable: true,
			});
			console.log("An error occurred. Please try again.", error);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<ConfigTabLayout
			tableData={roles}
			tableTitle="System Access Level Roles"
			tableContent={
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
			}
			leftContent={
				<>
					<TextTitle align={"center"} title="New Role" />
					<Stack spacing={4}>
						<InputFormControl
							label={"Name"}
							name="roleName"
							size={"sm"}
							valueText={roleName}
							handleChange={(e) => setRoleName(e.target.value)}
							required
							placeholder="Enter Role Name"
						/>
						<InputFormControl
							size={"sm"}
							label={"Description"}
							name="roleDescription"
							valueText={roleDescription}
							handleChange={(e) => setRoleDescription(e.target.value)}
							required
							placeholder="Enter Role Description"
						/>
						<ActionButton
							size={"sm"}
							isDisabled={roleName === "" || roleDescription === ""}
							isLoading={isSubmitting}
							name="Add Role"
							onClick={handleRoleSubmit}
						/>
					</Stack>
				</>
			}
		/>
	);
};

export default RoleForm;
