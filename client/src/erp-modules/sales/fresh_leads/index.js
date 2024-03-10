import { ArrowUpIcon, CopyIcon } from "@chakra-ui/icons";
import {
	Box,
	Card,
	Flex,
	HStack,
	Icon,
	IconButton,
	Select,
	SimpleGrid,
	Text,
	VStack,
	useDisclosure,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { RiEditLine } from "react-icons/ri";
import LeadsService from "services/LeadsService";
import { FRESH_LEADS } from "../opportunities/data";
import EditLead from "./EditLead";

const FreshLeads = () => {
	const defaultLeadInfo = {
		_id: null,
		opportunityName: "",
		email: "",
		stage: "",
		phone: "",
	};

	const { isOpen, onOpen, onClose } = useDisclosure();

	const [formData, setFormData] = useState(defaultLeadInfo);
	const [isUpdated, setIsUpdated] = useState(false);
	const [leads, setLeads] = useState(null);

	const fetchAllLeads = async () => {
		try {
			const response = await LeadsService.getConfirmedDisbursedLeads();
			setLeads(response.data);
		} catch (error) {
			console.error(error);
		}
	};
	useEffect(() => {
		fetchAllLeads();
	}, [isUpdated]);

	const totalLeads = (name) =>
		leads.filter((lead) => lead.stage === name).length;

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

	return (
		<Box p={{ base: "1em", md: "2em" }}>
			<Text fontWeight="bold" mb={"0.5em"}>
				Fresh Leads
			</Text>
			<SimpleGrid
				columns={{ base: 1, md: 2, lg: 4 }}
				spacing="1em"
				color={"brand.200"}
			>
				{leads &&
					FRESH_LEADS.map((category) => (
						<Box
							borderRadius="10px"
							border="3px solid var(--main_color)"
							key={category.id}
						>
							<Box
								fontWeight="bold"
								px="1em"
								bg={category.color}
								borderTopLeftRadius="10px"
								borderTopRightRadius="10px"
							>
								<Flex justify="space-between" align="center">
									<Text fontSize="xs" fontWeight="bold">
										{category.name}
									</Text>
									<Select width="90px" border={"none"} fontSize={"xs"}>
										<option>Weekly</option>
										<option>Last month</option>
									</Select>
								</Flex>
								<Flex align="center" color={"brand.600"} pb="1">
									<Text mr="3">{totalLeads(category.abbr)}</Text>
									<Icon mr="1" as={ArrowUpIcon} color="green.500" />
									<Text color="green.500" fontSize="xs">
										10%
									</Text>
								</Flex>
							</Box>
							{leads.map(
								({ _id, opportunityName, email, phone, stage }) =>
									category.abbr === stage && (
										<Card
											key={_id}
											m="1em"
											bg="var(--lead_cards_bg)"
											border={"1px solid var(--lead_cards_border)"}
										>
											<VStack
												align="flex-start"
												color={"brand.200"}
												fontSize="xs"
												p={"1em"}
												spacing={0.5}
											>
												<HStack justifyContent={"space-between"} w={"100%"}>
													<Text fontSize="xs" fontWeight="bold">
														Name of Company
													</Text>
													<RiEditLine
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
												<Text
													fontSize="xs"
													fontWeight="bold"
													color={"brand.600"}
												>
													{opportunityName}
												</Text>
												<Text fontSize="xs" fontWeight="bold">
													Email
												</Text>
												<Text
													fontSize="xs"
													fontWeight="bold"
													color={"brand.600"}
												>
													{email}
													<IconButton
														icon={<CopyIcon />}
														size={"xs"}
														color="brand.600"
													/>
												</Text>
												<Text fontSize="xs" fontWeight="bold">
													Phone
												</Text>
												<Text
													fontSize="xs"
													fontWeight="bold"
													color={"brand.600"}
												>
													{phone}
												</Text>
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
		</Box>
	);
};

export default FreshLeads;
