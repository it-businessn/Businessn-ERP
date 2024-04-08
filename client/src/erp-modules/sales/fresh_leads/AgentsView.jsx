import { ArrowUpIcon, CopyIcon } from "@chakra-ui/icons";
import {
	Box,
	Card,
	Flex,
	HStack,
	Icon,
	Select,
	SimpleGrid,
	Text,
	VStack,
	useDisclosure,
} from "@chakra-ui/react";
import { useState } from "react";
import { RiEditLine } from "react-icons/ri";
import LocalStorageService from "services/LocalStorageService";
import { FRESH_LEADS } from "../opportunities/data";
import EditLead from "./EditLead";

const AgentsView = ({ leads, setIsUpdated }) => {
	const defaultLeadInfo = {
		_id: null,
		opportunityName: "",
		email: "",
		stage: "",
		phone: "",
	};

	const { isOpen, onOpen, onClose } = useDisclosure();
	const user = LocalStorageService.getItem("user").fullName;
	const [formData, setFormData] = useState(defaultLeadInfo);
	const [copied, setCopied] = useState(false);
	const totalLeads = (name) =>
		leads.filter((lead) => lead.stage === name && lead.primaryAssignee === user)
			.length;

	const handleEdit = (_id, opportunityName, email, phone, stage) => {
		setFormData((prevData) => ({
			...prevData,
			_id,
			opportunityName,
			email,
			phone,
			stage,
		}));
		onOpen();
	};
	const handleCopy = async (_id, opportunityName, email, phone, stage) => {
		try {
			await navigator.clipboard.writeText(email);
			setCopied(true);
			setTimeout(() => {
				setCopied(false);
			}, 2000);
		} catch (error) {
			console.error("Failed to copy:", error);
		}
	};
	return (
		<>
			<SimpleGrid
				columns={{ base: 1, md: 2, lg: 4 }}
				spacing="1em"
				color={"brand.200"}
			>
				{leads &&
					leads.length > 0 &&
					FRESH_LEADS.map((category) => (
						<Box
							borderRadius="10px"
							border="3px solid var(--main_color)"
							key={category.id}
							p={0}
						>
							<Box
								fontWeight="bold"
								px="1em"
								py={0}
								bg={category.color}
								borderTopLeftRadius="10px"
								borderTopRightRadius="10px"
							>
								<Flex justify="space-between" align="center" gap={0}>
									<Text fontSize="xs" fontWeight="bold">
										{category.name}
									</Text>
									<Select width="90px" border={"none"} fontSize={"xs"}>
										<option>Weekly</option>
										<option>Last month</option>
									</Select>
								</Flex>
								<Flex align="center" color={"brand.600"} mt="-2">
									<Text mr="3">{totalLeads(category.abbr)}</Text>
									<Icon mr="1" as={ArrowUpIcon} color="green.500" />
									<Text color="green.500" fontSize="xs">
										10%
									</Text>
								</Flex>
							</Box>
							{leads
								.filter((lead) => lead.primaryAssignee === user)
								?.map(
									({ _id, opportunityName, email, phone, stage }) =>
										category.abbr === stage && (
											<Card
												key={_id}
												m="8px"
												bg="var(--lead_cards_bg)"
												border={"1px solid var(--lead_cards_border)"}
											>
												<VStack
													align="flex-start"
													color={"brand.200"}
													fontSize="xs"
													p={"0.5em"}
													spacing={0.5}
												>
													<HStack justifyContent={"space-between"} w={"100%"}>
														<Text fontSize="xs" fontWeight="bold">
															Company
														</Text>
														<Text
															fontSize="xs"
															// fontWeight="bold"
															color={"brand.600"}
														>
															{opportunityName}
														</Text>
														<RiEditLine
															cursor={"pointer"}
															onClick={() =>
																handleEdit(
																	_id,
																	opportunityName,
																	email,
																	phone,
																	stage,
																)
															}
														/>
													</HStack>
													<HStack justifyContent={"space-between"} w={"100%"}>
														<Text fontSize="xs" fontWeight="bold">
															Email
														</Text>
														<Text
															fontSize="xs"
															// fontWeight="bold"
															color={"brand.600"}
														>
															{email}
														</Text>
														<Box>
															<CopyIcon
																cursor={"pointer"}
																onClick={() =>
																	handleCopy(
																		_id,
																		opportunityName,
																		email,
																		phone,
																		stage,
																	)
																}
															/>
														</Box>
													</HStack>
													<HStack w={"100%"} justifyContent={"space-between"}>
														<Text fontSize="xs" fontWeight="bold">
															Phone
														</Text>
														<Text
															fontSize="xs"
															// fontWeight="bold"
															color={"brand.600"}
														>
															{phone}
														</Text>
														<Box />
													</HStack>
												</VStack>
											</Card>
										),
								)}
						</Box>
					))}
			</SimpleGrid>

			<EditLead
				defaultLeadInfo={defaultLeadInfo}
				formData={formData}
				isOpen={isOpen}
				onClose={onClose}
				setFormData={setFormData}
				setIsUpdated={setIsUpdated}
			/>
		</>
	);
};

export default AgentsView;
