import { ArrowDownIcon, ArrowUpIcon, CopyIcon } from "@chakra-ui/icons";
import {
  Box,
  Card,
  Flex,
  Icon,
  IconButton,
  Select,
  SimpleGrid,
  Text,
  VStack,
} from "@chakra-ui/react";

const FreshLeads = () => {
  return (
    <Box p={6} mt={{ base: "3em", md: 0 }}>
      <SimpleGrid
        columns={{ base: 1, md: 4 }}
        spacing="5"
        bg={"#f8f9fe"}
        color={"brand.200"}
      >
        <Box borderRadius="10px" border="3px solid white">
          <Box
            fontWeight="bold"
            p="4"
            bg={"#dbe5ff"}
            borderTopLeftRadius="10px"
            borderTopRightRadius="10px"
          >
            <Flex justify="space-between" align="center">
              <Text fontSize="sm" fontWeight="bold">
                Fresh Leads
              </Text>
              <Select width="100px" border={"none"} fontSize={"sm"}>
                <option>Weekly</option>
                <option>Last month</option>
              </Select>
            </Flex>
            <Flex align="center" color={"brand.600"}>
              <Text mr="3" fontSize="2em">
                1245
              </Text>
              <Icon mr="1" as={ArrowUpIcon} color="green.500" />
              <Text color="green.500" fontSize="xs">
                10%
              </Text>
            </Flex>
          </Box>
          <Card m="4" bg={"#eef0fc"} border={"1px solid #e3e5f1"}>
            <VStack align="flex-start" color={"brand.200"} fontSize="sm" p="4">
              <Text fontWeight="bold">Name of Company</Text>
              <Text fontWeight="bold" color={"brand.600"}>
                ABC
              </Text>
              <Text fontWeight="bold">Email</Text>
              <Text fontWeight="bold" color={"brand.600"}>
                abc@gmail.com
                <IconButton icon={<CopyIcon />} size={"xs"} color="brand.600" />
              </Text>
              <Text fontWeight="bold">Phone</Text>
              <Text fontWeight="bold" color={"brand.600"}>
                +123 456 6778
              </Text>
            </VStack>
          </Card>
          <Card m="4" bg={"#eef0fc"} border={"1px solid #e3e5f1"}>
            <VStack align="flex-start" color={"brand.200"} fontSize="sm" p="4">
              <Text fontWeight="bold">Name of Company</Text>
              <Text fontWeight="bold" color={"brand.600"}>
                ABC
              </Text>
              <Text fontWeight="bold">Email</Text>
              <Text fontWeight="bold" color={"brand.600"}>
                abc@gmail.com
                <IconButton icon={<CopyIcon />} size={"xs"} color="brand.600" />
              </Text>
              <Text fontWeight="bold">Phone</Text>
              <Text fontWeight="bold" color={"brand.600"}>
                +123 456 6778
              </Text>
            </VStack>
          </Card>
          <Card m="4" bg={"#eef0fc"} border={"1px solid #e3e5f1"}>
            <VStack align="flex-start" color={"brand.200"} fontSize="sm" p="4">
              <Text fontWeight="bold">Name of Company</Text>
              <Text fontWeight="bold" color={"brand.600"}>
                ABC
              </Text>
              <Text fontWeight="bold">Email</Text>
              <Text fontWeight="bold" color={"brand.600"}>
                abc@gmail.com
                <IconButton icon={<CopyIcon />} size={"xs"} color="brand.600" />
              </Text>
              <Text fontWeight="bold">Phone</Text>
              <Text fontWeight="bold" color={"brand.600"}>
                +123 456 6778
              </Text>
            </VStack>
          </Card>
          <Card m="4" bg={"#eef0fc"} border={"1px solid #e3e5f1"}>
            <VStack align="flex-start" color={"brand.200"} fontSize="sm" p="4">
              <Text fontWeight="bold">Name of Company</Text>
              <Text fontWeight="bold" color={"brand.600"}>
                ABC
              </Text>
              <Text fontWeight="bold">Email</Text>
              <Text fontWeight="bold" color={"brand.600"}>
                abc@gmail.com
                <IconButton icon={<CopyIcon />} size={"xs"} color="brand.600" />
              </Text>
              <Text fontWeight="bold">Phone</Text>
              <Text fontWeight="bold" color={"brand.600"}>
                +123 456 6778
              </Text>
            </VStack>
          </Card>
        </Box>
        <Box borderRadius="10px" border="3px solid white">
          <Box
            p="4"
            bg={"#c4f7d8"}
            fontWeight="bold"
            borderTopLeftRadius="10px"
            borderTopRightRadius="10px"
          >
            <Flex justify="space-between" align="center">
              <Text fontSize="sm" fontWeight="bold">
                Contacted
              </Text>
              <Select width="100px" border={"none"} fontSize={"sm"}>
                <option>Weekly</option>
                <option>Last month</option>
              </Select>
            </Flex>
            <Flex align="center" color={"brand.600"}>
              <Text mr="3" fontSize="2em">
                1245
              </Text>
              <Icon mr="1" as={ArrowUpIcon} color="green.500" />
              <Text color="green.500" fontSize="xs">
                10%
              </Text>
            </Flex>
          </Box>{" "}
          <Card m="4" bg={"#eef0fc"} border={"1px solid #e3e5f1"}>
            <VStack align="flex-start" color={"brand.200"} fontSize="sm" p="4">
              <Text fontWeight="bold">Name of Company</Text>
              <Text fontWeight="bold" color={"brand.600"}>
                ABC
              </Text>
              <Text fontWeight="bold">Email</Text>
              <Text fontWeight="bold" color={"brand.600"}>
                abc@gmail.com
                <IconButton icon={<CopyIcon />} size={"xs"} color="brand.600" />
              </Text>
              <Text fontWeight="bold">Phone</Text>
              <Text fontWeight="bold" color={"brand.600"}>
                +123 456 6778
              </Text>
            </VStack>
          </Card>
          <Card m="4" bg={"#eef0fc"} border={"1px solid #e3e5f1"}>
            <VStack align="flex-start" color={"brand.200"} fontSize="sm" p="4">
              <Text fontWeight="bold">Name of Company</Text>
              <Text fontWeight="bold" color={"brand.600"}>
                ABC
              </Text>
              <Text fontWeight="bold">Email</Text>
              <Text fontWeight="bold" color={"brand.600"}>
                abc@gmail.com
                <IconButton icon={<CopyIcon />} size={"xs"} color="brand.600" />
              </Text>
              <Text fontWeight="bold">Phone</Text>
              <Text fontWeight="bold" color={"brand.600"}>
                +123 456 6778
              </Text>
            </VStack>
          </Card>
          <Card m="4" bg={"#eef0fc"} border={"1px solid #e3e5f1"}>
            <VStack align="flex-start" color={"brand.200"} fontSize="sm" p="4">
              <Text fontWeight="bold">Name of Company</Text>
              <Text fontWeight="bold" color={"brand.600"}>
                ABC
              </Text>
              <Text fontWeight="bold">Email</Text>
              <Text fontWeight="bold" color={"brand.600"}>
                abc@gmail.com
                <IconButton icon={<CopyIcon />} size={"xs"} color="brand.600" />
              </Text>
              <Text fontWeight="bold">Phone</Text>
              <Text fontWeight="bold" color={"brand.600"}>
                +123 456 6778
              </Text>
            </VStack>
          </Card>
          <Card m="4" bg={"#eef0fc"} border={"1px solid #e3e5f1"}>
            <VStack align="flex-start" color={"brand.200"} fontSize="sm" p="4">
              <Text fontWeight="bold">Name of Company</Text>
              <Text fontWeight="bold" color={"brand.600"}>
                ABC
              </Text>
              <Text fontWeight="bold">Email</Text>
              <Text fontWeight="bold" color={"brand.600"}>
                abc@gmail.com
                <IconButton icon={<CopyIcon />} size={"xs"} color="brand.600" />
              </Text>
              <Text fontWeight="bold">Phone</Text>
              <Text fontWeight="bold" color={"brand.600"}>
                +123 456 6778
              </Text>
            </VStack>
          </Card>
        </Box>
        <Box borderRadius="10px" border="3px solid white">
          <Box
            p="4"
            bg={"#caeaf5"}
            fontWeight="bold"
            borderTopLeftRadius="10px"
            borderTopRightRadius="10px"
          >
            <Flex justify="space-between" align="center">
              <Text fontSize="sm" fontWeight="bold">
                Call Back
              </Text>
              <Select width="100px" border={"none"} fontSize={"sm"}>
                <option>Weekly</option>
                <option>Last month</option>
              </Select>
            </Flex>
            <Flex align="center" color={"brand.600"}>
              <Text mr="3" fontSize="2em">
                543
              </Text>
              <Icon mr="1" as={ArrowDownIcon} color="green.500" />
              <Text color="green.500" fontSize="xs">
                10%
              </Text>
            </Flex>
          </Box>{" "}
          <Card m="4" bg={"#eef0fc"} border={"1px solid #e3e5f1"}>
            <VStack align="flex-start" color={"brand.200"} fontSize="sm" p="4">
              <Text fontWeight="bold">Name of Company</Text>
              <Text fontWeight="bold" color={"brand.600"}>
                ABC
              </Text>
              <Text fontWeight="bold">Email</Text>
              <Text fontWeight="bold" color={"brand.600"}>
                abc@gmail.com
                <IconButton icon={<CopyIcon />} size={"xs"} color="brand.600" />
              </Text>
              <Text fontWeight="bold">Phone</Text>
              <Text fontWeight="bold" color={"brand.600"}>
                +123 456 6778
              </Text>
            </VStack>
          </Card>
          <Card m="4" bg={"#eef0fc"} border={"1px solid #e3e5f1"}>
            <VStack align="flex-start" color={"brand.200"} fontSize="sm" p="4">
              <Text fontWeight="bold">Name of Company</Text>
              <Text fontWeight="bold" color={"brand.600"}>
                ABC
              </Text>
              <Text fontWeight="bold">Email</Text>
              <Text fontWeight="bold" color={"brand.600"}>
                abc@gmail.com
                <IconButton icon={<CopyIcon />} size={"xs"} color="brand.600" />
              </Text>
              <Text fontWeight="bold">Phone</Text>
              <Text fontWeight="bold" color={"brand.600"}>
                +123 456 6778
              </Text>
            </VStack>
          </Card>
          <Card m="4" bg={"#eef0fc"} border={"1px solid #e3e5f1"}>
            <VStack align="flex-start" color={"brand.200"} fontSize="sm" p="4">
              <Text fontWeight="bold">Name of Company</Text>
              <Text fontWeight="bold" color={"brand.600"}>
                ABC
              </Text>
              <Text fontWeight="bold">Email</Text>
              <Text fontWeight="bold" color={"brand.600"}>
                abc@gmail.com
                <IconButton icon={<CopyIcon />} size={"xs"} color="brand.600" />
              </Text>
              <Text fontWeight="bold">Phone</Text>
              <Text fontWeight="bold" color={"brand.600"}>
                +123 456 6778
              </Text>
            </VStack>
          </Card>
          <Card m="4" bg={"#eef0fc"} border={"1px solid #e3e5f1"}>
            <VStack align="flex-start" color={"brand.200"} fontSize="sm" p="4">
              <Text fontWeight="bold">Name of Company</Text>
              <Text fontWeight="bold" color={"brand.600"}>
                ABC
              </Text>
              <Text fontWeight="bold">Email</Text>
              <Text fontWeight="bold" color={"brand.600"}>
                abc@gmail.com
                <IconButton icon={<CopyIcon />} size={"xs"} color="brand.600" />
              </Text>
              <Text fontWeight="bold">Phone</Text>
              <Text fontWeight="bold" color={"brand.600"}>
                +123 456 6778
              </Text>
            </VStack>
          </Card>
        </Box>
        <Box borderRadius="10px" border="3px solid white">
          <Box
            p="4"
            bg={"#ffe4e1"}
            fontWeight="bold"
            borderTopLeftRadius="10px"
            borderTopRightRadius="10px"
          >
            <Flex justify="space-between" align="center">
              <Text fontSize="sm" fontWeight="bold">
                Do Not Call
              </Text>
              <Select width="100px" border={"none"} fontSize={"sm"}>
                <option>Weekly</option>
                <option>Last month</option>
              </Select>
            </Flex>
            <Flex align="center" color={"brand.600"}>
              <Text mr="3" fontSize="2em">
                146
              </Text>
              <Icon mr="1" as={ArrowUpIcon} color="green.500" />
              <Text color="green.500" fontSize="xs">
                4.31%
              </Text>
            </Flex>
          </Box>{" "}
          <Card m="4" bg={"#eef0fc"} border={"1px solid #e3e5f1"}>
            <VStack align="flex-start" color={"brand.200"} fontSize="sm" p="4">
              <Text fontWeight="bold">Name of Company</Text>
              <Text fontWeight="bold" color={"brand.600"}>
                ABC
              </Text>
              <Text fontWeight="bold">Email</Text>
              <Text fontWeight="bold" color={"brand.600"}>
                abc@gmail.com
                <IconButton icon={<CopyIcon />} size={"xs"} color="brand.600" />
              </Text>
              <Text fontWeight="bold">Phone</Text>
              <Text fontWeight="bold" color={"brand.600"}>
                +123 456 6778
              </Text>
            </VStack>
          </Card>
          <Card m="4" bg={"#eef0fc"} border={"1px solid #e3e5f1"}>
            <VStack align="flex-start" color={"brand.200"} fontSize="sm" p="4">
              <Text fontWeight="bold">Name of Company</Text>
              <Text fontWeight="bold" color={"brand.600"}>
                ABC
              </Text>
              <Text fontWeight="bold">Email</Text>
              <Text fontWeight="bold" color={"brand.600"}>
                abc@gmail.com
                <IconButton icon={<CopyIcon />} size={"xs"} color="brand.600" />
              </Text>
              <Text fontWeight="bold">Phone</Text>
              <Text fontWeight="bold" color={"brand.600"}>
                +123 456 6778
              </Text>
            </VStack>
          </Card>
          <Card m="4" bg={"#eef0fc"} border={"1px solid #e3e5f1"}>
            <VStack align="flex-start" color={"brand.200"} fontSize="sm" p="4">
              <Text fontWeight="bold">Name of Company</Text>
              <Text fontWeight="bold" color={"brand.600"}>
                ABC
              </Text>
              <Text fontWeight="bold">Email</Text>
              <Text fontWeight="bold" color={"brand.600"}>
                abc@gmail.com
                <IconButton icon={<CopyIcon />} size={"xs"} color="brand.600" />
              </Text>
              <Text fontWeight="bold">Phone</Text>
              <Text fontWeight="bold" color={"brand.600"}>
                +123 456 6778
              </Text>
            </VStack>
          </Card>
          <Card m="4" bg={"#eef0fc"} border={"1px solid #e3e5f1"}>
            <VStack align="flex-start" color={"brand.200"} fontSize="sm" p="4">
              <Text fontWeight="bold">Name of Company</Text>
              <Text fontWeight="bold" color={"brand.600"}>
                ABC
              </Text>
              <Text fontWeight="bold">Email</Text>
              <Text fontWeight="bold" color={"brand.600"}>
                abc@gmail.com
                <IconButton icon={<CopyIcon />} size={"xs"} color="brand.600" />
              </Text>
              <Text fontWeight="bold">Phone</Text>
              <Text fontWeight="bold" color={"brand.600"}>
                +123 456 6778
              </Text>
            </VStack>
          </Card>
        </Box>
      </SimpleGrid>
    </Box>
  );
};

export default FreshLeads;
