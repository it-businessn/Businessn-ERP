import { Box, Flex, IconButton } from "@chakra-ui/react";
import Loader from "components/Loader";
import TabGroup from "components/ui/tab";
import { useEffect, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import ContactService from "services/ContactService";
import ContactDetailsInfo from "./ContactDetailsInfo";
import Logs from "./logs";
import Meetings from "./meeting";
import Notes from "./notes/Notes";
import Tasks from "./tasks";

const Contacts = ({ setViewProfile, selectedContact }) => {
	const { id } = useParams();

	const [contact, setContact] = useState(null);
	const [reload, setReload] = useState(false);
	const fetchContacts = async () => {
		const o = selectedContact || id;
		try {
			const response = await ContactService.getContactDetails(o);

			setContact(response.data);
			// setSelectedContact(response.data);
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		fetchContacts();
	}, []);
	useEffect(() => {}, [reload]);

	const [currentTab, setCurrentTab] = useState(0);
	const handleButtonClick = (value) => {
		setCurrentTab(value ? 1 : currentTab);
	};
	const handleTabChange = (index) => {
		setCurrentTab(index);
	};

	const tabList = [
		{ name: "Notes", component: <Notes contactId={contact?._id} /> },
		{ name: "Logs", component: <Logs contactId={contact?._id} /> },
		{ name: "Tasks", component: <Tasks contactId={contact?._id} /> },
		{ name: "Meetings", component: <Meetings contactId={contact?._id} /> },
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
		<Flex>
			{!contact && <Loader />}

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
						/>
					</Box>
				</>
			)}
		</Flex>
	);
};

export default Contacts;
