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
import TextTitle from "components/ui/text/TextTitle";
import { useState } from "react";
import { RiEditLine } from "react-icons/ri";
import LocalStorageService from "services/LocalStorageService";
import { isManager } from "utils";
import EditLead from "./EditLead";

export const totalLeads = (name, isManager, leads, userName) => {
	return isManager
		? leads?.filter((lead) => lead.stage === name).length
		: leads?.filter(
				(lead) => lead.stage === name && lead.primaryAssignee === userName,
		  ).length;
};

const AgentsView = ({ leads, setIsUpdated, reference }) => {
	const defaultLeadInfo = {
		_id: null,
		opportunityName: "",
		email: "",
		stage: "",
		phone: "",
	};
	const { fullName, role } = LocalStorageService.getItem("user");

	const isUserManager = isManager(role);
	const leadList = isUserManager
		? leads
		: leads?.filter((lead) => lead.primaryAssignee === fullName);

	const { isOpen, onOpen, onClose } = useDisclosure();
	const [formData, setFormData] = useState(defaultLeadInfo);
	const [copied, setCopied] = useState(false);

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
				{reference?.map((category) => (
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
								<TextTitle weight="normal" title={category.name} size="xs" />
								<Select width="90px" border={"none"} fontSize={"xs"}>
									<option>Weekly</option>
									<option>Last month</option>
								</Select>
							</Flex>
							<Flex align="center" color={"brand.600"} mt="-2">
								<Text mr="3">
									{totalLeads(category.abbr, isUserManager, leads, fullName)}
								</Text>
								<Icon mr="1" as={ArrowUpIcon} color="green.500" />
								<Text color="green.500" fontSize="xs">
									10%
								</Text>
							</Flex>
						</Box>
						{leadList
							?.filter((lead) => lead.stage === category.abbr)
							?.map(({ _id, opportunityName, email, phone, stage }) => (
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
											<TextTitle size="xs" title="Company" />
											<TextTitle
												size="xs"
												color={"brand.600"}
												weight="normal"
												title={opportunityName}
											/>
											<RiEditLine
												cursor={"pointer"}
												onClick={() =>
													handleEdit(_id, opportunityName, email, phone, stage)
												}
											/>
										</HStack>
										<HStack justifyContent={"space-between"} w={"100%"}>
											<TextTitle size="xs" title="Email" />
											<TextTitle
												size="xs"
												color={"brand.600"}
												weight="normal"
												title={email}
											/>
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
											<TextTitle size="xs" title="Phone" />
											<TextTitle
												size="xs"
												color={"brand.600"}
												weight="normal"
												title={phone}
											/>
											<Box />
										</HStack>
									</VStack>
								</Card>
							))}
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
