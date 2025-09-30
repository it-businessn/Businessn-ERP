import { EditIcon } from "@chakra-ui/icons";
import {
	Checkbox,
	FormControl,
	FormLabel,
	HStack,
	IconButton,
	Table,
	Tbody,
	Td,
	Th,
	Thead,
	Tr,
	useToast,
} from "@chakra-ui/react";
import LeftIconButton from "components/ui/button/LeftIconButton";
import EmptyRowRecord from "components/ui/EmptyRowRecord";
import ActionButtonGroup from "components/ui/form/ActionButtonGroup";
import InputFormControl from "components/ui/form/InputFormControl";
import MultiSelectButton from "components/ui/form/MultiSelectButton";
import SelectFormControl from "components/ui/form/SelectFormControl";
import DeletePopUp from "components/ui/modal/DeletePopUp";
import TextTitle from "components/ui/text/TextTitle";
import { PAY_FREQUENCIES } from "constant";
import EditGroup from "features/setup/company/group-tab/EditGroup";
import useGroup from "hooks/useGroup";
import { useEffect, useState } from "react";
import { MdSettingsSuggest } from "react-icons/md";
import SettingService from "services/SettingService";
import { CURRENT_YEAR } from "utils/convertDate";
import { ConfigTabLayout } from "../../../components/ConfigTabLayout";

const PaygroupForm = ({ company, onClose, setRefresh, setMessage, modules, managers }) => {
	const toast = useToast();
	const defaultGroup = {
		name: "",
		baseModule: [],
		admin: [],
		company,
		payrollActivated: false,
		payFrequency: "",
		yearSchedules: [],
	};

	const [yearsList, setYearsList] = useState([CURRENT_YEAR]);
	const [paygroupAdded, setPaygroupAdded] = useState(false);
	const [editingId, setEditingId] = useState(null);
	const [showSchedule, setShowSchedule] = useState(false);
	const [deleteRecordId, setDeleteRecordId] = useState(null);
	const [showConfirmationPopUp, setShowConfirmationPopUp] = useState(false);
	const [isSubmitting, setSubmitting] = useState(false);
	const [formData, setFormData] = useState(defaultGroup);

	const [selectedTeams, setSelectedTeams] = useState([]);
	const [allPaygroup, setAllPaygroup] = useState(null);
	const [selectedModule, setSelectedModule] = useState([]);
	const [openTeamMenu, setOpenTeamMenu] = useState(false);
	const [openModuleMenu, setOpenModuleMenu] = useState(false);

	const paygroup = useGroup(company, paygroupAdded);

	useEffect(() => {
		setAllPaygroup(paygroup);
	}, [paygroup]);

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
			await SettingService.addGroup(formData);
			toast({
				title: "Group added successfully",
				status: "success",
				duration: 1500,
				isClosable: true,
			});
			setFormData(defaultGroup);
			if (setRefresh) setRefresh((prev) => !prev);
			if (onClose) onClose();
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
			await SettingService.updateGroup(formData, editingId);
			toast({
				title: "Group updated successfully",
				status: "success",
				duration: 1500,
				isClosable: true,
			});
			if (onClose) onClose();
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
	const handleEdit = (data) => {
		setFormData((prevData) => ({
			...prevData,
			payrollActivated: data?.payrollActivated,
			baseModule: data?.modules,
			name: data?.name,
			admin: data?.admin,
			payFrequency: data?.scheduleFrequency,
			yearSchedules: data?.yearSchedules,
		}));
		setSelectedModule(data?.modules);
		setSelectedTeams(data?.admin);
		setEditingId(data._id);
		setYearsList(data?.yearSchedules.map(({ year }) => year));
	};

	const confirmDelete = async (ccId) => {
		setShowConfirmationPopUp(true);
		setDeleteRecordId(ccId);
	};

	const handleClose = () => {
		setShowConfirmationPopUp(false);
		setDeleteRecordId(null);
		setEditingId(null);
		setFormData(defaultGroup);
	};

	const handleDelete = async () => {
		// try {
		// 	await SettingService.deleteHoliday({}, deleteRecordId);
		// 	setHolidays(holidays.filter((holiday) => holiday._id !== deleteRecordId));
		// 	toast({
		// 		title: "Success",
		// 		description: "Paygroup deleted successfully",
		// 		status: "success",
		// 		duration: 3000,
		// 		isClosable: true,
		// 	});
		// 	handleClose();
		// } catch (error) {
		// 	toast({
		// 		title: "Error",
		// 		description: "Failed to delete holiday",
		// 		status: "error",
		// 		duration: 3000,
		// 		isClosable: true,
		// 	});
		// }
	};

	return (
		<>
			{showConfirmationPopUp && (
				<DeletePopUp
					headerTitle="Please confirm"
					textTitle="Are you sure you want to delete the paygroup?"
					isOpen={showConfirmationPopUp}
					onClose={handleClose}
					onOpen={handleDelete}
				/>
			)}
			<ConfigTabLayout
				tableData={allPaygroup}
				tableTitle="All Paygroups"
				tableContent={
					<Table variant="simple" size="sm">
						<Thead>
							<Tr>
								<Th>Name</Th>
								<Th>Payroll Activated</Th>
								<Th>Action</Th>
							</Tr>
						</Thead>
						<Tbody>
							{(!allPaygroup || allPaygroup?.length === 0) && (
								<EmptyRowRecord data={allPaygroup} colSpan={2} />
							)}
							{allPaygroup?.map((paygroup) => (
								<Tr key={paygroup?._id}>
									<Td>{paygroup?.name}</Td>
									<Td>{paygroup?.payrollActivated ? "Yes" : "No"}</Td>
									<Td>
										<HStack spacing={2}>
											<IconButton
												aria-label="Edit holiday"
												icon={<EditIcon />}
												size="sm"
												onClick={() => handleEdit(paygroup)}
												color="var(--banner_bg)"
												_hover={{
													bg: "var(--banner_bg)",
													color: "white",
												}}
											/>
											{/* <IconButton
												aria-label="Delete holiday"
												icon={<DeleteIcon />}
												size="sm"
												color="var(--banner_bg)"
												_hover={{
													bg: "var(--banner_bg)",
													color: "white",
												}}
												onClick={() => confirmDelete(paygroup?._id)}
											/> */}
										</HStack>
									</Td>
								</Tr>
							))}
						</Tbody>
					</Table>
				}
				leftContent={
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
								<FormLabel visibility={openModuleMenu ? "" : "hidden"}>
									Select Base Module(s)
								</FormLabel>

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
						{editingId && formData?.payrollActivated && (
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
							onClose={handleClose}
							onOpen={editingId ? handleSubmit : handleUpdate}
							size="sm"
							justifyContent="end"
						/>
					</>
				}
			/>
			{showSchedule && (
				<EditGroup
					selectedGroup={formData}
					isOpen={showSchedule}
					onClose={() => setShowSchedule(false)}
					yearsList={yearsList}
				/>
			)}
		</>
	);
};

export default PaygroupForm;
