import {
	Box,
	Flex,
	IconButton,
	Tab,
	TabList,
	TabPanel,
	TabPanels,
	Tabs,
} from "@chakra-ui/react";
import Loader from "components/Loader";
import { useEffect, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import ContactService from "services/ContactService";
import ContactDetailsForm from "./ContactDetailsForm";
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
	const tabs = ["Notes", "Logs", "Tasks", "Meetings"];

	const tabList = tabs.map((item, index) => ({
		id: index,
		name: item,
	}));
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
						<ContactDetailsForm
							contact={contact.leadId}
							showLogForm={handleButtonClick}
						/>
					</Box>
					<Box flex="2" bg="var(--lead_cards_bg)">
						<Tabs
							isFitted
							variant="enclosed"
							index={currentTab}
							onChange={handleTabChange}
						>
							<TabList>
								{tabList.map((tab) => (
									<Tab
										key={tab.id}
										bg={
											currentTab === tab.id
												? "brand.primary_button_bg"
												: undefined
										}
										color={currentTab === tab.id ? "brand.100" : undefined}
									>
										{tab.name}
									</Tab>
								))}
							</TabList>
							<TabPanels>
								<TabPanel>
									<Notes contactId={contact?._id} />
								</TabPanel>
								<TabPanel>
									<Logs contactId={contact?._id} />
								</TabPanel>
								<TabPanel>
									<Tasks contactId={contact?._id} />
								</TabPanel>
								<TabPanel>
									<Meetings contactId={contact?._id} />
								</TabPanel>
							</TabPanels>
						</Tabs>
					</Box>
				</>
			)}
		</Flex>
	);
};

export default Contacts;
