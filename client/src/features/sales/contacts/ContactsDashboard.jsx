import {
  Avatar,
  Box,
  Container,
  Flex,
  HStack,
  Heading,
  Spacer,
  Text,
  VStack,
} from "@chakra-ui/react";
import Loader from "features/Loader";
import { useEffect, useState } from "react";
import * as api from "services";

const ContactsDashboard = () => {
  const [contacts, setContacts] = useState(null);
  const fetchAllContacts = async () => {
    try {
      const response = await api.getContacts();
      setContacts(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchAllContacts();
  }, []);
  return (
    <Container maxW="container.xl" mt={10}>
      <Heading size="md">Overview</Heading>
      {!contacts && <Loader />}
      {contacts && (
        <Flex>
          <Box p={4} flex="1">
            <Text fontSize="lg" mb={4}>
              Contacts Overview
            </Text>
            <VStack align="start" spacing={4}>
              <Box>
                <Text fontSize="md">Total Contacts:</Text>
                <Heading size="lg">{contacts.length}</Heading>
              </Box>
            </VStack>
          </Box>

          <Spacer />

          <Box p={4} flex="2">
            <Text fontSize="lg" mb={4}>
              Contacts List
            </Text>
            <VStack align="start" spacing={4}>
              {contacts.map((contact) => (
                <HStack key={contact._id} spacing={4}>
                  <Avatar
                    size="md"
                    name={`${contact.firstName} ${contact.lastName}`}
                  />
                  <VStack align="start" spacing={2}>
                    <Text color="gray.500">{contact.companyName}</Text>
                    <Text>{`${contact.firstName} ${contact.lastName}`}</Text>
                  </VStack>
                </HStack>
              ))}
            </VStack>
          </Box>
        </Flex>
      )}
    </Container>
  );
};

export default ContactsDashboard;
