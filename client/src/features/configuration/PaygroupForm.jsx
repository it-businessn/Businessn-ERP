import {
	Box,
	Checkbox,
	FormControl,
	FormLabel,
	HStack,
	Stack,
	Table,
	Tbody,
	Td,
	Th,
	Thead,
	Tr,
	useToast,
} from "@chakra-ui/react";
import EmptyRowRecord from "components/ui/EmptyRowRecord";
import ActionButtonGroup from "components/ui/form/ActionButtonGroup";
import InputFormControl from "components/ui/form/InputFormControl";
import MultiSelectButton from "components/ui/form/MultiSelectButton";
import SelectFormControl from "components/ui/form/SelectFormControl";
import TextTitle from "components/ui/text/TextTitle";
import { PAY_FREQUENCIES } from "constant";
import { useState } from "react";
import SettingService from "services/SettingService";

const PaygroupForm = ({
	company,
	onClose,
	setRefresh,
	setMessage,
	showList,
	modules,
	managers,
	paygroup,
}) => {
	const toast = useToast();
	const defaultGroup = {
		name: "",
		baseModule: [],
		admin: [],
		company,
		payrollActivated: false,
		payFrequency: "",
	};

	const [isSubmitting, setSubmitting] = useState(false);
	const [formData, setFormData] = useState(defaultGroup);

	const [selectedTeams, setSelectedTeams] = useState([]);
	const [selectedModule, setSelectedModule] = useState([]);
	const [openTeamMenu, setOpenTeamMenu] = useState(false);
	const [openModuleMenu, setOpenModuleMenu] = useState(false);

	const handleTeamMenuToggle = () => {
		setOpenTeamMenu((prev) => !prev);
	};

	const handleModuleMenuToggle = () => {
		setOpenModuleMenu((prev) => !prev);
	};

	const handleCloseTeamMenu = (selectedOptions) => {
		setOpenTeamMenu(false);
		setFormData((prevTask) => ({
			...prevTask,
			admin: selectedOptions,
		}));
	};

	const handleCloseModuleMenu = (selectedOptions) => {
		setOpenModuleMenu(false);
		setFormData((prevTask) => ({
			...prevTask,
			baseModule: selectedOptions,
		}));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setSubmitting(true);
		try {
			await SettingService.addGroup(formData);
			onClose();
			toast({
				title: "Group added successfully",
				status: "success",
				duration: 1500,
				isClosable: true,
			});
			setFormData(defaultGroup);
			if (setRefresh) setRefresh((prev) => !prev);
		} catch (error) {
			if (setMessage) setMessage("An error occurred. Please try again.", error);
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<>
			<Stack spacing={1}>
				<InputFormControl
					label={"Group Name"}
					name="name"
					valueText={formData?.name}
					handleChange={(e) =>
						setFormData((prevData) => ({
							...prevData,
							name: e.target.value,
						}))
					}
					required
				/>
				<HStack spacing={2}>
					<FormControl>
						<FormLabel visibility={openModuleMenu ? "" : "hidden"}>Select Base Module(s)</FormLabel>

						<MultiSelectButton
							handleMenuToggle={handleModuleMenuToggle}
							assignees={formData?.baseModule}
							data={modules}
							openAssigneeMenu={openModuleMenu}
							handleCloseMenu={handleCloseModuleMenu}
							selectedOptions={selectedModule}
							setSelectedOptions={setSelectedModule}
							tag="module(s)"
							label="Select Base Module"
						/>
					</FormControl>
					<FormControl>
						<FormLabel visibility={openTeamMenu ? "" : "hidden"}>Select Admin(s)</FormLabel>
						<MultiSelectButton
							handleMenuToggle={handleTeamMenuToggle}
							assignees={formData?.admin}
							data={managers}
							openAssigneeMenu={openTeamMenu}
							handleCloseMenu={handleCloseTeamMenu}
							selectedOptions={selectedTeams}
							setSelectedOptions={setSelectedTeams}
							tag="admin(s)"
							label="Select Admin"
						/>
					</FormControl>
				</HStack>
				<Checkbox
					colorScheme={"facebook"}
					isChecked={formData?.payrollActivated}
					onChange={() =>
						setFormData((prevData) => ({
							...prevData,
							payrollActivated: !formData?.payrollActivated,
						}))
					}
				>
					Is Payroll Activated?
				</Checkbox>
				{formData?.payrollActivated && (
					<SelectFormControl
						valueParam="name"
						required={true}
						name="name"
						label="Pay Frequency"
						valueText={formData?.payFrequency || ""}
						handleChange={(e) =>
							setFormData((prevData) => ({
								...prevData,
								payFrequency: e.target.value,
							}))
						}
						options={PAY_FREQUENCIES}
						placeholder="Select pay frequency"
					/>
				)}
				<ActionButtonGroup
					submitBtnName={"Add"}
					isDisabled={
						formData?.name === "" || (formData?.payrollActivated && !formData?.payFrequency)
					}
					isLoading={isSubmitting}
					onClose={onClose}
					onOpen={handleSubmit}
				/>
			</Stack>
			{showList && paygroup && (
				<Box>
					<TextTitle mt={3} title="All roles" />
					<Table variant="simple" size="sm">
						<Thead>
							<Tr>
								<Th>Name</Th>
								<Th>Is Payroll Active</Th>
							</Tr>
						</Thead>
						<Tbody>
							{(!paygroup || paygroup?.length === 0) && (
								<EmptyRowRecord data={paygroup} colSpan={2} />
							)}
							{paygroup?.map(({ _id, name, payrollActivated }) => (
								<Tr key={_id}>
									<Td>{name}</Td>
									<Td>{payrollActivated ? "Yes" : "No"}</Td>
								</Tr>
							))}
						</Tbody>
					</Table>
				</Box>
			)}
		</>
	);
};

export default PaygroupForm;
