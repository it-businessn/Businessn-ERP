import {
	AddIcon,
	CalendarIcon,
	ChatIcon,
	ChevronDownIcon,
	ChevronRightIcon,
	TimeIcon,
} from "@chakra-ui/icons";
import {
	Avatar,
	Box,
	Button,
	Collapse,
	HStack,
	IconButton,
	Text,
	VStack,
	useDisclosure,
} from "@chakra-ui/react";
import { FaBuilding } from "react-icons/fa";

const ContactDetailsForm = ({ contact, showLogForm }) => {
	const { isOpen: isProfileOpen, onToggle: onProfileToggle } = useDisclosure({
		defaultIsOpen: true,
	});

	const { isOpen: isCompanyOpen, onToggle: onCompanyToggle } = useDisclosure({
		defaultIsOpen: true,
	});
	const { companyName, primaryAssignee, industry, address, email, phone } =
		contact;
	const { streetNumber, city, country, postalCode, state } = address;

	const QUICK_LINKS = [
		{
			title: "Add Note",
			icon: <AddIcon />,
			onClick: () => showLogForm(true),
			label: "Note",
		},
		{
			title: "Add Chat",
			icon: <ChatIcon />,
			onClick: () => showLogForm(true),
			label: "Log",
		},
		{
			title: "Add Task",
			icon: <TimeIcon />,
			onClick: () => showLogForm(true),
			label: "Task",
		},
		{
			title: "Add Meeting",
			icon: <CalendarIcon />,
			onClick: () => showLogForm(true),
			label: "Meet",
		},
		// {
		// 	title: "Add Note",
		// 	icon: <PhoneIcon />,	label: "Call",
		// },
		// {
		// 	title: "Add Note",
		// 	icon: <EmailIcon />,	label: "Email",
		// },
	];
	return (
		<>
			<VStack align="center" justify="center" mb={3}>
				<Avatar
					name=" "
					size="lg"
					bg="brand.primary_button_bg"
					position="relative"
				>
					<FaBuilding className="header-logo" />
				</Avatar>
				<Box textAlign="center">
					<Text fontSize="xl" fontWeight="bold">
						{companyName}
					</Text>
					<Text fontSize="sm" fontWeight="bold">
						Primary Contact: {primaryAssignee[0].name}
					</Text>
				</Box>
			</VStack>
			<HStack spacing="5" justifyContent="center">
				{QUICK_LINKS.map(({ title, onClick, icon }) => (
					<IconButton
						key={title}
						icon={icon}
						aria-label={title}
						size={"sm"}
						bg="brand.primary_button_bg"
						borderRadius="full"
						onClick={onClick}
					/>
				))}
			</HStack>
			<HStack spacing="6" mb="3" justifyContent="center">
				{QUICK_LINKS.map(({ label }) => (
					<Text key={label}> {label}</Text>
				))}
			</HStack>
			<>
				<Button onClick={onCompanyToggle} variant="link" fontSize="sm">
					{isCompanyOpen ? (
						<ChevronDownIcon fontSize="md" />
					) : (
						<ChevronRightIcon fontSize="md" />
					)}
					Company Information
				</Button>
				<Collapse in={isCompanyOpen}>
					<Box p="4">
						<Text color="brand.400"> Name: </Text>
						<Text mb="2">{companyName}</Text>
						<Text color="brand.400">Industry Type:</Text>
						<Text mb="2">{industry}</Text>
						<Text color="brand.400">Address:</Text>
						<Text mb="2">{`${streetNumber} ${city} ${state} ${country} ${postalCode}`}</Text>
						{/* <Text color="brand.400">Website :</Text>
						<Text mb="2">{contact?.revenue}</Text>
						<Text color="brand.400">Employees:</Text>
						<Text mb="2">{contact?.employees}</Text> */}
					</Box>
				</Collapse>
			</>
			<>
				<Button onClick={onProfileToggle} variant="link" fontSize="sm">
					{isProfileOpen ? (
						<ChevronDownIcon fontSize="md" />
					) : (
						<ChevronRightIcon fontSize="md" />
					)}
					Primary Contact Information
				</Button>
				<Collapse in={isProfileOpen}>
					{contact && (
						<Box p="4">
							<Text color="brand.400">Name: </Text>
							<Text mb="2">{primaryAssignee[0].name}</Text>
							{/* <Text color="brand.400">Last Name:</Text>
							<Text mb="2">{contact?.lastName}</Text> */}
							<Text color="brand.400">Email:</Text>
							<Text mb="2">{email}</Text>
							<Text color="brand.400">Phone Number:</Text>
							<Text mb="2">{phone}</Text>
							{/* <Text color="brand.400">Business Address:</Text>
							<Text mb="2">{contact?.primaryContactAddress}</Text> */}
						</Box>
					)}
				</Collapse>
			</>
		</>
	);
};

export default ContactDetailsForm;
