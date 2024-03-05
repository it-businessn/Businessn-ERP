import {
	Box,
	Button,
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
import * as api from "services";
import { useBreakpointValue } from "services/Breakpoint";
import { generateLighterShade } from "utils";

const Opportunities = () => {
	const { isMobile } = useBreakpointValue();
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
	const ele_bg = generateLighterShade("#537eee", 0.9);
	const ele_color = "#537eee";
	const leadsStages = [
		{ category: "L1" },
		{ category: "L2" },
		{ category: "L3" },
		{ category: "L4" },
	];
	const primaryAssignee = [
		{ name: "L1" },
		{ name: "L2" },
		{ name: "L3" },
		{ name: "L4" },
	];
	const supervisorAssignee = [
		{ name: "L1" },
		{ name: "L2" },
		{ name: "L3" },
		{ name: "L4" },
	];
	const showOptions = () => (
		<>
			<Button
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
		</>
	);
	const showAddContact = () => (
		<Button
			bg={"#537eee"}
			px={{ lg: "3em" }}
			color={"brand.primary_bg"}
			variant={"solid"}
			_hover={{ color: "brand.600" }}
			borderRadius={"10px"}
		>
			Add new lead
		</Button>
	);
	return (
		<Box p={{ base: "1em", md: "2em" }}>
			<Text fontWeight="bold" mb={"0.5em"}>
				Opportunities
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
							{showAddContact()}
						</Flex>
						<HStack spacing="1em" mt="1em">
							{showOptions()}
						</HStack>
					</Flex>
				) : (
					<Flex>
						<Text fontWeight="bold">Contact</Text>
						<Spacer />
						<HStack spacing={3}>
							{showOptions("sm")}
							{showAddContact()}
						</HStack>
					</Flex>
				)}

				{!contacts && <Loader />}
				{contacts && (
					<Box overflow="auto">
						<Table variant="simple">
							<Thead>
								<Tr>
									<Th>Opportunity name</Th>
									<Th>Abbr</Th>
									<Th>Created On </Th>
									<Th>Email</Th>
									<Th>Stage</Th>
									<Th>Primary Assignee</Th>
									<Th>Supervisor Assignee</Th>
								</Tr>
							</Thead>
							<Tbody>
								{contacts?.map((item) => (
									<Tr key={item.id}>
										<Td>
											{/* Product/Service Text */}
											ss
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
											<Select
												icon={<Icon as={FaCaretDown} />}
												borderRadius={"10px"}
												size={"sm"}
												color={ele_color}
												bg={ele_bg}
												border={`1px solid ${ele_color}`}
											>
												{leadsStages.map(({ category }) => (
													<option value="" key={category}>
														{category}
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
												{primaryAssignee.map(({ name }) => (
													<option value="" key={name}>
														{name}
													</option>
												))}
												{/* <option value="">Choose primary assignee</option> */}
											</Select>
										</Td>
										<Td>
											<Select
												icon={<Icon as={FaCaretDown} />}
												placeholder="Choose supervisor "
												borderRadius={"10px"}
												size={"sm"}
												color={ele_color}
												bg={ele_bg}
												border={`1px solid ${ele_color}`}
											>
												{supervisorAssignee.map(({ name }) => (
													<option value="" key={name}>
														{name}
													</option>
												))}
												{/* <option value="">Choose supervisor </option> */}
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

export default Opportunities;
