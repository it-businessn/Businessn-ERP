import {
	Box,
	Button,
	FormControl,
	FormLabel,
	HStack,
	Input,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalHeader,
	ModalOverlay,
	Stack,
	Text,
	useDisclosure,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import LeadsService from "services/LeadsService";
import LocalStorageService from "services/LocalStorageService";
import { isManager } from "utils";
import AgentsView, { totalLeads } from "../fresh_leads/AgentsView";
import { TARGET_LEADS } from "../opportunities/data";
import GradientAreaFillColorChart from "./AreaFillColorChart";

const Pipeline = () => {
	const [leads, setLeads] = useState(null);
	const [isUpdated, setIsUpdated] = useState(false);

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

	const { isOpen, onOpen, onClose } = useDisclosure();
	const handleSubmit = () => {};

	const { fullName, role } = LocalStorageService.getItem("user");
	const isUserManager = isManager(role);

	const opportunityData = [
		{
			name: "Meeting Set",
			total: totalLeads("T1", isUserManager, leads, fullName),
		},
		{
			name: "Discovery Call",
			total: totalLeads("T2", isUserManager, leads, fullName),
		},
		{
			name: "Closing",
			total: totalLeads("T3", isUserManager, leads, fullName),
		},
		{
			name: "Onboard",
			total: totalLeads("T4", isUserManager, leads, fullName),
		},
	];

	return (
		<Box p={{ base: "1em", md: "2em" }}>
			<Text fontWeight="bold" mb={"0.5em"}>
				Target Leads
			</Text>
			<Box
				width="100%"
				borderRadius="10px"
				border="3px solid var(--main_color)"
				mb={3}
			>
				<Text p={"1em"} fontWeight="bold" color={"brand.200"} mb={"0.5em"}>
					Pipeline
				</Text>
				{opportunityData && (
					<GradientAreaFillColorChart opportunityData={opportunityData} />
				)}
			</Box>
			{TARGET_LEADS && (
				<AgentsView
					leads={leads}
					reference={TARGET_LEADS}
					setIsUpdated={setIsUpdated}
				/>
			)}

			<Modal isCentered isOpen={isOpen} onClose={onClose}>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>Edit Lead</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						<Stack spacing="5">
							<form onSubmit={handleSubmit}>
								<Stack spacing={4}>
									<FormControl>
										<FormLabel>Name of Company</FormLabel>
										<Input
											type="text"
											name="company"
											// value={formData.email}
											// onChange={handleChange}
											required
										/>
									</FormControl>
									<FormControl>
										<FormLabel>Email</FormLabel>
										<Input
											type="email"
											name="email"
											// value={formData.email}
											// onChange={handleChange}
											required
										/>
									</FormControl>
									<FormControl>
										<FormLabel>Phone</FormLabel>
										<Input
											type="text"
											name="phone"
											// value={formData.email}
											// onChange={handleChange}
											required
										/>
									</FormControl>
									<HStack justifyContent={"end"}>
										<Button
											// isLoading={isLoading}
											type="submit"
											bg="brand.logo_bg"
											// _hover={{ color: "brand.100" }}
										>
											Save
										</Button>
										<Button
											// isLoading={isLoading}
											colorScheme="gray"
										>
											Cancel
										</Button>
									</HStack>
								</Stack>
							</form>
							{/* {error && (
						<Alert status="error" mt={4}>
							<AlertIcon />
							{error}
						</Alert>
					)} */}
						</Stack>
					</ModalBody>
				</ModalContent>
			</Modal>
			{/* )} */}
		</Box>
	);
};

export default Pipeline;
