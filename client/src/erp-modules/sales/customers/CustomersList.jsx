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
	useDisclosure,
} from "@chakra-ui/react";
import HighlightButton from "components/ui/button/HighlightButton";
import LeftIconButton from "components/ui/button/LeftIconButton";
import PrimaryButton from "components/ui/button/PrimaryButton";
import TextTitle from "components/ui/text/TextTitle";
import PageLayout from "layouts/PageLayout";
import { FaSearch } from "react-icons/fa";
import { MdOutlineFilterList } from "react-icons/md";
import { useBreakpointValue } from "services/Breakpoint";
import { generateLighterShade, toCapitalize } from "utils";
import SearchFilter from "../lead docket/SearchFilter";
import AddNewOpportunity from "../opportunities/AddNewOpportunity";

const CustomersList = ({ contacts, handleProfileView, icons, setIsAdded, company }) => {
	const { isMobile } = useBreakpointValue();
	const handleEdit = (id) => {
		console.log(id);
	};

	const { isOpen, onOpen, onClose } = useDisclosure();

	return (
		<PageLayout width="full" title={"Customers"} showBgLayer>
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
							color={"var(--nav_color)"}
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
									color: "var(--nav_color)",
									fontSize: "xs",
								}}
								color={"var(--nav_color)"}
								bg={"var(--primary_bg)"}
								type="text"
								placeholder="Search here"
								pr="4.5rem"
								py={"1.1em"}
							/>
						</InputGroup>
						<PrimaryButton onOpen={() => onOpen()} name={"Add new customer"} size={"xs"} />
					</HStack>
				</Flex>
			)}
			{contacts && (
				<Box overflow="auto">
					<Table color={"var(--nav_color)"} bg={"var(--primary_bg)"}>
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
						<Tbody color={"var(--nav_color)"}>
							{contacts.map(({ _id, leadId, meetings, notes }) => (
								<Tr key={_id}>
									<Td fontSize={"xs"} p={0}>
										{leadId.opportunityName}
									</Td>
									<Td fontSize={"xs"}>{toCapitalize(leadId.name)}</Td>
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
														_hover={{
															bg: "transparent",
															color: "var(--main_color_black)",
														}}
													/>
												))}
												{/* <NormalTextTitle
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
			{isOpen && (
				<AddNewOpportunity
					setIsAdded={setIsAdded}
					isOpen={isOpen}
					onClose={() => onClose()}
					company={company}
				/>
			)}
		</PageLayout>
	);
};

export default CustomersList;
