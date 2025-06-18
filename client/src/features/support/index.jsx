import { Center, HStack, Stack } from "@chakra-ui/react";

import { Button, Tab, TabList, TabPanel, TabPanels, Tabs, useToast } from "@chakra-ui/react";
import { tabStyleCss } from "erp-modules/payroll/onboard-user/customInfo";
import PageLayout from "layouts/PageLayout";
import { useState } from "react";
import CompanyInfo from "./CompanyInfo";
import ContactInfo from "./ContactInfo";
import QueryInfo from "./QueryInfo";

import BoxCard from "components/ui/card";
import TextTitle from "components/ui/text/TextTitle";
import { FaChevronLeft, FaChevronRight, FaSave } from "react-icons/fa";
import TicketService from "services/TicketService";

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

	const WEB = "https://www.businessn.com";
	const handleRedirect = () => (window.location.href = WEB);
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
		<Stack w={{ base: "100%", lg: "60%" }} m="auto" spacing={10}>
			<Center pos="sticky" top={30} zIndex={1}>
				<a href={WEB} aria-current="page" className="main-logo w-inline-block w--current">
					<img
						src="https://cdn.prod.website-files.com/66d2b99c721c32f423762484/66dade9174eaeb438087f3ff_logo.png"
						loading="lazy"
						sizes="(max-width: 479px) 50vw, (max-width: 767px) 180px, (max-width: 991px) 23vw, 213px"
						srcSet="https://cdn.prod.website-files.com/66d2b99c721c32f423762484/66dade9174eaeb438087f3ff_logo-p-500.png 500w, https://cdn.prod.website-files.com/66d2b99c721c32f423762484/66dade9174eaeb438087f3ff_logo-p-800.png 800w, https://cdn.prod.website-files.com/66d2b99c721c32f423762484/66dade9174eaeb438087f3ff_logo.png 852w"
						alt="main-logo"
					/>
				</a>
			</Center>
			<PageLayout title="">
				<BoxCard>
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
				</BoxCard>
			</PageLayout>
		</Stack>
	);
};

export default Support;
