import { AddIcon, CalendarIcon, ChatIcon, TimeIcon } from "@chakra-ui/icons";
import { useEffect, useState } from "react";
import ContactService from "services/ContactService";
import CustomersList from "./CustomersList";
import Contacts from "./contacts";

const Customers = () => {
	const [contacts, setContacts] = useState(null);
	const [viewProfile, setViewProfile] = useState(false);
	const [selectedContact, setSelectedContact] = useState(null);
	const fetchAllContacts = async () => {
		try {
			const response = await ContactService.getContacts();
			setContacts(response.data);
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		fetchAllContacts();
	}, []);

	const handleProfileView = (id) => {
		setSelectedContact(id);
		setViewProfile((prev) => !prev);
	};
	const QUICK_LINKS = [
		{
			title: "Add Note",
			icon: <AddIcon />,
			// onClick: () => showLogForm(true),
			label: "Note",
		},
		{
			title: "Add Chat",
			icon: <ChatIcon />,
			// onClick: () => showLogForm(true),
			label: "Log",
		},
		{
			title: "Add Task",
			icon: <TimeIcon />,
			// onClick: () => showLogForm(true),
			label: "Task",
		},
		{
			title: "Add Meeting",
			icon: <CalendarIcon />,
			// onClick: () => showLogForm(true),
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

	return viewProfile ? (
		<Contacts
			setViewProfile={setViewProfile}
			selectedContact={selectedContact}
		/>
	) : (
		<CustomersList
			contacts={contacts}
			setViewProfile={setViewProfile}
			handleProfileView={handleProfileView}
			icons={QUICK_LINKS}
		/>
	);
};

export default Customers;
