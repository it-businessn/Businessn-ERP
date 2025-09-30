import { Checkbox, FormControl, FormLabel, HStack, useToast } from "@chakra-ui/react";
import LeftIconButton from "components/ui/button/LeftIconButton";
import ActionButtonGroup from "components/ui/form/ActionButtonGroup";
import InputFormControl from "components/ui/form/InputFormControl";
import MultiSelectButton from "components/ui/form/MultiSelectButton";
import SelectFormControl from "components/ui/form/SelectFormControl";
import TextTitle from "components/ui/text/TextTitle";
import { PAY_FREQUENCIES } from "constant";
import EditGroup from "features/setup/company/group-tab/EditGroup";
import { useState } from "react";
import { MdSettingsSuggest } from "react-icons/md";
import SettingService from "services/SettingService";

const PaygroupForm = ({
	formData,
	editingId,
	setFormData,
	onClose,
	setRefresh,
	setMessage,
	modules,
	managers,
	selectedModule,
	setSelectedModule,
	selectedTeams,
	setSelectedTeams,
	setAllPaygroup,
	setYearsList,
	yearsList,
}) => {
	const toast = useToast();
	const [showSchedule, setShowSchedule] = useState(false);
	const [isSubmitting, setSubmitting] = useState(false);
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

	const handleSubmit = async () => {
		setSubmitting(true);
		try {
			const { data } = await SettingService.addGroup(formData);
			toast({
				title: "Group added successfully",
				status: "success",
				duration: 1500,
				isClosable: true,
			});
			if (setRefresh) setRefresh((prev) => !prev);
			if (onClose) onClose();
			setAllPaygroup((prev) => [data, ...prev]);
		} catch (error) {
			toast({
				title: "Error",
				description: error?.response?.data?.message,
				status: "error",
				duration: 3000,
				isClosable: true,
			});
			if (setMessage) setMessage("An error occurred. Please try again.", error);
		} finally {
			setSubmitting(false);
		}
	};

	const handleUpdate = async () => {
		setSubmitting(true);
		try {
			const { data } = await SettingService.updateGroup(formData, editingId);
			setAllPaygroup((prev) =>
				prev.map((cc) =>
					cc._id === editingId
						? {
								...cc,
								payrollActivated: data?.payrollActivated,
								baseModule: data?.modules,
								name: data?.name,
								admin: data?.admin,
								payFrequency: data?.scheduleFrequency,
								yearSchedules: data?.yearSchedules,
						  }
						: cc,
				),
			);
			setSelectedModule(data?.modules);
			setSelectedTeams(data?.admin);
			setYearsList(data?.yearSchedules.map(({ year }) => year));
			toast({
				title: "Group updated successfully",
				status: "success",
				duration: 1500,
				isClosable: true,
			});
		} catch (error) {
			toast({
				title: "Error",
				description: error?.response?.data?.message,
				status: "error",
				duration: 3000,
				isClosable: true,
			});
			if (setMessage) setMessage("An error occurred. Please try again.", error);
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<>
			<TextTitle size="lg" title={`${editingId ? "Update" : "Add New"} Paygroup`} />
			<InputFormControl
				label={"Group Name"}
				name="name"
				size={"sm"}
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
					size={"sm"}
					valueParam="name"
					required={true}
					name="name"
					label="Pay Frequency"
					valueText={formData?.payFrequency || ""}
					handleChange={(e) => {
						if (e.target.value)
							setFormData((prevData) => ({
								...prevData,
								payFrequency: e.target.value,
							}));
					}}
					options={PAY_FREQUENCIES}
					placeholder="Select pay frequency"
				/>
			)}
			{editingId && formData?.yearSchedules?.length > 0 && (
				<LeftIconButton
					color={"var(--nav_color)"}
					border={"2px solid var(--filter_border_color)"}
					name={"Update Schedule"}
					borderRadius={"10px"}
					variant={"ghost"}
					isFilter
					size="sm"
					ml={2}
					handleClick={() => setShowSchedule(true)}
					icon={<MdSettingsSuggest />}
				/>
			)}
			<ActionButtonGroup
				isDisabled={
					formData?.name === "" || (formData?.payrollActivated && !formData?.payFrequency)
				}
				submitBtnName={`${editingId ? "Save" : "Add"}`}
				closeLabel={editingId ? "Cancel" : ""}
				onClose={onClose}
				onOpen={editingId ? handleUpdate : handleSubmit}
				size="sm"
				justifyContent="end"
				isLoading={isSubmitting}
			/>
			{showSchedule && (
				<EditGroup
					selectedGroup={formData}
					editingId={editingId}
					isOpen={showSchedule}
					onClose={() => setShowSchedule(false)}
					yearsList={yearsList}
				/>
			)}
		</>
	);
};

export default PaygroupForm;
