import { Switch, Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import EmptyRowRecord from "components/ui/EmptyRowRecord";
import { useState } from "react";
import SettingService from "services/SettingService";

const ModulePanel = ({ modules }) => {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isRefresh, setIsRefresh] = useState(false);
	const [moduleName, setModuleName] = useState("");
	const [isModuleActive, setIsModuleActive] = useState(false);

	const handleToggle = async (menu) => {
		try {
			menu.isActive = !menu.isActive;
			await SettingService.updateModuleActiveStatus(menu, menu._id);
			setIsRefresh((prev) => !prev);
		} catch (error) {
			console.log("An error occurred. Please try again.", error);
		}
	};
	return (
		<>
			{/* <HStack>
				<Input
					placeholder="Enter Module Name"
					value={moduleName}
					onChange={(e) => setModuleName(e.target.value)}
				/>
			</HStack>
			<ActionButton
				mt={2}
				isLoading={isSubmitting}
				name={"Add Module"}
				onClick={handleModuleSubmit}
			/> */}
			<Table variant="simple">
				<Thead>
					<Tr>
						<Th>Name</Th>
						<Th>Active</Th>
					</Tr>
				</Thead>
				<Tbody>
					{(!modules || modules?.length === 0) && <EmptyRowRecord data={modules} colSpan={2} />}
					{modules?.map((module) => (
						<Tr key={module._id}>
							<Td>{module.name}</Td>
							<Td>
								<Switch
									onChange={(e) => {
										e.preventDefault();
										handleToggle(module);
									}}
									isChecked={module.isActive}
									colorScheme="facebook"
								/>
							</Td>
						</Tr>
					))}
				</Tbody>
			</Table>
		</>
	);
};

export default ModulePanel;
