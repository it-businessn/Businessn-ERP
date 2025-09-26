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
import NormalTextTitle from "components/ui/NormalTextTitle";
import TextTitle from "components/ui/text/TextTitle";
import React from "react";
import { FaBuilding } from "react-icons/fa";
import { getFormattedAddress } from "utils/common";

const ContactDetailsInfo = ({ contact, showLogForm }) => {
	const { isOpen: isProfileOpen, onToggle: onProfileToggle } = useDisclosure({
		defaultIsOpen: true,
	});

	const { isOpen: isCompanyOpen, onToggle: onCompanyToggle } = useDisclosure({
		defaultIsOpen: true,
	});
	const { name, primaryAssignee, industry, address, email, phone } = contact;

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
	const DETAILS = [
		{
			title: "Name",
			value: name,
		},
		{
			title: "Industry Type",
			value: industry,
		},
		{
			title: "Address",
			value: getFormattedAddress(address),
		},
	];
	const DETAILS2 = [
		{
			title: "Name",
			value: primaryAssignee[0].name,
		},
		{
			title: "Email",
			value: email,
		},
		{
			title: "Phone Number",
			value: phone,
		},
	];
	return (
		<>
			<VStack align="center" justify="center" mb={3}>
				<Avatar name=" " size="lg" bg="var(--primary_button_bg)" position="relative">
					<FaBuilding className="header-logo" />
				</Avatar>
				<Box textAlign="center">
					<TextTitle size="xl" title={name} />
					<TextTitle size="sm" title={`Primary Contact: ${primaryAssignee[0].name}`} />
				</Box>
			</VStack>
			<HStack spacing="5" justifyContent="center">
				{QUICK_LINKS.map(({ title, onClick, icon }) => (
					<IconButton
						key={title}
						icon={icon}
						aria-label={title}
						size={"xs"}
						bg="var(--primary_button_bg)"
						borderRadius="full"
						onClick={onClick}
					/>
				))}
			</HStack>
			<HStack spacing="6" mb="3" justifyContent="center">
				{QUICK_LINKS.map(({ label }) => (
					<Text fontSize={"sm"} key={label}>
						{label}
					</Text>
				))}
			</HStack>
			<Box>
				<Button onClick={onCompanyToggle} variant="link">
					{isCompanyOpen ? <ChevronDownIcon fontSize="md" /> : <ChevronRightIcon fontSize="md" />}
					Company Information
				</Button>
				<Collapse in={isCompanyOpen}>
					<Box p="4">
						{DETAILS.map(({ title, value }) => (
							<React.Fragment key={title}>
								<TextTitle size={"sm"} title={title} />
								<NormalTextTitle
									width={"150px"}
									size={"sm"}
									mb="2"
									title={value}
									whiteSpace="wrap"
								/>
							</React.Fragment>
						))}

						{/* <Text color="var(--gray2_color)">Website :</Text>
						<Text mb="2">{contact?.revenue}</Text>
						<Text color="var(--gray2_color)">Employees:</Text>
						<Text mb="2">{contact?.employees}</Text> */}
					</Box>
				</Collapse>
			</Box>

			<Box>
				<Button onClick={onProfileToggle} variant="link">
					{isProfileOpen ? <ChevronDownIcon fontSize="md" /> : <ChevronRightIcon fontSize="md" />}
					Primary Contact Information
				</Button>
				<Collapse in={isProfileOpen}>
					{contact && (
						<Box p="4">
							{DETAILS2.map(({ title, value }) => (
								<React.Fragment key={title}>
									<TextTitle size={"sm"} title={title} />
									<NormalTextTitle size={"sm"} mb="2" title={value} />
								</React.Fragment>
							))}

							{/* <Text color="var(--gray2_color)">Business Address:</Text>
							<Text mb="2">{contact?.primaryContactAddress}</Text> */}
						</Box>
					)}
				</Collapse>
			</Box>
		</>
	);
};

export default ContactDetailsInfo;
