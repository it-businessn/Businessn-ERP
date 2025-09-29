import { Table, Tbody, Td, Th, Thead, Tr, useToast } from "@chakra-ui/react";
import ActionButton from "components/ui/button/ActionButton";
import EmptyRowRecord from "components/ui/EmptyRowRecord";
import InputFormControl from "components/ui/form/InputFormControl";
import TextTitle from "components/ui/text/TextTitle";
import { useState } from "react";
import SettingService from "services/SettingService";
import { ConfigTabLayout } from "./ConfigTabLayout";

const ModuleForm = ({ companyName, setOptionDataRefresh, handleClose, modules }) => {
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
			if (handleClose) handleClose();
			setModuleName("");
			setModuleDesc("");
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
			tableData={modules}
			tableTitle="All Modules"
			tableContent={
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
			}
			leftContent={
				<>
					<TextTitle align={"center"} title="New Module" />
					<InputFormControl
						size={"sm"}
						label={"Name"}
						name="moduleName"
						valueText={moduleName}
						handleChange={(e) => setModuleName(e.target.value)}
						required
						placeholder="Enter Module Name"
					/>
					<InputFormControl
						size={"sm"}
						label={"Description"}
						name="moduleDesc"
						valueText={moduleDesc}
						handleChange={(e) => setModuleDesc(e.target.value)}
						required
						placeholder="Enter Module Description"
					/>
					<ActionButton
						size={"sm"}
						isDisabled={moduleName === "" || moduleDesc === ""}
						isLoading={isSubmitting}
						name="Add Module"
						onClick={handleModuleSubmit}
					/>
				</>
			}
		/>
	);
};

export default ModuleForm;
