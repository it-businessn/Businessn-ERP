const ContactList = ({ contacts }) => {
	return (
		<ul>
			{contacts.map((contact) => (
				<li key={contact.id}>{contact.name}</li>
			))}
		</ul>
	);
};

export default ContactList;
