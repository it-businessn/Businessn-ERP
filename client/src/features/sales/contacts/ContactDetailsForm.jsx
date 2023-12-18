import {
  AddIcon,
  CalendarIcon,
  ChatIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  TimeIcon,
} from "@chakra-ui/icons";
import {
  Avatar,
  Box,
  Button,
  Collapse,
  HStack,
  IconButton,
  Text,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import { FaBuilding } from "react-icons/fa";

const ContactDetailsForm = ({ contact, showLogForm }) => {
  contact.name = `${contact?.firstName} ${contact?.lastName}`;
  const { isOpen: isProfileOpen, onToggle: onProfileToggle } = useDisclosure({
    defaultIsOpen: true,
  });

  const { isOpen: isCompanyOpen, onToggle: onCompanyToggle } = useDisclosure({
    defaultIsOpen: true,
  });

  return (
    <Box px={15} pt={15}>
      <VStack align="center" justify="center" mb="4">
        <Avatar name=" " size="lg" bg="gray.300" position="relative">
          <FaBuilding className="header-logo" />
        </Avatar>
        <Box textAlign="center">
          <Text fontSize="xl" fontWeight="bold">
            {contact?.companyName}
          </Text>
          <Text fontSize="sm" fontWeight="bold">
            Primary Contact: {contact?.name}
          </Text>
        </Box>
      </VStack>
      <HStack spacing="4" mb="4" justifyContent="center">
        <IconButton
          icon={<AddIcon />}
          aria-label="Add Note"
          colorScheme="teal"
          borderRadius="full"
        />
        {/* <IconButton
          icon={<EmailIcon />}
          aria-label="Add Note"
          colorScheme="teal"
          borderRadius="full"
        />
        <IconButton
          icon={<PhoneIcon />}
          aria-label="Add Note"
          colorScheme="teal"
          borderRadius="full"
        /> */}
        <IconButton
          onClick={() => showLogForm(true)}
          icon={<ChatIcon />}
          aria-label="Add Log"
          colorScheme="teal"
          borderRadius="full"
        />
        <IconButton
          icon={<TimeIcon />}
          aria-label="Add Task"
          colorScheme="teal"
          borderRadius="full"
        />
        <IconButton
          icon={<CalendarIcon />}
          aria-label="Add Meeting"
          colorScheme="teal"
          borderRadius="full"
        />
      </HStack>
      <HStack ml="2px" spacing="6" mb="4" mt={"-1em"} justifyContent="center">
        <Text> Note</Text>
        {/* <Text> Email</Text>
        <Text>Call</Text> */}
        <Text>Log</Text>
        <Text>Task</Text>
        <Text>Meet</Text>
      </HStack>
      <Box mb="4">
        <Button onClick={onCompanyToggle} variant="link" fontSize="sm">
          {isCompanyOpen ? (
            <ChevronDownIcon fontSize="md" />
          ) : (
            <ChevronRightIcon fontSize="md" />
          )}
          Company Information
        </Button>
        <Collapse in={isCompanyOpen}>
          <Box p="4">
            <Text color="brand.400"> Name: </Text>
            <Text mb="2">{contact?.companyName}</Text>
            <Text color="brand.400">Industry Type:</Text>
            <Text mb="2">{contact?.industryType}</Text>
            <Text color="brand.400">Address:</Text>
            <Text mb="2">{contact?.companyAddress}</Text>
            <Text color="brand.400">Website :</Text>
            <Text mb="2">{contact?.revenue}</Text>
            <Text color="brand.400">Employees:</Text>
            <Text mb="2">{contact?.employees}</Text>
          </Box>
        </Collapse>
      </Box>
      <Box>
        <Button onClick={onProfileToggle} variant="link" fontSize="sm">
          {isProfileOpen ? (
            <ChevronDownIcon fontSize="md" />
          ) : (
            <ChevronRightIcon fontSize="md" />
          )}
          Primary Contact Information
        </Button>
        <Collapse in={isProfileOpen}>
          {contact && (
            <Box p="4">
              <Text color="brand.400">First Name: </Text>
              <Text mb="2">{contact?.firstName}</Text>
              <Text color="brand.400">Last Name:</Text>
              <Text mb="2">{contact?.lastName}</Text>
              <Text color="brand.400">Email:</Text>
              <Text mb="2">{contact?.email}</Text>
              <Text color="brand.400">Phone Number:</Text>
              <Text mb="2">{contact?.phone}</Text>
              <Text color="brand.400">Business Address:</Text>
              <Text mb="2">{contact?.primaryContactAddress}</Text>
            </Box>
          )}
        </Collapse>
      </Box>
    </Box>
  );
};

export default ContactDetailsForm;
