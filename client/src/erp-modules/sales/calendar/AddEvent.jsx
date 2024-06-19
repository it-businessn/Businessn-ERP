import {
	Flex,
	FormLabel,
	ModalBody,
	ModalFooter,
	Select,
} from "@chakra-ui/react";
import FormControlMain from "components/ui/form";
import ActionButtonGroup from "components/ui/form/ActionButtonGroup";
import DateTimeFormControl from "components/ui/form/DateTimeFormControl";
import InputFormControl from "components/ui/form/InputFormControl";
import MultiSelectFormControl from "components/ui/form/MultiSelectFormControl";
import SelectFormControl from "components/ui/form/SelectFormControl";
import TextAreaFormControl from "components/ui/form/TextAreaFormControl";
import ModalLayout from "components/ui/modal/ModalLayout";
import { useEffect, useState } from "react";
import CalendarService from "services/CalendarService";
import SettingService from "services/SettingService";

const AddEvent = ({
	event,
	isEdit,
	isLoading,
	isOpen,
	onClose,
	setIsLoading,
	setIsRefresh,
	filterText = "Event",
	filter = "event",
	// setShowEditDetails,
	company,
	user,
}) => {
	const [eventType, setEventType] = useState(filter);
	const [groups, setGroups] = useState(null);
	const [groupMembers, setGroupMembers] = useState(null);

	useEffect(() => {
		const fetchAllGroups = async () => {
			try {
				const response = await SettingService.getAllGroups(company);
				setGroups(response.data);
				if (response.data.length) {
					setGroupMembers(response.data[0].members);
				} else {
					setGroupMembers(null);
				}
			} catch (error) {
				console.error(error);
			}
		};
		fetchAllGroups();
	}, []);

	const initialFormData = {
		description: "",
		eventLink: "",
		eventType: filter,
		fromDate: "",
		fromTime: "",
		location: "",
		meetingAttendees: [],
		toDate: "",
		toTime: "",
		companyName: company,
		group: "",
		createdBy: user?._id,
	};

	const initialSavedData = {
		description: event?.description,
		eventLink: event?.eventLink,
		eventType: event?.eventType,
		fromDate: event?.fromDate,
		fromTime: event?.fromTime,
		location: event?.location,
		meetingAttendees: event?.meetingAttendees || [],
		toDate: event?.toDate,
		toTime: event?.toTime,
		createdBy: event?.createdBy,
	};
	const [selectedOptions, setSelectedOptions] = useState([]);

	const [formData, setFormData] = useState(initialFormData);

	const [openAssigneeMenu, setOpenAssigneeMenu] = useState(false);

	const handleMenuToggle = () => {
		setOpenAssigneeMenu((prev) => !prev);
	};

	const handleCloseMenu = (selectedOptions) => {
		setOpenAssigneeMenu(false);
		setFormData((prevTask) => ({
			...prevTask,
			meetingAttendees: selectedOptions,
		}));
	};
	const handleTypeChange = (e) => {
		setEventType(e.target.value);
		setFormData((prevData) => ({
			...prevData,
			eventType: e.target.value,
			description: "",
			eventLink: "",
			fromDate: "",
			fromTime: "",
			location: "",
			meetingAttendees: [],
			toDate: "",
			toTime: "",
		}));
	};
	const handleChange = (e) => {
		const { name, value } = e.target;
		// if (formData.fromDate !== "" && formData.fromTime !== "") {
		// 	setFormData((prevData) => ({
		// 		...prevData,
		// 		toDate: formData.fromDate,
		// 	}));
		// 	setFormData((prevData) => ({
		// 		...prevData,
		// 		toTime: formData.fromTime,
		// 	}));
		// }
		setFormData((prevData) => ({ ...prevData, [name]: value }));
	};
	const handleGroupChange = (e) => {
		setFormData((prevData) => ({
			...prevData,
			group: e.target.value,
		}));
		formData.meetingAttendees = [];
		setSelectedOptions([]);
		setGroupMembers(groups.find(({ _id }) => _id === e.target.value).members);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		try {
			setIsLoading(true);
			if (isEdit) {
				await CalendarService.updateEvent(formData, event._id);
			} else {
				await CalendarService.addEvent(formData);
				setFormData(initialFormData);
			}
			// setFormData({
			// 	eventType: "meeting",
			// 	description: "",
			// 	fromDate: "",
			// 	fromTime: "",
			// 	toDate: "",
			// 	toTime: "",
			// 	meetingAttendees: "",
			// 	location: "",
			// 	eventLink: "",
			// 	taskType: "",
			// 	taskDueDate: "",
			// 	taskAssignee: "",
			// 	taskDuration: "",
			// 	phoneNo: "",
			// });
			onClose();
			setIsRefresh((prev) => !prev);
		} catch (error) {
			console.error(error);
		}
	};
	useEffect(() => {
		if (isEdit) {
			setFormData(initialSavedData);
		} else {
			setFormData(initialFormData);
		}
	}, [isEdit]);

	return (
		<ModalLayout
			title={`Add ${filterText}`}
			size="xl"
			isOpen={isOpen}
			onClose={onClose}
		>
			<form onSubmit={handleSubmit} className="tab-form">
				<ModalBody px={1}>
					<SelectFormControl
						name="eventType"
						label={"Type of Event"}
						valueText={formData.eventType}
						handleChange={handleTypeChange}
						options={[
							{
								name: "Events",
								value: "event",
							},
							{
								name: "Meeting",
								value: "meeting",
							},
							// {
							// 	name: "Task",
							// 	value: "task",
							// },
							{
								name: "Phone Call",
								value: "phoneCall",
							},
						]}
					/>
					<TextAreaFormControl
						label={"Description"}
						name="description"
						valueText={formData.description}
						handleChange={handleChange}
						required
					/>
					{eventType === "phoneCall" && (
						<InputFormControl
							label={"Phone Number"}
							name="phoneNo"
							valueText={formData.phoneNo}
							handleChange={handleChange}
							required
						/>
					)}
					<Flex>
						<DateTimeFormControl
							label={"From"}
							valueText1={formData.fromDate}
							valueText2={formData.fromTime}
							name1="fromDate"
							name2="fromTime"
							handleChange={handleChange}
							required
						/>
					</Flex>
					<Flex>
						<DateTimeFormControl
							label={"To"}
							valueText1={formData.toDate}
							valueText2={formData.toTime}
							name1="toDate"
							name2="toTime"
							handleChange={handleChange}
							required
						/>
					</Flex>
					{eventType !== "phoneCall" && (
						<>
							<FormControlMain>
								<FormLabel>Select Group</FormLabel>
								<Select
									name={"group"}
									value={formData.group}
									onChange={handleGroupChange}
								>
									{groups?.map(({ name, _id }) => (
										<option key={_id} value={_id}>
											{name}
										</option>
									))}
								</Select>
							</FormControlMain>
							<MultiSelectFormControl
								label={"Select Required Internal Attendees"}
								tag={"attendee(s)"}
								showMultiSelect={openAssigneeMenu}
								data={groupMembers}
								handleCloseMenu={handleCloseMenu}
								selectedOptions={selectedOptions}
								setSelectedOptions={setSelectedOptions}
								handleMenuToggle={handleMenuToggle}
								list={formData.meetingAttendees}
							/>
							<InputFormControl
								label={"Location"}
								name="location"
								valueText={formData.location}
								handleChange={handleChange}
								required
							/>
							<TextAreaFormControl
								label={"Meeting Link"}
								name="eventLink"
								valueText={formData.eventLink}
								handleChange={handleChange}
								required
							/>
						</>
					)}
				</ModalBody>
				<ModalFooter px={1}>
					<ActionButtonGroup
						submitBtnName={"Add Event"}
						isDisabled={formData.description === ""}
						isLoading={isLoading}
						onClose={onClose}
					/>
				</ModalFooter>
			</form>
		</ModalLayout>
	);
};

export default AddEvent;
