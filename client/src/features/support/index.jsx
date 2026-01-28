import { Box, Center, HStack, Image, Stack } from "@chakra-ui/react";

import { Button, Tab, TabList, TabPanel, TabPanels, Tabs, useToast } from "@chakra-ui/react";
import { tabScrollCss, tabStyleCss } from "erp-modules/payroll/onboard-user/customInfo";
import { useState } from "react";
import CompanyInfo from "./CompanyInfo";
import ContactInfo from "./ContactInfo";
import QueryInfo from "./QueryInfo";

import TextTitle from "components/ui/text/TextTitle";
import { FaChevronLeft, FaChevronRight, FaSave } from "react-icons/fa";
import { Link } from "react-router-dom";
import TicketService from "services/TicketService";
import logoImgSrc from "../../assets/logos/logoCover.png";

const Support = () => {
	const WEB = process.env.WEBSITE;
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

	const handleRedirect = () => window.history.back() || WEB;

	const handleSubmit = async () => {
		try {
			const { data } = await TicketService.addSupportTicket(formData);
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
		<Box
			padding={"1em"}
			backgroundColor="var(--logo_bg)"
			h={"100vh"}
			overflow={"auto"}
			css={tabScrollCss}
		>
			<Stack w={{ base: "100%", lg: "60%" }} m="0 auto" spacing={10} borderRadius={"lg"}>
				<Center>
					<Link to="/">
						<Image
							width={200}
							m={"0 auto"}
							objectFit="contain"
							src={logoImgSrc}
							alt="Company logo"
						/>
					</Link>
				</Center>
				<Box
					borderRadius={"lg"}
					w={"100%"}
					backgroundColor="var(--main_color)"
					p="2em"
					m="1em auto"
				>
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
			</Stack>
		</Box>
	);
};

export default Support;
