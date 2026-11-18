import { Switch, Table, Tbody, Td, Th, Thead, Tr, useToast } from "@chakra-ui/react";
import EmptyRowRecord from "components/ui/EmptyRowRecord";
import SortableTh from "components/ui/table/SortableTh";
import useSortableData from "hooks/useSortableData";
import { useState } from "react";
import SettingService from "services/SettingService";

const ModulePanel = ({ modules }) => {
	const { sortedItems, sortConfig, requestSort } = useSortableData(modules);
	const toast = useToast();
	// BUG-SET-01: the switch changed the module object in place, so it did not move
	// until something else re-rendered, and stayed changed when the save failed.
	// The shown value is kept in state and undone on failure.
	const [activeById, setActiveById] = useState({});
	const isActive = (module) => activeById[module._id] ?? Boolean(module.isActive);
	const handleToggle = async (menu) => {
		const next = !isActive(menu);
		setActiveById((prev) => ({ ...prev, [menu._id]: next }));
		try {
			await SettingService.updateModule({ ...menu, isActive: next }, menu._id);
			menu.isActive = next;
		} catch (error) {
			setActiveById((prev) => ({ ...prev, [menu._id]: !next }));
			toast({
				title: "Could not update the module.",
				description: error?.response?.data?.message || "Please try again.",
				status: "error",
				duration: 5000,
				isClosable: true,
			});
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
						<SortableTh sortKey="name" sortConfig={sortConfig} onSort={requestSort}>
							Name
						</SortableTh>
						<Th>Active</Th>
					</Tr>
				</Thead>
				<Tbody>
					{(!modules || modules?.length === 0) && <EmptyRowRecord data={modules} colSpan={2} />}
					{sortedItems?.map((module) => (
						<Tr key={module._id}>
							<Td>{module.name}</Td>
							<Td>
								<Switch
									onChange={(e) => {
										e.preventDefault();
										handleToggle(module);
									}}
									isChecked={isActive(module)}
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
