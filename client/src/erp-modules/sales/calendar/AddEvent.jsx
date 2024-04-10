import {
	Avatar,
	Button,
	Flex,
	FormControl,
	FormLabel,
	Input,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	Select,
	Text,
	Textarea,
} from "@chakra-ui/react";
import MultiCheckboxMenu from "components/ui/MultiCheckboxMenu";
import { useEffect, useState } from "react";
import { FaCaretDown } from "react-icons/fa";
import CalendarService from "services/CalendarService";
import UserService from "services/UserService";

const AddEvent = ({
	showModal,
	setShowModal,
	setIsRefresh,
	isLoading,
	setIsLoading,
}) => {
	const [eventType, setEventType] = useState("event");
	const [attendees, setAttendees] = useState(null);
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
		description: "",
		eventLink: "",
		eventType: "event",
		fromDate: "",
		fromTime: "",
		location: "",
		meetingAttendees: [],
		toDate: "",
		toTime: "",
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

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			setIsLoading(true);
			await CalendarService.addEvent(formData);
			setFormData({
				eventType: "meeting",
				description: "",
				fromDate: "",
				fromTime: "",
				toDate: "",
				toTime: "",
				meetingAttendees: "",
				location: "",
				eventLink: "",
				taskType: "",
				taskDueDate: "",
				taskAssignee: "",
				taskDuration: "",
				phoneNo: "",
			});
			setFormData(initialFormData);
			setShowModal(false);
			setIsRefresh((prev) => !prev);
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<Modal isOpen={showModal} size="xl" onClose={() => setShowModal(false)}>
			<ModalOverlay />
			<ModalContent zIndex="2">
				<ModalHeader>Add Event</ModalHeader>
				<form className="tab-form">
					<ModalBody>
						<FormControl>
							<FormLabel>Type of Event</FormLabel>
							<Select
								name="eventType"
								value={formData.eventType}
								onChange={handleTypeChange}
							>
								<option value="event">Events</option>
								<option value="meeting">Meeting</option>
								{/* <option value="task">Task</option> */}
								<option value="phoneCall">Phone Call</option>
							</Select>
						</FormControl>
						<FormControl>
							<FormLabel>Description</FormLabel>
							<Textarea
								name="description"
								value={formData.description}
								onChange={handleChange}
								required
							/>
						</FormControl>
						{eventType === "call" && (
							<FormControl>
								<FormLabel>Phone Number</FormLabel>
								<Input
									type="text"
									name="phoneNo"
									value={formData.phoneNo}
									onChange={handleChange}
									required
								/>
							</FormControl>
						)}
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

						{eventType !== "phoneCall" && (
							<>
								<FormControl>
									<FormLabel visibility={openAssigneeMenu ? "" : "hidden"}>
										Select Required Attendees
									</FormLabel>
									<Button
										rightIcon={<FaCaretDown />}
										bg={"brand.primary_bg"}
										color={"brand.primary_button_bg"}
										_hover={{
											bg: "brand.primary_bg",
											color: "brand.primary_button_bg",
										}}
									>
										{openAssigneeMenu ? (
											<MultiCheckboxMenu
												data={attendees}
												openMenu={openAssigneeMenu}
												handleCloseMenu={handleCloseMenu}
												selectedOptions={selectedOptions}
												setSelectedOptions={setSelectedOptions}
											/>
										) : (
											<Text onClick={handleMenuToggle}>
												{formData.meetingAttendees?.length > 0
													? `${formData.meetingAttendees?.length} attendee(s)`
													: "Select Required Attendees"}
											</Text>
										)}
									</Button>
									{formData?.meetingAttendees?.length > 0 &&
										formData.meetingAttendees.map((name, index) => (
											<Avatar
												size={"sm"}
												name={name}
												src={name}
												key={`${name}_${index}`}
											/>
										))}
								</FormControl>
								<FormControl>
									<FormLabel>Location </FormLabel>
									<Input
										type="text"
										name="location"
										value={formData.location}
										onChange={handleChange}
										required
									/>
								</FormControl>
								<FormControl>
									<FormLabel>Meeting Link</FormLabel>
									<Textarea
										name="eventLink"
										value={formData.eventLink}
										onChange={handleChange}
										required
									/>
								</FormControl>
							</>
						)}
					</ModalBody>
					<ModalFooter>
						<Button
							isDisabled={formData.description === ""}
							onClick={handleSubmit}
							bg="brand.logo_bg"
							isLoading={isLoading}
							loadingText="Loading"
						>
							Add Event
						</Button>
						<Button variant="ghost" onClick={() => setShowModal(false)}>
							Cancel
						</Button>
					</ModalFooter>
				</form>
			</ModalContent>
		</Modal>
	);
};

export default AddEvent;
