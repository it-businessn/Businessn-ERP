import {
  AddIcon,
  CalendarIcon,
  ChatIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  EmailIcon,
  PhoneIcon,
  TimeIcon,
} from "@chakra-ui/icons";
import {
  Avatar,
  Box,
  Button,
  Collapse,
  HStack,
  Heading,
  IconButton,
  Text,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";

const ContactDetails = ({ showLogForm }) => {
  const { isOpen: isProfileOpen, onToggle: onProfileToggle } = useDisclosure({
    defaultIsOpen: true,
  });
  const { isOpen: isCompanyOpen, onToggle: onCompanyToggle } = useDisclosure({
    defaultIsOpen: true,
  });
  const contactDetails = {
    name: "Admin One",
    firstName: "Admin ",
    lastName: "One",
    position: "CEO",
    email: "john@example.com",
    phone: "+1 123-456-7890",
    address: "123 Main St, Cityville, USA",
    birthday: "January 1, 1990",
  };
  const companyDetails = {
    companyName: "ABC Inc.",
    industry: "Technology",
    address: "456 Tech Blvd, Tech City, USA",
    revenue: "$10 million",
    employees: "1000+",
  };

  return (
    <Box px={15} pt={20}>
      <VStack align="center" justify="center" mb="4">
        <Avatar name={contactDetails.name} size="lg" />
        <Box textAlign="center">
          <Heading>{contactDetails.name}</Heading>
          <Text>{contactDetails.position}</Text>
        </Box>
      </VStack>

      <HStack spacing="4" mb="4" justifyContent="center">
        <IconButton
          icon={<AddIcon />}
          aria-label="Add Note"
          colorScheme="teal"
          borderRadius="full"
        />
        <IconButton
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
        />
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
      <HStack spacing="6" mb="4" mt={"-1em"} justifyContent="center">
        <Text> Note</Text>
        <Text> Email</Text>
        <Text>Call</Text>
        <Text>Log</Text>
        <Text>Tasks</Text>
        <Text>Meet</Text>
      </HStack>
      <Box mb="4">
        <Button onClick={onProfileToggle} variant="link" fontSize="sm">
          {isProfileOpen ? (
            <ChevronDownIcon fontSize="md" />
          ) : (
            <ChevronRightIcon fontSize="md" />
          )}
          Contact Profile Details
        </Button>
        <Collapse in={isProfileOpen}>
          <Box p="4">
            <Text color="brand.400">First Name: </Text>
            <Text mb="2">{contactDetails.firstName}</Text>
            <Text color="brand.400">Last Name:</Text>
            <Text mb="2">{contactDetails.lastName}</Text>
            <Text color="brand.400">Phone:</Text>
            <Text mb="2">{contactDetails.phone}</Text>
            <Text color="brand.400">Email:</Text>
            <Text mb="2">{contactDetails.email}</Text>
            <Text color="brand.400">Address:</Text>
            <Text mb="2">{contactDetails.address}</Text>
          </Box>
        </Collapse>
      </Box>

      <Box>
        <Button onClick={onCompanyToggle} variant="link" fontSize="sm">
          {isCompanyOpen ? (
            <ChevronDownIcon fontSize="md" />
          ) : (
            <ChevronRightIcon fontSize="md" />
          )}
          Company Profile Details
        </Button>
        <Collapse in={isCompanyOpen}>
          <Box p="4">
            <Text color="brand.400">Company: </Text>
            <Text mb="2">{companyDetails.companyName}</Text>
            <Text color="brand.400">Industry:</Text>
            <Text mb="2">{companyDetails.industry}</Text>
            <Text color="brand.400">Address:</Text>
            <Text mb="2">{companyDetails.address}</Text>
            <Text color="brand.400">Revenue:</Text>
            <Text mb="2">{companyDetails.revenue}</Text>
            <Text color="brand.400">Employees:</Text>
            <Text mb="2">{companyDetails.employees}</Text>
          </Box>
        </Collapse>
      </Box>
    </Box>
  );
};

export default ContactDetails;
