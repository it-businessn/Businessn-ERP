import { Box, HStack } from "@chakra-ui/react";
import PublicLayout from "layouts/PublicLayout";

import { Button, Tab, TabList, TabPanel, TabPanels, Tabs, useToast } from "@chakra-ui/react";
import { tabStyleCss } from "erp-modules/payroll/onboard-user/customInfo";
import { useState } from "react";
import CompanyInfo from "./CompanyInfo";
import ContactInfo from "./ContactInfo";
import QueryInfo from "./QueryInfo";

import TextTitle from "components/ui/text/TextTitle";
import { FaChevronLeft, FaChevronRight, FaSave } from "react-icons/fa";
import TicketService from "services/TicketService";
import { WEBSITE_URL } from "constant";

const Support = () => {
	const toast = useToast();
	const ticketBasicInfo = {
		companyInfo: {
			companyName: "",
			clientId: "",
		},
		contactInfo: {
			clientFirstName: "",
			clientLastName: "",
			clientEmail: "",
			clientPhoneNumber: "",
			clientModeOfContact: "",
		},
		queryInfo: { inquiryType: "", issue: "" },
	};
	const [tabIndex, setTabIndex] = useState(0);
	const [formData, setFormData] = useState(ticketBasicInfo);

	const SUPPORT_TABS = [
		{
			name: "Company Details",
			content: <CompanyInfo formData={formData} setFormData={setFormData} />,
		},
		{
			name: "Contact Details",
			content: <ContactInfo formData={formData} setFormData={setFormData} />,
		},
		{
			name: "Explain the Issue",
			content: <QueryInfo formData={formData} setFormData={setFormData} />,
		},
	];
	const isLastStep = tabIndex === SUPPORT_TABS.length - 1;

	// `history.back() || WEB` never used the website (back() returns undefined
	// and a bare string does not navigate): go back if possible, else to the site.
	const handleRedirect = () => {
		if (window.history.length > 1) window.history.back();
		else window.location.href = WEBSITE_URL;
	};

	const handleSubmit = async () => {
		try {
			await TicketService.addSupportTicket(formData);
			toast({
				title: "Ticket submitted!",
				description: "Your support request has been sent successfully.",
				status: "success",
				duration: 2000,
				isClosable: true,
			});
			setTimeout(() => {
				handleRedirect();
			}, 2000);
		} catch (error) {
			toast({
				title: "Something went wrong.",
				description: "Please try again.",
				status: "error",
				duration: 3000,
				isClosable: true,
			});
		}
	};
	const getNextButtonIcon = () => {
		if (tabIndex === SUPPORT_TABS.length - 1) {
			return <FaSave />;
		}
		return <FaChevronRight />;
	};
	const getNextButtonAction = () => {
		if (isLastStep) {
			handleSubmit();
		} else {
			setTabIndex(tabIndex + 1);
		}
	};

	return (
		<PublicLayout action="signin" size="lg">
			<Box>
					<TextTitle size={"lg"} title="Need Support? Let Us Help" />
					<Tabs
						index={tabIndex}
						onChange={setTabIndex}
						variant="enclosed"
						colorScheme="purple"
						display="flex"
						flexDirection="column"
						sx={tabStyleCss}
						height="100%"
						isLazy
						lazyBehavior="unmount"
					>
						<TabList
							bg="gray.50"
							px={{ base: 0, md: 6 }}
							pt={5}
							pb={2}
							justifyContent="space-between"
						>
							{SUPPORT_TABS.map(({ name }) => (
								<Tab
									w="100%"
									key={name}
									fontWeight="semibold"
									_selected={{ color: "white", bg: "var(--banner_bg)" }}
								>
									{name}
								</Tab>
							))}
						</TabList>

						<TabPanels flex="1" overflow="hidden">
							{SUPPORT_TABS.map(({ name, content }, i) => (
								<TabPanel key={`${name}_content_${i}`}>{content}</TabPanel>
							))}
						</TabPanels>
					</Tabs>
					<HStack spacing={4} justify="end">
						{tabIndex > 0 && (
							<Button
								leftIcon={<FaChevronLeft />}
								onClick={() => setTabIndex(tabIndex - 1)}
								colorScheme="gray"
								variant="outline"
								px={6}
							>
								Back
							</Button>
						)}

						<Button
							rightIcon={getNextButtonIcon()}
							onClick={() => getNextButtonAction()}
							bg={"var(--banner_bg)"}
							color="white"
							_hover={{ bg: "#4a2b4a" }}
							px={6}
						>
							{isLastStep ? "Submit" : "Next"}
						</Button>

						<Button onClick={handleRedirect} variant="outline" px={6} colorScheme="gray">
							Cancel
						</Button>
					</HStack>
			</Box>
		</PublicLayout>
	);
};

export default Support;
