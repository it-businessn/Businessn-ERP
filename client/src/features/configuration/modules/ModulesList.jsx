import { Switch, Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import SettingService from "services/SettingService";

export const ModulesList = ({ modules, handleEdit, handleDelete, setModuleList }) => {
	const handleToggle = async (module) => {
		try {
			module.isActive = !module.isActive;
			await SettingService.updateModule({ isActive: module?.isActive }, module._id);
			setModuleList((prev) =>
				prev.map((rec) =>
					rec._id === module._id
						? {
								...rec,
								isActive: module?.isActive,
						  }
						: rec,
				),
			);
		} catch (error) {
			console.log("An error occurred. Please try again.", error);
		}
	};
	return (
		<>
			<Table variant="simple" w={"30%"}>
				<Thead>
					<Tr>
						<Th>Name</Th>
						<Th>Active</Th>
					</Tr>
				</Thead>
				<Tbody>
					{modules?.map((module) => (
						<Tr key={module._id}>
							<Td>{module.name}</Td>
							<Td>
								<Switch
									onChange={() => handleToggle(module)}
									isChecked={module.isActive}
									colorScheme="facebook"
								/>
							</Td>
						</Tr>
					))}
				</Tbody>
			</Table>
			{/* <Table variant="simple" size="sm">
				<Thead>
					<Tr>
						<Th>Name</Th>
						<Th>Action</Th>
					</Tr>
				</Thead>
				<Tbody>
					{(!modules || modules?.length === 0) && <EmptyRowRecord data={modules} colSpan={2} />}
					{modules?.map((module) => (
						<Tr key={module?._id}>
							<Td>{module?.name}</Td>
							<Td>
								<HStack spacing={2}>
									<IconButton
										aria-label="Edit "
										icon={<EditIcon />}
										size="sm"
										onClick={() => handleEdit(module)}
										color="var(--banner_bg)"
										_hover={{
											bg: "var(--banner_bg)",
											color: "white",
										}}
									/>
									<IconButton
										aria-label="Delete "
										icon={<DeleteIcon />}
										size="sm"
										color="var(--banner_bg)"
										_hover={{
											bg: "var(--banner_bg)",
											color: "white",
										}}
										onClick={() => handleDelete(module?._id)}
									/>
								</HStack>
							</Td>
						</Tr>
					))}
				</Tbody>
			</Table> */}
		</>
	);
};
