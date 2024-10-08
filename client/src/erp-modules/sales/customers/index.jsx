import { AddIcon, CalendarIcon, ChatIcon, TimeIcon } from "@chakra-ui/icons";

import useCompany from "hooks/useCompany";
import { useEffect, useState } from "react";
import ContactService from "services/ContactService";
import LocalStorageService from "services/LocalStorageService";
import { isManager } from "utils";
import CustomersList from "./CustomersList";
import Contacts from "./contacts";

const Customers = () => {
	const { company } = useCompany(
		LocalStorageService.getItem("selectedCompany"),
	);
	const [contacts, setContacts] = useState(null);
	const [viewProfile, setViewProfile] = useState(false);
	const [selectedContact, setSelectedContact] = useState(null);
	const loggedInUser = LocalStorageService.getItem("user");

	const isUserManager = isManager(loggedInUser?.role);

	const [isAdded, setIsAdded] = useState(false);
	const fetchAllContacts = async () => {
		try {
			const response = await ContactService.getCompContacts(company);
			response.data.map((_) => (_.stage = _.leadId?.stage));
			const filterContacts = response.data.filter((_) => _.stage === "T4");

			setContacts(
				isUserManager
					? filterContacts
					: filterContacts?.filter(
							(lead) =>
								lead.leadId.primaryAssignee[0]?.name === loggedInUser.fullName,
					  ),
			);
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		fetchAllContacts();
	}, [company, isAdded]);

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
			contacts={contacts}
			setViewProfile={setViewProfile}
			handleProfileView={handleProfileView}
			icons={QUICK_LINKS}
			company={company}
			setIsAdded={setIsAdded}
			user={loggedInUser}
		/>
	);
};

export default Customers;
