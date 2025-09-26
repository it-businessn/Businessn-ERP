import { Flex, FormControl, FormLabel, HStack, Select, Spinner, Tooltip } from "@chakra-ui/react";
import TextTitle from "components/ui/text/TextTitle";
import AddNewShiftRole from "erp-modules/scheduling/workview/quick-selection/AddNewShiftRole";
import usePositionRoles from "hooks/usePositionRoles";
import { useState } from "react";
import { FaPlus } from "react-icons/fa";

export const RoleInfoControl = ({ title, company, handleChange }) => {
	const [newRoleAdded, setNewRoleAdded] = useState(false);
	const [showAddNewRole, setShowAddNewRole] = useState(false);
	const positionRoles = usePositionRoles(company, newRoleAdded);

	return (
		<HStack w="100%" justify={"space-between"}>
			<FormControl isRequired>
				<FormLabel size="sm">Role Title</FormLabel>
				{positionRoles ? (
					<Select size="sm" value={title} onChange={handleChange} placeholder="Select title">
						{positionRoles.map((role) => (
							<option key={role.name} value={role.name}>
								{role.name}
							</option>
						))}
					</Select>
				) : (
					<Flex align="center" justify="center" py={2}>
						<Spinner size="sm" mr={2} />
						<TextTitle size="sm" title="Loading job titles..." />
					</Flex>
				)}
			</FormControl>
			<Tooltip label="Add new role">
				<span style={{ marginTop: "1em" }}>
					<FaPlus cursor="pointer" onClick={() => setShowAddNewRole(true)} />
				</span>
			</Tooltip>
			{showAddNewRole && (
				<AddNewShiftRole
					showAddNewRole={showAddNewRole}
					setRefresh={setNewRoleAdded}
					setShowAddNewRole={setShowAddNewRole}
					company={company}
				/>
			)}
		</HStack>
	);
};
