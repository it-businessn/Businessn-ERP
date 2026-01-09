import { AddIcon, CalendarIcon, ChatIcon, TimeIcon } from "@chakra-ui/icons";

import { useState } from "react";
import LocalStorageService from "services/LocalStorageService";
import CustomersList from "./CustomersList";
import Contacts from "./contacts";

const Customers = () => {
	const company = LocalStorageService.getItem("selectedCompany");
	const [viewProfile, setViewProfile] = useState(false);
	const [selectedContact, setSelectedContact] = useState(null);
	const loggedInUser = LocalStorageService.getItem("user");

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
			company={company}
			user={loggedInUser}
		/>
	) : (
		<CustomersList
			setViewProfile={setViewProfile}
			handleProfileView={handleProfileView}
			icons={QUICK_LINKS}
			company={company}
			user={loggedInUser}
		/>
	);
};

export default Customers;
