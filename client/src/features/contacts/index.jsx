import {
  Box,
  Flex,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import * as api from "services";
import ContactDetails from "./ContactDetails";
import Meetings from "./Meetings";
import Notes from "./Notes";
import Logs from "./logs";
import Tasks from "./tasks";

const Contacts = () => {
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await api.getContacts();
        setContacts(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchContacts();
  }, []);
  const [showLogForm, setShowLogForm] = useState(false);
  const [currentTab, setCurrentTab] = useState(0);
  const handleButtonClick = (value) => {
    setCurrentTab(value ? 1 : currentTab);
  };
  const handleTabChange = (index) => {
    setCurrentTab(index);
  };
  return (
    <Flex>
      <Box flex="1">
        <ContactDetails showLogForm={handleButtonClick} />
      </Box>
      <Box flex="2" pt={10} bg="#eeeeee">
        <Tabs
          isFitted
          variant="enclosed"
          index={currentTab}
          onChange={handleTabChange}
        >
          <TabList mb="1em">
            <Tab>Notes</Tab>
            <Tab>Logs</Tab>
            <Tab>Tasks</Tab>
            <Tab>Meetings</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Notes />
            </TabPanel>
            <TabPanel>
              <Logs />
            </TabPanel>
            <TabPanel>
              <Tasks />
            </TabPanel>
            <TabPanel>
              <Meetings />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Flex>
  );
};

export default Contacts;
