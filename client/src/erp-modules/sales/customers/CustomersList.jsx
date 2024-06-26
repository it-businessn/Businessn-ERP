import {
	Box,
	Flex,
	HStack,
	IconButton,
	Input,
	InputGroup,
	InputLeftElement,
	Spacer,
	Table,
	Tbody,
	Td,
	Th,
	Thead,
	Tr,
} from "@chakra-ui/react";
import Loader from "components/Loader";
import SectionLayout from "components/ui/SectionLayout";
import HighlightButton from "components/ui/button/HighlightButton";
import LeftIconButton from "components/ui/button/LeftIconButton";
import TextTitle from "components/ui/text/TextTitle";
import { FaSearch } from "react-icons/fa";
import { MdOutlineFilterList } from "react-icons/md";
import { useBreakpointValue } from "services/Breakpoint";
import { generateLighterShade } from "utils";
import SearchFilter from "../lead docket/SearchFilter";

const CustomersList = ({ contacts, handleProfileView, icons }) => {
	const { isMobile } = useBreakpointValue();
	const handleEdit = (id) => {
		console.log(id);
	};
	return (
		<SectionLayout title="Customers">
			{isMobile ? (
				<Flex flexDir="column">
					<Flex justify="space-between">
						<TextTitle title="Customers" mb={"0.5em"} />
						{/* <PrimaryButton name={"Add new customer"} size={"xs"} /> */}
					</Flex>
					<HStack spacing="1em" mt="1em">
						<SearchFilter />
					</HStack>
				</Flex>
			) : (
				<Flex>
					<TextTitle title="Customers" />
					<Spacer />
					<HStack w={{ lg: "50%" }} spacing={3} justify={"flex-end"}>
						<LeftIconButton
							color={"brand.nav_color"}
							border={"2px solid var(--filter_border_color)"}
							name={"Filter"}
							borderRadius={"10px"}
							variant={"ghost"}
							isFilter
							size="xs"
							ml={2}
							// handleClick={() => setShowEditDetails(true)}
							icon={<MdOutlineFilterList />}
						/>
						<InputGroup
							size="xs"
							w={"40%"}
							borderRadius={"10px"}
							border={"1px solid var(--filter_border_color)"}
							fontSize="xs"
							fontWeight="bold"
						>
							<InputLeftElement size="xs" children={<FaSearch />} />
							<Input
								size="xs"
								_placeholder={{
									color: "brand.nav_color",
									fontSize: "xs",
								}}
								color={"brand.nav_color"}
								bg={"brand.primary_bg"}
								type="text"
								placeholder="Search here"
								pr="4.5rem"
								py={"1.1em"}
							/>
						</InputGroup>
						{/* <PrimaryButton name={"Add new customer"} size={"xs"} /> */}
					</HStack>
				</Flex>
			)}
			{!contacts && <Loader />}
			{contacts && (
				<Box overflow="auto">
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
								{/* <Th></Th> */}
							</Tr>
						</Thead>
						<Tbody color={"brand.nav_color"}>
							{contacts.map(({ _id, leadId, meetings, notes }) => (
								<Tr key={_id}>
									<Td fontSize={"xs"} p={0}>
										{leadId.opportunityName}
									</Td>
									<Td fontSize={"xs"}>{leadId.companyName}</Td>
									<Td fontSize={"xs"}>{leadId.email}</Td>
									<Td fontSize={"xs"}>
										<Flex align="center">
											<HStack
												// bg={generateLighterShade("#5e51c5", 0.8)}
												// color={"#5e51c5"}
												p={2}
												w={"30%"}
												onClick={() => {
													handleProfileView(_id);
												}}
												justify={"space-around"}
											>
												{icons.map(({ icon, label }) => (
													<IconButton
														key={label}
														icon={icon}
														bg={generateLighterShade("#537eee", 0.8)}
														borderRadius="50%"
														size={"xxs"}
														color={"var(--primary_button_bg)"}
														_hover={{ bg: "transparent", color: "brand.600" }}
													/>
												))}
												{/* <TextTitle
													weight="normal"
													title={
														meetings.length === 0
															? "No history"
															: meetings.length
													}
												/> */}
											</HStack>
										</Flex>
									</Td>
									<Td fontSize={"xs"}>
										<HStack>
											<HighlightButton
												name={"See full profile"}
												onClick={() => {
													handleProfileView(_id);
												}}
											/>
										</HStack>
									</Td>
									{/* <Td>
											<IconButton
												icon={<RiMore2Fill />}
												size="sm"
												variant="ghost"
												onClick={() => handleEdit(_id)}
											/>
										</Td> */}
								</Tr>
							))}
						</Tbody>
					</Table>
				</Box>
			)}
		</SectionLayout>
	);
};

export default CustomersList;
