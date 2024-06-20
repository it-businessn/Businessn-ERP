import { Flex, FormLabel, Select, VStack } from "@chakra-ui/react";
import PrimaryButton from "components/ui/button/PrimaryButton";
import FormControlMain from "components/ui/form";
import DateTimeFormControl from "components/ui/form/DateTimeFormControl";
import InputFormControl from "components/ui/form/InputFormControl";
import MultiSelectFormControl from "components/ui/form/MultiSelectFormControl";
import RadioFormControl from "components/ui/form/RadioFormControl";
import TextAreaFormControl from "components/ui/form/TextAreaFormControl";
import { ROLES } from "constant";
import { useEffect, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import CalendarService from "services/CalendarService";
import SettingService from "services/SettingService";
import UserService from "services/UserService";
import MeetingList from "./MeetingList";

const Meetings = ({ contactId, user, company }) => {
	const [openAssigneeMenu, setOpenAssigneeMenu] = useState(false);

	const [attendees, setAttendees] = useState(null);
	const [meetings, setMeetings] = useState([]);
	const [refresh, setRefresh] = useState(false);

	useEffect(() => {
		const fetchAllAttendees = async () => {
			try {
				const response = await UserService.getAllUsers();
				setAttendees(response.data);
			} catch (error) {
				console.error(error);
			}
		};
		fetchAllAttendees();
	}, []);

	const initialFormData = {
		type: "virtual",
		description: "",
		attendees: [],
		location: "",
		fromDate: "",
		toDate: "",
		fromTime: "",
		toTime: "",
		meetingLink: "",
		group: "",
		createdBy: user?._id,
		contactId,
		companyName: company,
	};
	const [formData, setFormData] = useState(initialFormData);
	const [selectedOptions, setSelectedOptions] = useState([]);

	useEffect(() => {
		const fetchMeetingsByContactId = async () => {
			try {
				const response = await CalendarService.getMeetingsByContactId(
					contactId,
				);
				setMeetings(response.data);
			} catch (error) {
				console.error(error);
			}
		};
		fetchMeetingsByContactId();
	}, [contactId, refresh]);

	const handleSubmit = async () => {
		try {
			await CalendarService.addMeeting(formData);
			setRefresh((prev) => !prev);
			setFormData(initialFormData);
		} catch (error) {
			console.error(error);
		}
	};

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prevData) => ({ ...prevData, [name]: value }));
	};

	const handleRadioChange = (meetingType) => {
		setFormData((prevData) => ({ ...prevData, type: meetingType }));
	};

	const handleCloseMenu = (selectedOptions) => {
		setOpenAssigneeMenu(false);
		setFormData((prevTask) => ({
			...prevTask,
			attendees: selectedOptions,
		}));
	};
	const handleMenuToggle = () => {
		setOpenAssigneeMenu((prev) => !prev);
	};
	const [groups, setGroups] = useState(null);
	const [groupMembers, setGroupMembers] = useState(null);

	useEffect(() => {
		const fetchAllGroups = async () => {
			try {
				const response = await SettingService.getAllGroups(company);
				setGroups(response.data);
				if (response.data.length) {
					setGroupMembers(
						response.data[0].members.filter(
							(_) =>
								_.role.includes(ROLES.ADMIN) ||
								_.role.includes(ROLES.TECH_ADMIN),
						),
					);
				} else {
					setGroupMembers(null);
				}
			} catch (error) {
				console.error(error);
			}
		};
		fetchAllGroups();
	}, []);

	const handleGroupChange = (e) => {
		setFormData((prevData) => ({
			...prevData,
			group: e.target.value,
		}));
		formData.attendees = [];
		setSelectedOptions([]);
		setGroupMembers(
			groups
				.find(({ _id }) => _id === e.target.value)
				.members.filter(
					(_) =>
						_.role.includes(ROLES.ADMIN) || _.role.includes(ROLES.TECH_ADMIN),
				),
		);
	};

	return (
		<VStack spacing="4" p="4">
			<form className="tab-form">
				<RadioFormControl
					label={"Meeting Type"}
					handleChange={handleRadioChange}
					options={[
						{ name: "Virtual", value: "virtual" },
						{ name: "In-Person", value: "inPerson" },
					]}
					isRequired
				/>
				<TextAreaFormControl
					label={"Meeting Description"}
					name="description"
					valueText={formData.description}
					handleChange={handleChange}
					required
				/>
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
					list={formData.attendees}
				/>
				<InputFormControl
					label={"Location"}
					name="location"
					valueText={formData.location}
					handleChange={handleChange}
					required
				/>
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
				<TextAreaFormControl
					label={"Meeting Link"}
					name="meetingLink"
					valueText={formData.meetingLink}
					handleChange={handleChange}
					required
				/>
				<PrimaryButton
					name={"Add Meeting"}
					size={"sm"}
					mt={4}
					isDisabled={formData.description === ""}
					onOpen={(e) => {
						e.preventDefault();
						handleSubmit();
					}}
				/>
			</form>
			{meetings?.length && <MeetingList meetings={meetings} />}
		</VStack>
	);
};

export default Meetings;
