import { Checkbox, HStack, Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import PrimaryButton from "components/ui/button/PrimaryButton";
import useModule from "hooks/useModule";
import { useState } from "react";
import LocalStorageService from "services/LocalStorageService";
import UserService from "services/UserService";
const permissions = [
	"Section Access",
	// "User Data",
	// "Group Data",
	// "Region Data",
	// "All Data",
	// "View",
	// "Edit",
	// "Delete",
];

const MasterUserModules = ({ company, handleClose }) => {
	const modules = useModule(company);
	const userId = LocalStorageService.getItem("masterUserId");
	const [selectedPermissions, setSelectedPermissions] = useState({});

	const togglePermission = (module, permission) => {
		setSelectedPermissions((prev) => {
			const newPermissions = { ...prev };
			if (!newPermissions[module]) {
				newPermissions[module] = {};
			}
			newPermissions[module][permission] = !newPermissions[module][permission];
			return newPermissions;
		});
		// savePermission(module, permission);
	};

	const savePermission = async () => {
		await UserService.updateMasterUser(Object.keys(selectedPermissions), userId);
		handleClose();
	};

	return (
		<HStack w="50%" alignItems="end">
			{/* <TextTitle title="Select modules" /> */}
			{/* <TextTitle title="Section access" /> */}
			<Table variant="small">
				<Thead>
					<Tr>
						<Th>Module Name</Th>
						<Th>Action</Th>
						{/* {permissions.map((perm) => (
							<Th key={perm} textAlign="center">
								{perm}
							</Th>
						))} */}
					</Tr>
				</Thead>
				<Tbody>
					{modules?.map(({ name, _id }) => (
						<Tr key={_id}>
							<Td>{name}</Td>
							{permissions.map((perm) => (
								<Td key={perm}>
									<Checkbox
										isChecked={selectedPermissions[name]?.[perm] || false}
										onChange={() => togglePermission(name, perm)}
									/>
								</Td>
							))}
						</Tr>
					))}
				</Tbody>
			</Table>
			<PrimaryButton w="100px" size="xs" name="Save" onOpen={savePermission} />
		</HStack>
	);
};

export default MasterUserModules;
