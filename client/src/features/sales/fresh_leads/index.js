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
		<Box p={"1em"}>
			<Text fontWeight="bold" mb={"0.5em"}>
				Fresh Leads
			</Text>
			<SimpleGrid
				columns={{ base: 1, md: 4 }}
				spacing="1em"
				color={"brand.200"}
			>
				<Box borderRadius="10px" border="3px solid white">
					<Box
						fontWeight="bold"
						px="1em"
						bg={"#dbe5ff"}
						borderTopLeftRadius="10px"
						borderTopRightRadius="10px"
					>
						<Flex justify="space-between" align="center">
							<Text fontSize="xs" fontWeight="bold">
								Fresh Leads
							</Text>
							<Select width="90px" border={"none"} fontSize={"xs"}>
								<option>Weekly</option>
								<option>Last month</option>
							</Select>
						</Flex>
						<Flex align="center" color={"brand.600"} pb="1">
							<Text mr="3">1245</Text>
							<Icon mr="1" as={ArrowUpIcon} color="green.500" />
							<Text color="green.500" fontSize="xs">
								10%
							</Text>
						</Flex>
					</Box>
					<Card m="1em" bg={"#eef0fc"} border={"1px solid #e3e5f1"}>
						<VStack
							align="flex-start"
							color={"brand.200"}
							fontSize="xs"
							p={"1em"}
							spacing={0.5}
						>
							<Text fontSize="xs" fontWeight="bold">
								Name of Company
							</Text>
							<Text fontSize="xs" fontWeight="bold" color={"brand.600"}>
								ABC
							</Text>
							<Text fontSize="xs" fontWeight="bold">
								Email
							</Text>
							<Text fontSize="xs" fontWeight="bold" color={"brand.600"}>
								abc@gmail.com
								<IconButton icon={<CopyIcon />} size={"xs"} color="brand.600" />
							</Text>
							<Text fontSize="xs" fontWeight="bold">
								Phone
							</Text>
							<Text fontSize="xs" fontWeight="bold" color={"brand.600"}>
								+123 456 6778
							</Text>
						</VStack>
					</Card>
					<Card m="1em" bg={"#eef0fc"} border={"1px solid #e3e5f1"}>
						<VStack
							align="flex-start"
							color={"brand.200"}
							fontSize="xs"
							p={"1em"}
							spacing={0.5}
						>
							<Text fontSize="xs" fontWeight="bold">
								Name of Company
							</Text>
							<Text fontSize="xs" fontWeight="bold" color={"brand.600"}>
								ABC
							</Text>
							<Text fontSize="xs" fontWeight="bold">
								Email
							</Text>
							<Text fontSize="xs" fontWeight="bold" color={"brand.600"}>
								abc@gmail.com
								<IconButton icon={<CopyIcon />} size={"xs"} color="brand.600" />
							</Text>
							<Text fontSize="xs" fontWeight="bold">
								Phone
							</Text>
							<Text fontSize="xs" fontWeight="bold" color={"brand.600"}>
								+123 456 6778
							</Text>
						</VStack>
					</Card>
					<Card m="1em" bg={"#eef0fc"} border={"1px solid #e3e5f1"}>
						<VStack
							align="flex-start"
							color={"brand.200"}
							fontSize="xs"
							p={"1em"}
							spacing={0.5}
						>
							<Text fontSize="xs" fontWeight="bold">
								Name of Company
							</Text>
							<Text fontSize="xs" fontWeight="bold" color={"brand.600"}>
								ABC
							</Text>
							<Text fontSize="xs" fontWeight="bold">
								Email
							</Text>
							<Text fontSize="xs" fontWeight="bold" color={"brand.600"}>
								abc@gmail.com
								<IconButton icon={<CopyIcon />} size={"xs"} color="brand.600" />
							</Text>
							<Text fontSize="xs" fontWeight="bold">
								Phone
							</Text>
							<Text fontSize="xs" fontWeight="bold" color={"brand.600"}>
								+123 456 6778
							</Text>
						</VStack>
					</Card>
				</Box>
				<Box borderRadius="10px" border="3px solid white">
					<Box
						px="1em"
						bg={"#c4f7d8"}
						fontWeight="bold"
						borderTopLeftRadius="10px"
						borderTopRightRadius="10px"
					>
						<Flex justify="space-between" align="center">
							<Text fontSize="xs" fontWeight="bold">
								Contacted
							</Text>
							<Select width="90px" border={"none"} fontSize={"xs"}>
								<option>Weekly</option>
								<option>Last month</option>
							</Select>
						</Flex>
						<Flex align="center" color={"brand.600"} pb="1">
							<Text mr="3">1245</Text>
							<Icon mr="1" as={ArrowUpIcon} color="green.500" />
							<Text color="green.500" fontSize="xs">
								10%
							</Text>
						</Flex>
					</Box>
					<Card m="1em" bg={"#eef0fc"} border={"1px solid #e3e5f1"}>
						<VStack
							align="flex-start"
							color={"brand.200"}
							fontSize="xs"
							p={"1em"}
							spacing={0.5}
						>
							<Text fontSize="xs" fontWeight="bold">
								Name of Company
							</Text>
							<Text fontSize="xs" fontWeight="bold" color={"brand.600"}>
								ABC
							</Text>
							<Text fontSize="xs" fontWeight="bold">
								Email
							</Text>
							<Text fontSize="xs" fontWeight="bold" color={"brand.600"}>
								abc@gmail.com
								<IconButton icon={<CopyIcon />} size={"xs"} color="brand.600" />
							</Text>
							<Text fontSize="xs" fontWeight="bold">
								Phone
							</Text>
							<Text fontSize="xs" fontWeight="bold" color={"brand.600"}>
								+123 456 6778
							</Text>
						</VStack>
					</Card>
					<Card m="1em" bg={"#eef0fc"} border={"1px solid #e3e5f1"}>
						<VStack
							align="flex-start"
							color={"brand.200"}
							fontSize="xs"
							p={"1em"}
							spacing={0.5}
						>
							<Text fontSize="xs" fontWeight="bold">
								Name of Company
							</Text>
							<Text fontSize="xs" fontWeight="bold" color={"brand.600"}>
								ABC
							</Text>
							<Text fontSize="xs" fontWeight="bold">
								Email
							</Text>
							<Text fontSize="xs" fontWeight="bold" color={"brand.600"}>
								abc@gmail.com
								<IconButton icon={<CopyIcon />} size={"xs"} color="brand.600" />
							</Text>
							<Text fontSize="xs" fontWeight="bold">
								Phone
							</Text>
							<Text fontSize="xs" fontWeight="bold" color={"brand.600"}>
								+123 456 6778
							</Text>
						</VStack>
					</Card>
					<Card m="1em" bg={"#eef0fc"} border={"1px solid #e3e5f1"}>
						<VStack
							align="flex-start"
							color={"brand.200"}
							fontSize="xs"
							p={"1em"}
							spacing={0.5}
						>
							<Text fontSize="xs" fontWeight="bold">
								Name of Company
							</Text>
							<Text fontSize="xs" fontWeight="bold" color={"brand.600"}>
								ABC
							</Text>
							<Text fontSize="xs" fontWeight="bold">
								Email
							</Text>
							<Text fontSize="xs" fontWeight="bold" color={"brand.600"}>
								abc@gmail.com
								<IconButton icon={<CopyIcon />} size={"xs"} color="brand.600" />
							</Text>
							<Text fontSize="xs" fontWeight="bold">
								Phone
							</Text>
							<Text fontSize="xs" fontWeight="bold" color={"brand.600"}>
								+123 456 6778
							</Text>
						</VStack>
					</Card>
				</Box>
				<Box borderRadius="10px" border="3px solid white">
					<Box
						px="1em"
						bg={"#caeaf5"}
						fontWeight="bold"
						borderTopLeftRadius="10px"
						borderTopRightRadius="10px"
					>
						<Flex justify="space-between" align="center">
							<Text fontSize="xs" fontWeight="bold">
								Call Back
							</Text>
							<Select width="90px" border={"none"} fontSize={"xs"}>
								<option>Weekly</option>
								<option>Last month</option>
							</Select>
						</Flex>
						<Flex align="center" color={"brand.600"} pb="1">
							<Text mr="3">543</Text>
							<Icon mr="1" as={ArrowDownIcon} color="green.500" />
							<Text color="green.500" fontSize="xs">
								10%
							</Text>
						</Flex>
					</Box>
					<Card m="1em" bg={"#eef0fc"} border={"1px solid #e3e5f1"}>
						<VStack
							align="flex-start"
							color={"brand.200"}
							fontSize="xs"
							p={"1em"}
							spacing={0.5}
						>
							<Text fontSize="xs" fontWeight="bold">
								Name of Company
							</Text>
							<Text fontSize="xs" fontWeight="bold" color={"brand.600"}>
								ABC
							</Text>
							<Text fontSize="xs" fontWeight="bold">
								Email
							</Text>
							<Text fontSize="xs" fontWeight="bold" color={"brand.600"}>
								abc@gmail.com
								<IconButton icon={<CopyIcon />} size={"xs"} color="brand.600" />
							</Text>
							<Text fontSize="xs" fontWeight="bold">
								Phone
							</Text>
							<Text fontSize="xs" fontWeight="bold" color={"brand.600"}>
								+123 456 6778
							</Text>
						</VStack>
					</Card>
					<Card m="1em" bg={"#eef0fc"} border={"1px solid #e3e5f1"}>
						<VStack
							align="flex-start"
							color={"brand.200"}
							fontSize="xs"
							p={"1em"}
							spacing={0.5}
						>
							<Text fontSize="xs" fontWeight="bold">
								Name of Company
							</Text>
							<Text fontSize="xs" fontWeight="bold" color={"brand.600"}>
								ABC
							</Text>
							<Text fontSize="xs" fontWeight="bold">
								Email
							</Text>
							<Text fontSize="xs" fontWeight="bold" color={"brand.600"}>
								abc@gmail.com
								<IconButton icon={<CopyIcon />} size={"xs"} color="brand.600" />
							</Text>
							<Text fontSize="xs" fontWeight="bold">
								Phone
							</Text>
							<Text fontSize="xs" fontWeight="bold" color={"brand.600"}>
								+123 456 6778
							</Text>
						</VStack>
					</Card>
				</Box>
				<Box borderRadius="10px" border="3px solid white">
					<Box
						px="1em"
						bg={"#ffe4e1"}
						fontWeight="bold"
						borderTopLeftRadius="10px"
						borderTopRightRadius="10px"
					>
						<Flex justify="space-between" align="center">
							<Text fontSize="xs" fontWeight="bold">
								Do Not Call
							</Text>
							<Select width="90px" border={"none"} fontSize={"xs"}>
								<option>Weekly</option>
								<option>Last month</option>
							</Select>
						</Flex>
						<Flex align="center" color={"brand.600"} pb="1">
							<Text mr="3">146</Text>
							<Icon mr="1" as={ArrowUpIcon} color="green.500" />
							<Text color="green.500" fontSize="xs">
								4.31%
							</Text>
						</Flex>
					</Box>
					<Card m="1em" bg={"#eef0fc"} border={"1px solid #e3e5f1"}>
						<VStack
							align="flex-start"
							color={"brand.200"}
							fontSize="xs"
							p={"1em"}
							spacing={0.5}
						>
							<Text fontSize="xs" fontWeight="bold">
								Name of Company
							</Text>
							<Text fontSize="xs" fontWeight="bold" color={"brand.600"}>
								ABC
							</Text>
							<Text fontSize="xs" fontWeight="bold">
								Email
							</Text>
							<Text fontSize="xs" fontWeight="bold" color={"brand.600"}>
								abc@gmail.com
								<IconButton icon={<CopyIcon />} size={"xs"} color="brand.600" />
							</Text>
							<Text fontSize="xs" fontWeight="bold">
								Phone
							</Text>
							<Text fontSize="xs" fontWeight="bold" color={"brand.600"}>
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
