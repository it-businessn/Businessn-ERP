import {
  Box,
  Flex,
  HStack,
  Input,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from "@chakra-ui/react";
import Loader from "features/Loader";
import { useEffect, useState } from "react";
import * as api from "services";
import ContactDetailsForm from "./ContactDetailsForm";
import Logs from "./logs";
import Meetings from "./meeting";
import Notes from "./notes/Notes";
import Tasks from "./tasks";

const Contacts = () => {
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [reload, setReload] = useState(false);

  const fetchContacts = async () => {
    try {
      const response = await api.getContacts();
      setContacts(response.data);
      setSelectedContact(response.data.length > 0 ? response.data[0] : []);
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
  const [showList, setShowList] = useState(false);
  const filteredContacts = contacts.filter(
    (contact) =>
      contact.companyName.toLowerCase().includes(filter.toLowerCase()) ||
      contact.firstName.toLowerCase().includes(filter.toLowerCase())
  );
  const handleSelectedContact = (contact) => {
    setSelectedContact((prev) => contact);
    setShowList((prev) => false);
    setReload(true);
  };

  return (
    <Flex>
      {!selectedContact && <Loader />}
      {selectedContact?.length === 0 && (
        <Box p={4}>
          <Text>No contacts added. Please add a contact.</Text>
        </Box>
      )}

      {selectedContact && (
        <>
          <Box flex="1">
            <Popover zIndex={0}>
              <PopoverTrigger>
                <Input
                  zIndex={0}
                  type="text"
                  placeholder="Search Contact..."
                  value={filter}
                  onClick={() => setShowList(true)}
                  onChange={(e) => setFilter(e.target.value)}
                />
              </PopoverTrigger>
              {showList && (
                <PopoverContent zIndex={0}>
                  <PopoverArrow />
                  <PopoverBody>
                    {filteredContacts.map((contact, index) => (
                      <div
                        key={index}
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
            </Popover>
            {selectedContact && (
              <ContactDetailsForm
                contact={selectedContact}
                showLogForm={handleButtonClick}
              />
            )}
          </Box>
          <Box flex="2" bg="#eeeeee">
            <Tabs
              isFitted
              variant="enclosed"
              index={currentTab}
              onChange={handleTabChange}
            >
              <TabList>
                {tabList.map((tab, index) => (
                  <Tab
                    key={tab.id}
                    bg={currentTab === tab.id ? "brand.600" : undefined}
                    color={currentTab === tab.id ? "brand.100" : undefined}
                  >
                    {tab.name}
                  </Tab>
                ))}
              </TabList>
              <TabPanels>
                <TabPanel>
                  <Notes contactId={selectedContact?._id} />
                </TabPanel>
                <TabPanel>
                  <Logs contactId={selectedContact?._id} />
                </TabPanel>
                <TabPanel>
                  <Tasks contactId={selectedContact?._id} />
                </TabPanel>
                <TabPanel>
                  <Meetings contactId={selectedContact?._id} />
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
