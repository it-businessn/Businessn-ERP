import { Box, Stack, Table, Tbody, Td, Th, Thead, Tr, useToast } from "@chakra-ui/react";
import EmptyRowRecord from "components/ui/EmptyRowRecord";
import ActionButtonGroup from "components/ui/form/ActionButtonGroup";
import InputFormControl from "components/ui/form/InputFormControl";
import TextTitle from "components/ui/text/TextTitle";
import { useState } from "react";
import SettingService from "services/SettingService";

const ModuleForm = ({ companyName, setOptionDataRefresh, handleClose, showList, modules }) => {
	const toast = useToast();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [moduleName, setModuleName] = useState("");
	const [moduleDesc, setModuleDesc] = useState("");

	const handleModuleSubmit = async () => {
		setIsSubmitting(true);
		try {
			await SettingService.addBaseModule({
				name: moduleName,
				description: moduleDesc,
				companyName,
			});
			toast({
				title: "Module added successfully",
				status: "success",
				duration: 1500,
				isClosable: true,
			});
			if (setOptionDataRefresh) setOptionDataRefresh((prev) => !prev);
			setModuleName("");
			setModuleDesc("");
			if (handleClose) handleClose();
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
					name="moduleName"
					valueText={moduleName}
					handleChange={(e) => setModuleName(e.target.value)}
					required
					placeholder="Enter Module Name"
				/>
				<InputFormControl
					label={"Description"}
					name="moduleDesc"
					valueText={moduleDesc}
					handleChange={(e) => setModuleDesc(e.target.value)}
					required
					placeholder="Enter Module Description"
				/>
				<ActionButtonGroup
					submitBtnName={"Add Module"}
					isDisabled={moduleName === "" || moduleDesc === ""}
					isLoading={isSubmitting}
					onClose={handleClose}
					onOpen={handleModuleSubmit}
				/>
			</Stack>
			{showList && modules && (
				<Box>
					<TextTitle mt={3} title="All modules" />
					<Table variant="simple" size="sm">
						<Thead>
							<Tr>
								<Th>Name</Th>
							</Tr>
						</Thead>
						<Tbody>
							{(!modules || modules?.length === 0) && <EmptyRowRecord data={modules} colSpan={2} />}
							{modules?.map(({ _id, name }) => (
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

export default ModuleForm;
