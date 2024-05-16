import { Flex, VStack } from "@chakra-ui/react";
import PrimaryButton from "components/ui/button/PrimaryButton";
import DateTimeFormControl from "components/ui/form/DateTimeFormControl";
import InputFormControl from "components/ui/form/InputFormControl";
import RadioFormControl from "components/ui/form/RadioFormControl";
import TextAreaFormControl from "components/ui/form/TextAreaFormControl";
import { useEffect, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import CalendarService from "services/CalendarService";
import MeetingList from "./MeetingList";

const Meetings = ({ contactId }) => {
	const [meetings, setMeetings] = useState([]);

	const [formData, setFormData] = useState({
		description: "",
		attendees: "",
		location: "",
		fromDate: "",
		toDate: "",
		fromTime: "",
		toTime: "",
		type: "virtual",
		meetingLink: "",
	});

	useEffect(() => {
		fetchMeetingsByContactId(contactId);
	}, [contactId]);

	const fetchMeetingsByContactId = async (contactId) => {
		try {
			const response = await CalendarService.getMeetingsByContactId(contactId);
			setMeetings(response.data);
		} catch (error) {
			console.error(error);
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		formData.contactId = contactId;
		try {
			await CalendarService.addMeeting(formData);
			fetchMeetingsByContactId(contactId);
			setFormData({
				description: "",
				attendees: "",
				location: "",
				fromDate: "",
				toDate: "",
				fromTime: "",
				toTime: "",
				type: "",
				meetingLink: "",
			});
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
				<InputFormControl
					label={"Required Attendees"}
					name="attendees"
					valueText={formData.attendees}
					handleChange={handleChange}
					required
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
					onOpen={handleSubmit}
				/>
			</form>
			{meetings?.length && <MeetingList meetings={meetings} />}
		</VStack>
	);
};

export default Meetings;
