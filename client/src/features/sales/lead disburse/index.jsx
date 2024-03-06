import {
	Box,
	Button,
	Checkbox,
	Flex,
	HStack,
	Icon,
	Input,
	InputGroup,
	InputLeftElement,
	Select,
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
import { FaCaretDown, FaSearch } from "react-icons/fa";
import { MdOutlineFilterList } from "react-icons/md";
import { useBreakpointValue } from "services/Breakpoint";
import ContactService from "services/ContactService";
import { generateLighterShade } from "utils";

const LeadsDocket = () => {
	const { isMobile } = useBreakpointValue();
	const [contacts, setContacts] = useState(null);
	const fetchAllContacts = async () => {
		try {
			const response = await ContactService.getContacts();
			response.data.map((item) => (item.comm = "Meeting"));
			setContacts(response.data);
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		fetchAllContacts();
	}, []);

	const [checkedRows, setCheckedRows] = useState([]);
	const handleCheckboxChange = (rowId) => {
		if (checkedRows.includes(rowId)) {
			setCheckedRows(checkedRows.filter((id) => id !== rowId));
		} else {
			setCheckedRows([...checkedRows, rowId]);
		}
	};
	const ele_bg = generateLighterShade("#537eee", 0.9);
	const ele_color = "#537eee";
	const regions = [{ name: "BC" }, { name: "Toronto" }];
	const industries = [
		{ name: "L1" },
		{ name: "L2" },
		{ name: "L3" },
		{ name: "L4" },
	];
	const sources = [
		{ name: "L1" },
		{ name: "L2" },
		{ name: "L3" },
		{ name: "L4" },
	];
	const showOptions = () => (
		<>
			<Button
				w={"200px"}
				color={"brand.nav_color"}
				leftIcon={<MdOutlineFilterList />}
				border={"2px solid #d3d3d3"}
				borderRadius={"10px"}
				variant={"ghost"}
				_hover={{ color: "brand.600", bg: "transparent" }}
			>
				Filter
			</Button>
			<InputGroup
				borderRadius={"10px"}
				border={"1px solid #d3d3d3"}
				fontWeight="bold"
			>
				<InputLeftElement size="xs" children={<FaSearch />} />
				<Input
					_placeholder={{
						color: "brand.nav_color",
					}}
					color={"brand.nav_color"}
					bg={"brand.primary_bg"}
					type="text"
					placeholder="Search here"
				/>
			</InputGroup>
		</>
	);
	const showDisburse = () => (
		<Button
			w={{ lg: "400px" }}
			bg={ele_bg}
			color={ele_color}
			variant={"ghost"}
			_hover={{ color: "brand.600" }}
			borderRadius={"10px"}
		>
			Confirm Disbursement
		</Button>
	);
	return (
		<Box p={{ base: "1em", md: "2em" }}>
			<Text fontWeight="bold" mb={"0.5em"}>
				Lead Disbursement
			</Text>
			<Box
				p="1em"
				bg={"brand.primary_bg"}
				border="2px solid white"
				borderRadius="10px"
				color={"brand.nav_color"}
			>
				{isMobile ? (
					<Flex flexDir="column">
						<Flex justify="space-between">
							<Text fontWeight="bold">Contact</Text>
							{showDisburse()}
						</Flex>
						<Select mt="1em" border={"2px solid #d3d3d3"} borderRadius={"10px"}>
							<option value="">Region</option>
						</Select>
						<HStack spacing="1em" mt="1em">
							{showOptions()}
						</HStack>
					</Flex>
				) : (
					<Flex>
						<Text fontWeight="bold">Lead Disbursement</Text>
						<Spacer />
						<HStack spacing={3}>
							<Spacer />
							{showDisburse()}
							<Select
								icon={<Icon as={FaCaretDown} />}
								border={"2px solid #d3d3d3"}
								borderRadius={"10px"}
							>
								<option value="">Region</option>
							</Select>
							{showOptions()}
						</HStack>
					</Flex>
				)}
				{!contacts && <Loader />}
				{contacts && (
					<Box overflow="auto">
						<Table variant="simple">
							<Thead>
								<Tr>
									<Th>
										<Checkbox />
									</Th>
									<Th>Name</Th>
									<Th>Leads</Th>
									<Th>Areas</Th>
									<Th>Last Login</Th>
									<Th>Role</Th>
									<Th>Address</Th>
									<Th>Areas</Th>
									<Th>Weighting</Th>
									<Th>Product Service</Th>
								</Tr>
							</Thead>
							<Tbody>
								{contacts?.map((item) => (
									<Tr key={item.id}>
										<Td>
											<Checkbox
												isChecked={checkedRows.includes(item.id)}
												onChange={() => handleCheckboxChange(item.id)}
											/>
										</Td>
										<Td>ss</Td>
										<Td>
											<Select
												icon={<Icon as={FaCaretDown} />}
												borderRadius={"10px"}
												size={"sm"}
												color={ele_color}
												bg={ele_bg}
												border={`1px solid ${ele_color}`}
											>
												{industries.map(({ name }) => (
													<option value="" key={name}>
														{name}
													</option>
												))}
											</Select>
										</Td>
										<Td>
											{/* Company Name */}
											ss
										</Td>
										<Td>
											{/* Phone */}
											ss
										</Td>
										<Td>
											{/* Email */}
											ss
										</Td>
										<Td>
											{/* Address */}
											ss
										</Td>
										<Td>
											<Select
												icon={<Icon as={FaCaretDown} />}
												borderRadius={"10px"}
												size={"sm"}
												color={ele_color}
												bg={ele_bg}
												border={`1px solid ${ele_color}`}
											>
												{sources.map(({ name }) => (
													<option value="" key={name}>
														{name}
													</option>
												))}
											</Select>
										</Td>
										<Td>
											<Select
												icon={<Icon as={FaCaretDown} />}
												borderRadius={"10px"}
												size={"sm"}
												color={ele_color}
												bg={ele_bg}
												border={`1px solid ${ele_color}`}
											>
												{regions.map(({ name }) => (
													<option value="" key={name}>
														{name}
													</option>
												))}
											</Select>
										</Td>
										<Td>
											<Select
												icon={<Icon as={FaCaretDown} />}
												borderRadius={"10px"}
												size={"sm"}
												color={ele_color}
												bg={ele_bg}
												border={`1px solid ${ele_color}`}
											>
												{regions.map(({ name }) => (
													<option value="" key={name}>
														{name}
													</option>
												))}
											</Select>
										</Td>
									</Tr>
								))}
							</Tbody>
						</Table>
					</Box>
				)}
			</Box>
		</Box>
	);
};

export default LeadsDocket;
