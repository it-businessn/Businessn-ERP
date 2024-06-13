import { Box, Flex, IconButton } from "@chakra-ui/react";
import Loader from "components/Loader";
import TabGroup from "components/ui/tab";
import { useEffect, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import ContactService from "services/ContactService";
import LocalStorageService from "services/LocalStorageService";
import ContactDetailsInfo from "../customers/contacts/ContactDetailsInfo";
import Logs from "../customers/contacts/logs";
import Meetings from "../customers/contacts/meeting";
import Notes from "../customers/contacts/notes/Notes";
import Tasks from "../customers/contacts/tasks";

const LeadContacts = ({ setViewProfile, selectedContact, company }) => {
	const { id, comp } = useParams();

	const user = LocalStorageService.getItem("user");
	const companyName = comp ? comp : company;

	const [contact, setContact] = useState(null);
	const fetchContacts = async () => {
		const activeContact = selectedContact || id;
		try {
			const response = await ContactService.getContactDetails({
				id: activeContact,
				company: companyName,
			});
			setContact(response.data);
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		fetchContacts();
	}, [company]);

	const [currentTab, setCurrentTab] = useState(0);
	const handleButtonClick = (value) => {
		setCurrentTab(value ? 1 : currentTab);
	};
	const handleTabChange = (index) => {
		setCurrentTab(index);
	};

	const tabList = [
		{
			name: "Notes",
			component: (
				<Notes user={user} contactId={contact?._id} company={company} />
			),
		},
		{
			name: "Logs",
			component: (
				<Logs user={user} contactId={contact?._id} company={company} />
			),
		},
		{
			name: "Tasks",
			component: (
				<Tasks user={user} contactId={contact?._id} company={company} />
			),
		},
		{
			name: "Meetings",
			component: (
				<Meetings user={user} contactId={contact?._id} company={company} />
			),
		},
	];

	const navigate = useNavigate();
	return (
		<Box px={{ base: "1em" }} py={{ base: "1.3em" }}>
			<Flex>
				{contact && (
					<>
						<IconButton
							variant={"ghost"}
							icon={<FaArrowLeft />}
							color="brand.nav_color"
							aria-label="Cancel"
							onClick={() =>
								id ? navigate(-1) : setViewProfile((prev) => !prev)
							}
						/>
						<Box flex="1">
							<ContactDetailsInfo
								contact={contact.leadId}
								showLogForm={handleButtonClick}
							/>
						</Box>
						<Box flex="2" bg="var(--lead_cards_bg)">
							<TabGroup
								currentTab={currentTab}
								handleTabChange={handleTabChange}
								data={tabList}
								id={"name"}
							/>
						</Box>
					</>
				)}
			</Flex>
		</Box>
	);
};

export default LeadContacts;
