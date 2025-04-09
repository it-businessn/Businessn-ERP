import { Box, HStack, Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import PrimaryButton from "components/ui/button/PrimaryButton";
import NormalTextTitle from "components/ui/NormalTextTitle";
import TextTitle from "components/ui/text/TextTitle";
import ActionAll from "erp-modules/payroll/timesheets/ActionAll";
import OnboardEmpModal from "erp-modules/sales/onboarding/OnboardEmpModal";
import PageLayout from "layouts/PageLayout";
import { useEffect, useState } from "react";
import ContactService from "services/ContactService";
import LocalStorageService from "services/LocalStorageService";

const Onboarding = () => {
	const company = LocalStorageService.getItem("selectedCompany");
	const cols = [
		"Customer",
		"Welcome Emails",
		"Onboarding Welcome Call",
		"Bank Test",
		"Sent Onboard Package",
		"Technical Configured",
		"Company Configured",
		"Ticket Opened",
		"EE Data Populated",
		"Check in 1 with CSR",
		"Revisions",
		"Check in 2 with CSR",
		"Final Revisions",
		"Internal Demo",
		"Access Approved from CSR",
		"Go Live Approved from CSR",
		"Go Live Initiated",
		"Go Live Completed",
	];
	const [showAddUser, setShowAddUser] = useState(false);
	const [contacts, setContacts] = useState(null);

	useEffect(() => {
		const fetchAllContacts = async () => {
			try {
				const { data } = await ContactService.getOnboardedContacts(company);
				setContacts(data);
			} catch (error) {
				console.error(error);
			}
		};
		fetchAllContacts();
	}, []);

	return (
		<PageLayout width="full" title="Company Users" showDate isTimesheet>
			<HStack spacing={3} justify={"flex-end"} mt={-8}>
				<PrimaryButton size={"sm"} name="Add User" onOpen={() => setShowAddUser(true)} />
			</HStack>
			<Box overflow="auto" height="calc(100vh - 164px)">
				<Table bg="var(--lead_cards_bg)" variant="simple">
					<Thead position="sticky" top={-1} zIndex={3}>
						<Tr>
							{cols?.map((col, index) => (
								<Th key={`${col}_${index}`} w="200px">
									<TextTitle size="xs" w="200px" whiteSpace="wrap" title={col} />
								</Th>
							))}
						</Tr>
					</Thead>
					<Tbody>
						{contacts?.map(({ _id, leadId }) => (
							<Tr key={_id} _hover={{ bg: "var(--phoneCall_bg_light)" }}>
								<Td py={0}>
									<NormalTextTitle size="sm" title={leadId.opportunityName} />
								</Td>
								<Td py={0} pl={0}>
									<ActionAll
										minW="82px"
										w="80px"
										size="xs"
										menuW="80px"
										isRowAction
										status={"approveStatus"}
										handleButtonClick={(action) => console.log(action)}
									/>
								</Td>
								<Td py={0} pl={0}>
									<ActionAll
										minW="82px"
										w="80px"
										size="xs"
										menuW="80px"
										isRowAction
										status={"approveStatus"}
										handleButtonClick={(action) => console.log(action)}
									/>
								</Td>
								<Td py={0} pl={0}>
									<ActionAll
										minW="82px"
										w="80px"
										size="xs"
										menuW="80px"
										isRowAction
										status={"approveStatus"}
										handleButtonClick={(action) => console.log(action)}
									/>
								</Td>
								<Td py={0} pl={0}>
									<ActionAll
										minW="82px"
										w="80px"
										size="xs"
										menuW="80px"
										isRowAction
										status={"approveStatus"}
										handleButtonClick={(action) => console.log(action)}
									/>
								</Td>
								<Td py={0} pl={0}>
									<ActionAll
										minW="82px"
										w="80px"
										size="xs"
										menuW="80px"
										isRowAction
										status={"approveStatus"}
										handleButtonClick={(action) => console.log(action)}
									/>
								</Td>
								<Td py={0} pl={0}>
									<ActionAll
										minW="82px"
										w="80px"
										size="xs"
										menuW="80px"
										isRowAction
										status={"approveStatus"}
										handleButtonClick={(action) => console.log(action)}
									/>
								</Td>
								<Td py={0} pl={0}>
									<ActionAll
										minW="82px"
										w="80px"
										size="xs"
										menuW="80px"
										isRowAction
										status={"approveStatus"}
										handleButtonClick={(action) => console.log(action)}
									/>
								</Td>
								<Td py={0} pl={0}>
									<ActionAll
										minW="82px"
										w="80px"
										size="xs"
										menuW="80px"
										isRowAction
										status={"approveStatus"}
										handleButtonClick={(action) => console.log(action)}
									/>
								</Td>
								<Td py={0} pl={0}>
									<ActionAll
										minW="82px"
										w="80px"
										size="xs"
										menuW="80px"
										isRowAction
										status={"approveStatus"}
										handleButtonClick={(action) => console.log(action)}
									/>
								</Td>
								<Td py={0} pl={0}>
									<ActionAll
										minW="82px"
										w="80px"
										size="xs"
										menuW="80px"
										isRowAction
										status={"approveStatus"}
										handleButtonClick={(action) => console.log(action)}
									/>
								</Td>
								<Td py={0} pl={0}>
									<ActionAll
										minW="82px"
										w="80px"
										size="xs"
										menuW="80px"
										isRowAction
										status={"approveStatus"}
										handleButtonClick={(action) => console.log(action)}
									/>
								</Td>
								<Td py={0} pl={0}>
									<ActionAll
										minW="82px"
										w="80px"
										size="xs"
										menuW="80px"
										isRowAction
										status={"approveStatus"}
										handleButtonClick={(action) => console.log(action)}
									/>
								</Td>
								<Td py={0} pl={0}>
									<ActionAll
										minW="82px"
										w="80px"
										size="xs"
										menuW="80px"
										isRowAction
										status={"approveStatus"}
										handleButtonClick={(action) => console.log(action)}
									/>
								</Td>
								<Td py={0} pl={0}>
									<ActionAll
										minW="82px"
										w="80px"
										size="xs"
										menuW="80px"
										isRowAction
										status={"approveStatus"}
										handleButtonClick={(action) => console.log(action)}
									/>
								</Td>
								<Td py={0} pl={0}>
									<ActionAll
										minW="82px"
										w="80px"
										size="xs"
										menuW="80px"
										isRowAction
										status={"approveStatus"}
										handleButtonClick={(action) => console.log(action)}
									/>
								</Td>
								<Td py={0} pl={0}>
									<ActionAll
										minW="82px"
										w="80px"
										size="xs"
										menuW="80px"
										isRowAction
										status={"approveStatus"}
										handleButtonClick={(action) => console.log(action)}
									/>
								</Td>
								<Td py={0} pl={0}>
									<ActionAll
										minW="82px"
										w="80px"
										size="xs"
										menuW="80px"
										isRowAction
										status={"approveStatus"}
										handleButtonClick={(action) => console.log(action)}
									/>
								</Td>
							</Tr>
						))}
					</Tbody>
				</Table>
			</Box>
			{showAddUser && (
				<OnboardEmpModal
					title="Add User"
					showOnboard={showAddUser}
					setShowOnboard={setShowAddUser}
					company={company}
				/>
			)}
		</PageLayout>
	);
};

export default Onboarding;
