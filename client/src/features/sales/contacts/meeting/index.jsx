import {
	Button,
	Flex,
	FormControl,
	FormLabel,
	Input,
	Radio,
	RadioGroup,
	Stack,
	Textarea,
	VStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import * as api from "services";
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
			const response = await api.getMeetingsByContactId(contactId);
			setMeetings(response.data);
		} catch (error) {
			console.error(error);
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		formData.contactId = contactId;
		try {
			await api.addMeeting(formData);
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
				<FormControl isRequired>
					<FormLabel>Meeting Type</FormLabel>
					<RadioGroup
						defaultValue="virtual"
						onChange={handleRadioChange}
						name="type"
					>
						<Stack direction="row">
							<Radio value="virtual">Virtual</Radio>
							<Radio value="inPerson">In-Person</Radio>
						</Stack>
					</RadioGroup>
				</FormControl>
				<FormControl isRequired>
					<FormLabel>Meeting Description</FormLabel>
					<Textarea
						name="description"
						value={formData.description}
						onChange={handleChange}
						required
					/>
				</FormControl>
				<FormControl isRequired>
					<FormLabel>Required Attendees</FormLabel>
					<Input
						type="text"
						name="attendees"
						value={formData.attendees}
						onChange={handleChange}
						required
					/>
				</FormControl>
				<FormControl isRequired>
					<FormLabel>Location </FormLabel>
					<Input
						type="text"
						name="location"
						value={formData.location}
						onChange={handleChange}
						required
					/>
				</FormControl>
				<Flex>
					<FormControl flex="1">
						<FormLabel>From</FormLabel>
						<Input
							type="date"
							name="fromDate"
							value={formData.fromDate}
							onChange={handleChange}
							required
						/>
					</FormControl>
					<FormControl flex="1">
						<FormLabel>Time</FormLabel>
						<Input
							type="time"
							name="fromTime"
							value={formData.fromTime}
							onChange={handleChange}
							required
						/>
					</FormControl>
				</Flex>
				<Flex>
					<FormControl flex="1">
						<FormLabel>To</FormLabel>
						<Input
							type="date"
							name="toDate"
							value={formData.toDate}
							onChange={handleChange}
							required
						/>
					</FormControl>
					<FormControl flex="1">
						<FormLabel>Time</FormLabel>
						<Input
							type="time"
							name="toTime"
							value={formData.toTime}
							onChange={handleChange}
							required
						/>
					</FormControl>
				</Flex>
				<FormControl>
					<FormLabel>Meeting Link</FormLabel>
					<Textarea
						name="meetingLink"
						value={formData.meetingLink}
						onChange={handleChange}
						required
					/>
				</FormControl>
				<Button
					isDisabled={formData.description === ""}
					mt={4}
					onClick={handleSubmit}
					bg="brand.logo_bg"
				>
					Add Meeting
				</Button>
			</form>
			{meetings?.length && <MeetingList meetings={meetings} />}
		</VStack>
	);
};

export default Meetings;
