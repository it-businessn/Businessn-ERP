import {
  Badge,
  Box,
  Button,
  Card,
  Container,
  Flex,
  HStack,
  Heading,
  Icon,
  Image,
  SimpleGrid,
  Text,
  VStack,
  useBreakpointValue
} from "@chakra-ui/react";
import { trainingChartData } from "constant";
import { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { FaDownload } from "react-icons/fa";
import * as api from "services";
import bookCover from "../../../assets/logos/BusinessN_all.jpg";
const Resources = () => {
  const isMobileView = useBreakpointValue({ base: true, sm: false });
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

  const activityChartOptions = {
    cutout: "40%",
    plugins: {
      datalabels: {
        display: false,
      },
    },
  };
  useEffect(() => {
    fetchAllContacts();
  }, []); const [selectedFilter, setSelectedFilter] = useState('all');

  const filters = ['All', 'Category 1', 'Category 2', 'Category 3'];

  const handleFilterClick = (filter) => {
    setSelectedFilter(filter);
  };
  return (
    <Container maxW="container.xxl"
      mt={5}>
      {isMobileView && <Text fontSize="lg" fontWeight="bold">
        Resources
      </Text>}
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing="5" >
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing="5" my="5">
          <Box
            p="4"
            bg={"brand.primary_bg"}
            border="3px solid white"
            borderRadius="10px"
            fontWeight="bold"
            color={"brand.nav_color"}
          >
            <Text fontSize="lg" fontWeight="bold" mt="2" mb="2">
              Training
            </Text>
            <Doughnut data={trainingChartData} options={activityChartOptions} />
            <Box display="flex" justifyContent="center" mt="2">
              <HStack mr="4">
                <Box w="1rem" h="1rem" bg="#517ae8" mr="1" />
                <Text fontSize="xs">Completed 65%</Text>
              </HStack>
              <HStack>
                <Box w="1rem" h="1rem" bg="#8aa8ee" mr="1" />
                <Text fontSize="xs">Ongoing 10%</Text>
              </HStack>
            </Box>
          </Box>
          <Box w={{ base: "auto", md: "310%" }}
            p="4"
            bg={"brand.primary_bg"}
            border="3px solid white"
            borderRadius="10px"
            fontWeight="bold"
            color={"brand.nav_color"}
          ><Text mt={2} fontSize="lg" fontWeight="bold">
              Your Overall Results
            </Text>
            <SimpleGrid columns={{ base: 1, md: 3 }} minH={{ base: "auto", md: "90%" }} spacing="5">
              <Box
                p="4" h={{ base: "120%", md: "80%" }} my={"auto"}
                bg={"brand.primary_bg"}
                border="3px solid white"
                borderRadius="10px"
                fontWeight="bold" display="flex" flexDir="column" justifyContent="space-evenly" alignItems="flex-start"

              >
                <Text
                  color={"brand.nav_color"} fontSize="sm" fontWeight="bold">
                  Assessment 1
                </Text>
                <Text fontSize="sm" fontWeight="bold">
                  Know your customer
                </Text>
                <Badge bg="green" color="white" >EXCELLENT</Badge>
                <Text
                  color={"brand.nav_color"} fontSize="sm" fontWeight="bold">
                  Your result
                </Text>
                <Heading fontWeight="bold">
                  8/10
                </Heading>
              </Box>
              <Box
                p="4" h={{ base: "120%", md: "80%" }} my={"auto"}
                bg={"brand.primary_bg"}
                border="3px solid white"
                borderRadius="10px"
                fontWeight="bold" display="flex" flexDir="column" justifyContent="space-evenly" alignItems="flex-start"

              >
                <Text
                  color={"brand.nav_color"} fontSize="sm" fontWeight="bold">
                  Assessment 2
                </Text>
                <Text fontSize="sm" fontWeight="bold">
                  Know the product a
                </Text>
                <Heading></Heading><Heading></Heading><Heading color="transparent">ss</Heading>
                <Button w={"100%"}
                  bg={"#537eee"}
                  color={"brand.primary_bg"}
                  variant={"solid"}
                  _hover={{ color: "brand.600" }}
                  borderRadius={"10px"}
                >
                  Take Assessment
                </Button>
              </Box><Box
                p="4" h={{ base: "120%", md: "80%" }} my={"auto"}
                bg={"brand.primary_bg"}
                border="3px solid white"
                borderRadius="10px"
                fontWeight="bold" display="flex" flexDir="column" justifyContent="space-evenly" alignItems="flex-start"

              >
                <Text
                  color={"brand.nav_color"} fontSize="sm" fontWeight="bold">
                  Assessment 3
                </Text>
                <Text fontSize="sm" fontWeight="bold">
                  Know the product b
                </Text>
                <Heading></Heading><Heading></Heading><Heading color="transparent">ss</Heading>
                <Button w={"100%"}
                  bg={"#537eee"}
                  color={"brand.primary_bg"}
                  variant={"solid"}
                  _hover={{ color: "brand.600" }}
                  borderRadius={"10px"}
                >
                  Take Assessment
                </Button>
              </Box>
            </SimpleGrid></Box>
        </SimpleGrid>


      </SimpleGrid><Text mt={2} mb={5} fontSize="lg" fontWeight="bold">
        Browse by subject
      </Text>
      {
        isMobileView ? <SimpleGrid columns={{ base: 2 }} spacing="5" my="5">
          <Button borderRadius={"50px"} p={"1em"}
            color={selectedFilter === "Scripts".toLowerCase() ? '#4c67c3' : '#676e78'}
            onClick={() => handleFilterClick("scripts")}
            variant={"outline"} leftIcon={<Icon as={FaDownload} />} size="sm">
            Scripts
          </Button>
          <Button borderRadius={"50px"} color="#676e78" p={"1em"}
            variant={"outline"} leftIcon={<Icon as={FaDownload} />} size="sm">
            Product Knowledge
          </Button><Button borderRadius={"50px"} color="#676e78" p={"1em"}
            variant={"outline"} leftIcon={<Icon as={FaDownload} />} size="sm">
            Employee Handbook
          </Button><Button borderRadius={"50px"} color="#676e78" p={"1em"}
            variant={"outline"} leftIcon={<Icon as={FaDownload} />} size="sm">
            Associated
          </Button><Button borderRadius={"50px"} color="#676e78" p={"1em"}
            variant={"outline"} leftIcon={<Icon as={FaDownload} />} size="sm">
            Training Resources
          </Button></SimpleGrid> : <Flex gap="1em">
          <Button borderRadius={"50px"} p={"1em"}
            color={selectedFilter === "Scripts".toLowerCase() ? '#4c67c3' : '#676e78'}
            onClick={() => handleFilterClick("scripts")}
            variant={"outline"} leftIcon={<Icon as={FaDownload} />} size="sm">
            Scriptss
          </Button>
          <Button borderRadius={"50px"} color="#676e78" p={"1em"}
            variant={"outline"} leftIcon={<Icon as={FaDownload} />} size="sm">
            Product Knowledge
          </Button><Button borderRadius={"50px"} color="#676e78" p={"1em"}
            variant={"outline"} leftIcon={<Icon as={FaDownload} />} size="sm">
            Employee Handbook
          </Button><Button borderRadius={"50px"} color="#676e78" p={"1em"}
            variant={"outline"} leftIcon={<Icon as={FaDownload} />} size="sm">
            Associated
          </Button><Button borderRadius={"50px"} color="#676e78" p={"1em"}
            variant={"outline"} leftIcon={<Icon as={FaDownload} />} size="sm">
            Training Resources
          </Button>
        </Flex>
      }

      <SimpleGrid columns={{ base: 1, md: 5 }} spacing="5" my="5">
        <Box
          p="4"
          bg={"brand.primary_bg"}
          border="3px solid white"
          borderRadius="10px"
          fontWeight="bold"
        ><VStack spacing={"1em"}>
            <Card maxW="md" borderRadius="0" overflow="hidden">
              <Image src={bookCover} alt={"book.title"} />

            </Card> <Button w={"100%"}
              bg={"#537eee"}
              color={"brand.primary_bg"}
              variant={"solid"}
              _hover={{ color: "brand.600" }}
              borderRadius={"10px"}
            >
              Download
            </Button></VStack>
        </Box>

        <Box
          p="4"
          bg={"brand.primary_bg"}
          border="3px solid white"
          borderRadius="10px"
          fontWeight="bold"
        ><VStack spacing={"1em"}>
            <Card maxW="md" borderRadius="0" overflow="hidden">
              <Image src={bookCover} alt={"book.title"} />

            </Card> <Button w={"100%"}
              bg={"#537eee"}
              color={"brand.primary_bg"}
              variant={"solid"}
              _hover={{ color: "brand.600" }}
              borderRadius={"10px"}
            >
              Download
            </Button></VStack>
        </Box>  <Box
          p="4"
          bg={"brand.primary_bg"}
          border="3px solid white"
          borderRadius="10px"
          fontWeight="bold"
        ><VStack spacing={"1em"}>
            <Card maxW="md" borderRadius="0" overflow="hidden">
              <Image src={bookCover} alt={"book.title"} />

            </Card> <Button w={"100%"}
              bg={"#537eee"}
              color={"brand.primary_bg"}
              variant={"solid"}
              _hover={{ color: "brand.600" }}
              borderRadius={"10px"}
            >
              Download
            </Button></VStack>
        </Box>  <Box
          p="4"
          bg={"brand.primary_bg"}
          border="3px solid white"
          borderRadius="10px"
          fontWeight="bold"
        ><VStack spacing={"1em"}>
            <Card maxW="md" borderRadius="0" overflow="hidden">
              <Image src={bookCover} alt={"book.title"} />

            </Card> <Button w={"100%"}
              bg={"#537eee"}
              color={"brand.primary_bg"}
              variant={"solid"}
              _hover={{ color: "brand.600" }}
              borderRadius={"10px"}
            >
              Download
            </Button></VStack>
        </Box>  <Box
          p="4"
          bg={"brand.primary_bg"}
          border="3px solid white"
          borderRadius="10px"
          fontWeight="bold"
        ><VStack spacing={"1em"}>
            <Card maxW="md" borderRadius="0" overflow="hidden">
              <Image src={bookCover} alt={"book.title"} />

            </Card> <Button w={"100%"}
              bg={"#537eee"}
              color={"brand.primary_bg"}
              variant={"solid"}
              _hover={{ color: "brand.600" }}
              borderRadius={"10px"}
            >
              Download
            </Button></VStack>
        </Box>
      </SimpleGrid>
    </Container >
  );
};

export default Resources;
