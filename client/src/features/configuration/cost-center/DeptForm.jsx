import { Box, Stack, Table, Tbody, Td, Th, Thead, Tr, useToast } from "@chakra-ui/react";
import EmptyRowRecord from "components/ui/EmptyRowRecord";
import ActionButtonGroup from "components/ui/form/ActionButtonGroup";
import InputFormControl from "components/ui/form/InputFormControl";
import TextTitle from "components/ui/text/TextTitle";
import { useState } from "react";
import SettingService from "services/SettingService";

const DeptForm = ({ companyName, setOptionDataRefresh, handleClose, showList, dept }) => {
	const toast = useToast();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [deptName, setDeptName] = useState("");
	const [deptDescription, setDeptDescription] = useState("");

	const handleDepartmentSubmit = async () => {
		setIsSubmitting(true);
		try {
			await SettingService.addDepartment({
				name: deptName,
				description: deptDescription,
				companyName,
			});
			toast({
				title: "Department added successfully",
				status: "success",
				duration: 1500,
				isClosable: true,
			});
			if (setOptionDataRefresh) setOptionDataRefresh((prev) => !prev);
			setDeptName("");
			setDeptDescription("");
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
					name="deptName"
					valueText={deptName}
					handleChange={(e) => setDeptName(e.target.value)}
					required
					placeholder="Enter Department Name"
				/>
				<InputFormControl
					label={"Description"}
					name="deptDescription"
					valueText={deptDescription}
					handleChange={(e) => setDeptDescription(e.target.value)}
					required
					placeholder="Enter Department Description"
				/>
				<ActionButtonGroup
					submitBtnName={"Add Department"}
					isDisabled={deptName === "" || deptDescription === ""}
					isLoading={isSubmitting}
					onClose={handleClose}
					onOpen={handleDepartmentSubmit}
				/>
			</Stack>
			{showList && dept && (
				<Box>
					<TextTitle mt={3} title="All departments" />
					<Table variant="simple" size="sm">
						<Thead>
							<Tr>
								<Th>Name</Th>
							</Tr>
						</Thead>
						<Tbody>
							{(!dept || dept?.length === 0) && <EmptyRowRecord data={dept} colSpan={2} />}
							{dept?.map(({ _id, name, isActive }) => (
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

export default DeptForm;
