import { ArrowForwardIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Container,
  Flex,
  HStack,
  Icon,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  Spacer,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import Loader from "features/Loader";
import { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { MdOutlineFilterList } from "react-icons/md";
import { PiUserSquareBold } from "react-icons/pi";
import { RiMore2Fill } from "react-icons/ri";
import * as api from "services";

const CustomersDashboard = () => {
  const [contacts, setContacts] = useState(null);
  const fetchAllContacts = async () => {
    try {
      const response = await api.getContacts();
      response.data.map((item) => (item.comm = "Meeting"));
      setContacts(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchAllContacts();
  }, []);
  return (
    <Container maxW="container.xxl" mt={5}>
      <Box
        p="4"
        bg={"brand.primary_bg"}
        border="2px solid white"
        borderRadius="10px"
        color={"brand.nav_color"}
      >
        <Flex>
          <Text fontSize="lg" fontWeight="bold">
            Customers
          </Text>
          <Spacer />
          <HStack w={"50%"} spacing={3} justify={"flex-end"}>
            <Button
              color={"brand.nav_color"}
              leftIcon={<MdOutlineFilterList />}
              border={"2px solid #d3d3d3"}
              borderRadius={"10px"}
              variant={"ghost"}
              _hover={{ color: "brand.600", bg: "transparent" }}
              ml={2}
            >
              Filter
            </Button>
            <InputGroup
              w={"40%"}
              borderRadius={"10px"}
              border={"1px solid #d3d3d3"}
              fontSize="sm"
              fontWeight="bold"
            >
              <InputLeftElement children={<FaSearch />} />
              <Input
                _placeholder={{
                  color: "brand.nav_color",
                  fontSize: "sm",
                }}
                color={"brand.nav_color"}
                bg={"brand.primary_bg"}
                type="text"
                placeholder="Search here"
                pr="4.5rem"
              />
            </InputGroup>
            <Button
              bg={"#537eee"}
              color={"brand.primary_bg"}
              variant={"solid"}
              _hover={{ color: "brand.600" }}
              borderRadius={"10px"}
            >
              Add new customer
            </Button>
          </HStack>
        </Flex>
        {!contacts && <Loader />}
        {contacts && (
          <Table color={"brand.nav_color"} bg={"brand.primary_bg"}>
            <Thead>
              <Tr>
                <Th fontWeight={"bolder"} p={0}>
                  Customer name
                </Th>
                <Th fontWeight={"bolder"}>Company </Th>
                <Th fontWeight={"bolder"}>Email</Th>
                <Th fontWeight={"bolder"}>Communication History</Th>
                <Th></Th>
                <Th></Th>
              </Tr>
            </Thead>
            <Tbody color={"brand.nav_color"}>
              {contacts.map((contact, index) => (
                <Tr key={contact._id}>
                  <Td fontSize={"xs"} p={0}>
                    {`${contact.firstName} ${contact.lastName}`}
                  </Td>
                  <Td fontSize={"xs"}>{contact.companyName}</Td>
                  <Td fontSize={"xs"}>{contact.email}</Td>
                  <Td fontSize={"xs"}>
                    <Flex align="center">
                      <HStack
                        bg={"#d4cfff"}
                        color={"#5e51c5"}
                        px={2}
                        borderRadius={"10px"}
                      >
                        <Icon as={PiUserSquareBold} />
                        <Text>{contact.comm}</Text>
                      </HStack>
                    </Flex>
                  </Td>
                  <Td fontSize={"xs"}>
                    <HStack>
                      <Button
                        bgGradient="linear-gradient(103deg, rgba(107,73,201,1) 0%, rgba(180,165,222,1) 43%, rgba(36,249,225,1) 100%);"
                        bgClip="text"
                        size={"xs"}
                        rightIcon={
                          <IconButton
                            icon={<ArrowForwardIcon />}
                            borderRadius="full"
                            color="purple.500"
                            size={"xs"}
                            bg={"#dedaf4"}
                            boxShadow="md"
                            _hover={{ bg: "#8385d5", color: "brand.100" }}
                          />
                        }
                        variant="link"
                      >
                        See full profile
                      </Button>
                    </HStack>
                  </Td>
                  <Td>
                    <IconButton
                      icon={<RiMore2Fill />}
                      size="sm"
                      variant="ghost"
                      // onClick={() => handleEdit(row.id)}
                    />
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        )}
      </Box>
    </Container>
  );
};

export default CustomersDashboard;