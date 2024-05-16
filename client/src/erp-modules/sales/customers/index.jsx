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
		/>
	);
};

export default Customers;
