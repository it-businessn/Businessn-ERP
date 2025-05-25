import {
  HStack,
  Stack,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Box,
  Progress,
  Text,
  Flex,
  useColorModeValue,
  IconButton,
} from "@chakra-ui/react";
import { useState } from "react";
import { ViewIcon } from "@chakra-ui/icons";
import BoxCard from "components/ui/card";
import NormalTextTitle from "components/ui/NormalTextTitle";
import TextTitle from "components/ui/text/TextTitle";
import { TICKET_ACTION } from "erp-modules/payroll/timesheets/data";

const CategoryFilter = ({ name, data, isMyChannel, presentTitle, filterTicket, filterName }) => {
  const [selectedTab, setSelectedTab] = useState(0);

  const pending = isMyChannel
    ? data?.find(({ _id }) => _id === TICKET_ACTION.OPEN)?.count
    : data?.statuses?.find(({ status }) => status === TICKET_ACTION.OPEN)?.count;

  const onHold = isMyChannel
    ? data?.find(({ _id }) => _id === TICKET_ACTION.ON_HOLD)?.count
    : data?.statuses?.find(({ status }) => status === TICKET_ACTION.ON_HOLD)?.count;

  const inProgress = isMyChannel
    ? data?.find(({ _id }) => _id === TICKET_ACTION.PROGRESS)?.count
    : data?.statuses?.find(({ status }) => status === TICKET_ACTION.PROGRESS)?.count;

  const totalTickets = (pending || 0) + (onHold || 0) + (inProgress || 0);

  const handleTabChange = (index) => {
    setSelectedTab(index);
    filterTicket(name);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case TICKET_ACTION.OPEN:
        return "var(--open)";
      case TICKET_ACTION.ON_HOLD:
        return "var(--ticket_hold)";
      case TICKET_ACTION.PROGRESS:
        return "var(--ticket_progress)";
      default:
        return "gray.500";
    }
  };

  const handlePresent = (name) => {
    filterTicket(name);
  };

  return (
    <BoxCard
      boxShadow="0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
      p={4}
      borderWidth="0"
      borderRadius="1em"
      minW="300px"
      bg="white"
      transition="all 0.2s"
      _hover={{
        boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
      }}
    >
      <Stack spacing={4}>
        <Tabs variant="unstyled" onChange={handleTabChange} index={selectedTab}>
          <TabList>
            <Tab
              _selected={{
                color: "black",
                borderBottom: "2px solid",
                borderColor: "var(--nav_menu)",
              }}
            >
              {isMyChannel ? `${name} Channel` : name}
              <Text ml={2} fontSize="sm" color="gray.500">
                ({totalTickets})
              </Text>
            </Tab>
          </TabList>
        </Tabs>

        <Box>
          <Progress
            value={100}
            size="sm"
            borderRadius="full"
            bg="gray.100"
            sx={{
              "& > div": {
                backgroundImage: `linear-gradient(to right, 
                  var(--open) ${(pending / totalTickets) * 100}%, 
                  var(--ticket_hold) ${(pending / totalTickets) * 100}% ${
                  ((pending + onHold) / totalTickets) * 100
                }%, 
                  var(--ticket_progress) ${((pending + onHold) / totalTickets) * 100}% 100%)`,
              },
            }}
          />

          <Flex justify="space-between" mt={2}>
            <Stack spacing={1}>
              <Text fontSize="sm" color="var(--open)">
                {pending || 0} {TICKET_ACTION.OPEN}
              </Text>
              <Text fontSize="sm" color="var(--ticket_hold)">
                {onHold || 0} {TICKET_ACTION.ON_HOLD}
              </Text>
              <Text fontSize="sm" color="var(--ticket_progress)">
                {inProgress || 0} {TICKET_ACTION.PROGRESS}
              </Text>
            </Stack>

            <IconButton
              aria-label={filterName?.includes(name) ? "Presenting" : "Present"}
              icon={<ViewIcon />}
              onClick={() => handlePresent(name)}
              colorScheme={filterName?.includes(name) ? "blue" : "gray"}
              variant="ghost"
              size="sm"
              _hover={{
                bg: "gray.100",
              }}
            />
          </Flex>
        </Box>
      </Stack>
    </BoxCard>
  );
};

export default CategoryFilter;
