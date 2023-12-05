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
  const tabs = ["Notes", "Logs", "Tasks", "Meetings"];

  const tabList = tabs.map((item, index) => ({
    id: index,
    name: item,
  }));
  return (
    <Flex>
      <Box flex="1">
        <ContactDetails showLogForm={handleButtonClick} />
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
