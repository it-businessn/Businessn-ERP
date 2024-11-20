import { Box, Flex, IconButton } from "@chakra-ui/react";
import TabGroup from "components/ui/tab";
import { useEffect, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import ContactService from "services/ContactService";
import ContactDetailsInfo from "./ContactDetailsInfo";
import Logs from "./logs";
import Meetings from "./meeting";
import Notes from "./notes/Notes";
// import Tasks from "./tasks";

const Contacts = ({ setViewProfile, selectedContact, company, user }) => {
	const { id, comp } = useParams();
	const [contact, setContact] = useState(null);

	const fetchContacts = async () => {
		const activeContact = selectedContact || id;
		try {
			const response = await ContactService.getContactDetails({
				id: activeContact,
				company: comp || company,
			});

			setContact(response.data);
			// setSelectedContact(response.data);
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
				<Notes
					currentTab={currentTab}
					user={user}
					contactId={selectedContact || id}
					company={comp || company}
				/>
			),
		},
		{
			name: "Logs",
			component: (
				<Logs
					currentTab={currentTab}
					user={user}
					contactId={selectedContact || id}
					company={comp || company}
				/>
			),
		},
		// {
		// 	name: "Tasks",
		// 	component: (
		// 		<Tasks user={user} contactId={contact?._id} company={company} />
		// 	),
		// },
		{
			name: "Meetings",
			component: (
				<Meetings
					currentTab={currentTab}
					user={user}
					contactId={selectedContact || id}
					company={comp || company}
				/>
			),
		},
	];

	const [filter, setFilter] = useState("");
	// const [showList, setShowList] = useState(false);
	// const filteredContacts = contact.filter(
	// 	(contact) =>
	// 		contact.companyName.toLowerCase().includes(filter.toLowerCase()) ||
	// 		contact.firstName.toLowerCase().includes(filter.toLowerCase()),
	// );
	// const handleSelectedContact = (contact) => {
	// 	// setSelectedContact((prev) => contact);
	// 	setShowList((prev) => false);
	// 	setReload(true);
	// };
	const navigate = useNavigate();
	return (
		<Box px={{ base: "1em" }} py={{ base: "1.3em" }}>
			<Flex>
				<IconButton
					variant={"ghost"}
					icon={<FaArrowLeft />}
					color="var(--nav_color)"
					aria-label="Cancel"
					onClick={() => (id ? navigate(-1) : setViewProfile((prev) => !prev))}
				/>
				<Box minW={{ base: "auto", xl: "300px" }}>
					{/* <Popover zIndex={0}>
							{/* <PopoverTrigger>
								<Input
									zIndex={0}
									type="text"
									placeholder="Search Contact..."
									value={contact}
									// onClick={() => setShowList(true)}
									onChange={(e) => setFilter(e.target.value)}
								/>
							</PopoverTrigger> 
							{showList && (
								<PopoverContent zIndex={0}>
									<PopoverArrow />
									<PopoverBody>
										{filteredContacts.map((contact, index) => (
											<div
												key={contact}
												onClick={() => handleSelectedContact(contact)}
											>
												<Box
													key={contact.companyName}
													borderBottomWidth="1px"
													py={2}
												>
													<HStack>
														<Text>
															{contact.firstName} {contact.lastName}
														</Text>
														<Text fontWeight="bold">
															Client: {contact.companyName}
														</Text>
													</HStack>
												</Box>
											</div>
										))}
									</PopoverBody>
								</PopoverContent>
							)}
						</Popover> */}
					{contact && (
						<ContactDetailsInfo contact={contact?.leadId} showLogForm={handleButtonClick} />
					)}
				</Box>
				<Box bg="var(--lead_cards_bg)" w={"100%"}>
					<TabGroup
						currentTab={currentTab}
						handleTabChange={handleTabChange}
						data={tabList}
						id={"name"}
					/>
				</Box>
			</Flex>
		</Box>
	);
};

export default Contacts;
