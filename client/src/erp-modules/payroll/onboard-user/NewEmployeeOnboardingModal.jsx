import {
	Button,
	Flex,
	HStack,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	Tab,
	TabList,
	TabPanel,
	TabPanels,
	Tabs,
	Text,
	useToast,
} from "@chakra-ui/react";

import { useEffect, useState } from "react";
import { FaChevronLeft, FaChevronRight, FaSave, FaUserPlus } from "react-icons/fa";
import LocalStorageService from "services/LocalStorageService";
import { generateLighterShade } from "utils";

import PayrollService from "services/PayrollService";
import BankingInfo from "./BankingInfo";
import BenefitInfo from "./BenefitInfo";
import EmploymentInfo from "./EmploymentInfo";
import GovernmentInfo from "./GovernmentInfo";
import PayInfo from "./PayInfo";
import PersonalInfo from "./PersonalInfo";
import { COUNTRIES, userInfoDetails } from "./userInfoDetails";

const NewEmployeeOnboardingModal = ({ isOpen, onClose }) => {
	const company = LocalStorageService.getItem("selectedCompany");
	const toast = useToast();

	const tabStyleCss = {
		".chakra-tabs__tab-panel": {
			padding: 0,
			height: "100%",
			overflow: "hidden",
			display: "flex",
			flexDirection: "column",
		},
		".chakra-tabs__tablist": {
			borderColor: "gray.200",
			flexShrink: 0,
		},
		".chakra-tabs__tab[aria-selected=true]": {
			color: "white",
			bg: "var(--banner_bg)",
			borderColor: "transparent",
		},
		".chakra-tabs__tab[aria-selected=true]:focus": {
			boxShadow: "none",
		},
		".chakra-tabs__tab:hover": {
			bg: generateLighterShade("#371f37", 0.8),
		},
	};

	const tabPanelStyleCss = {
		".chakra-step__separator": {
			minHeight: "40px",
		},
		".chakra-step__separator[data-status=active]": {
			bg: "var(--banner_bg)",
		},
		".chakra-step__separator[data-status=complete]": {
			bg: "var(--banner_bg)",
		},
		".chakra-step__indicator[data-status=complete]": {
			bg: "var(--banner_bg)",
			borderColor: "var(--banner_bg)",
		},
		".chakra-step__indicator[data-status=active]": {
			bg: "var(--banner_bg)",
			borderColor: "var(--banner_bg)",
		},
		".chakra-step__indicator": {
			width: "36px",
			height: "36px",
		},
	};

	const tabScrollCss = {
		"&::-webkit-scrollbar": {
			width: "8px",
		},
		"&::-webkit-scrollbar-track": {
			background: "#f1f1f1",
			borderRadius: "4px",
		},
		"&::-webkit-scrollbar-thumb": {
			background: "#c5c5c5",
			borderRadius: "4px",
		},
		"&::-webkit-scrollbar-thumb:hover": {
			background: "#a8a8a8",
		},
	};

	const [tabIndex, setTabIndex] = useState(0);
	const [personalSubStep, setPersonalSubStep] = useState(0);
	const [employmentSubStep, setEmploymentSubStep] = useState(0);
	const [benefitsSubStep, setBenefitsSubStep] = useState(0);
	const [governmentSubStep, setGovernmentSubStep] = useState(0);
	const [bankingSubStep, setBankingSubStep] = useState(0);
	const [formData, setFormData] = useState(userInfoDetails);
	const [dataRefresh, setDataRefresh] = useState(false);
	const [availableProvinces, setAvailableProvinces] = useState([]);
	const [employmentProvinces, setEmploymentProvinces] = useState([]);
	const [governmentProvinces, setGovernmentProvinces] = useState([]);

	const handleChange = (section, field, value) => {
		setFormData({
			...formData,
			[section]: {
				...formData[section],
				[field]: value,
			},
		});
	};

	const ONBOARD_TABS = [
		{
			name: "Personal Info",
			content: (
				<PersonalInfo
					personalSubStep={personalSubStep}
					setPersonalSubStep={setPersonalSubStep}
					tabPanelStyleCss={tabPanelStyleCss}
					tabScrollCss={tabScrollCss}
					formData={formData}
					handleChange={handleChange}
					availableProvinces={availableProvinces}
				/>
			),
		},
		{
			name: "Employment",
			content: (
				<EmploymentInfo
					employmentSubStep={employmentSubStep}
					setEmploymentSubStep={setEmploymentSubStep}
					tabPanelStyleCss={tabPanelStyleCss}
					tabScrollCss={tabScrollCss}
					formData={formData}
					handleChange={handleChange}
					employmentProvinces={employmentProvinces}
					company={company}
					dataRefresh={dataRefresh}
				/>
			),
		},
		{
			name: "Pay",
			content: (
				<PayInfo tabScrollCss={tabScrollCss} formData={formData} handleChange={handleChange} />
			),
		},
		{
			name: "Benefits",
			content: (
				<BenefitInfo
					tabPanelStyleCss={tabPanelStyleCss}
					tabScrollCss={tabScrollCss}
					formData={formData}
					handleChange={handleChange}
					benefitsSubStep={benefitsSubStep}
					setBenefitsSubStep={setBenefitsSubStep}
				/>
			),
		},
		{
			name: "Government",
			content: (
				<GovernmentInfo
					governmentSubStep={governmentSubStep}
					setGovernmentSubStep={setGovernmentSubStep}
					tabPanelStyleCss={tabPanelStyleCss}
					tabScrollCss={tabScrollCss}
					formData={formData}
					handleChange={handleChange}
					governmentProvinces={governmentProvinces}
				/>
			),
		},
		{
			name: "Banking",
			content: (
				<BankingInfo
					bankingSubStep={bankingSubStep}
					setBankingSubStep={setBankingSubStep}
					tabPanelStyleCss={tabPanelStyleCss}
					tabScrollCss={tabScrollCss}
					formData={formData}
					handleChange={handleChange}
				/>
			),
		},
	];

	// Update provinces when country changes
	useEffect(() => {
		const selectedCountry = COUNTRIES.find(
			(country) => country.type === formData.contactInfo.country,
		);
		if (selectedCountry) {
			setAvailableProvinces(selectedCountry?.provinces);
			// Reset province if changing country
			if (!selectedCountry.provinces.includes(formData.contactInfo.province)) {
				setFormData({
					...formData,
					contactInfo: {
						...formData.contactInfo,
						province: selectedCountry.provinces[0],
					},
				});
			}
		}
	}, [formData.contactInfo.country]);

	// Update provinces when employment country changes
	useEffect(() => {
		const selectedCountry = COUNTRIES.find(
			(country) => country.type === formData.employmentInfo.employmentCountry,
		);
		if (selectedCountry) {
			setEmploymentProvinces(selectedCountry.provinces);
			// Reset province if changing country
			if (!selectedCountry.provinces.includes(formData.employmentInfo.employmentRegion)) {
				setFormData({
					...formData,
					employmentInfo: {
						...formData.employmentInfo,
						province: selectedCountry.provinces[0],
					},
				});
			}
		}
	}, [formData.employmentInfo.employmentCountry]);

	// Update government provinces when federal tax changes
	useEffect(() => {
		const selectedCountry = COUNTRIES.find(
			(country) => country.type === formData.governmentInfo.federalTax,
		);
		if (selectedCountry) {
			setGovernmentProvinces(selectedCountry.provinces);
			// Reset regional tax if changing federal tax country
			if (!selectedCountry.provinces.includes(formData.governmentInfo.regionalTax)) {
				setFormData({
					...formData,
					governmentInfo: {
						...formData.governmentInfo,
						regionalTax: selectedCountry.provinces[0],
					},
				});
			}
		}
	}, [formData.governmentInfo.federalTax]);

	const handleNextTab = () => {
		if (tabIndex === 0 && personalSubStep < 2) {
			// Handle personal info sub-steps
			setPersonalSubStep(personalSubStep + 1);
		} else if (tabIndex === 1 && employmentSubStep < 2) {
			// Handle employment info sub-steps
			setEmploymentSubStep(employmentSubStep + 1);
		} else if (tabIndex === 3 && benefitsSubStep < 2) {
			// Handle benefits sub-steps
			setBenefitsSubStep(benefitsSubStep + 1);
		} else if (tabIndex === 4 && governmentSubStep < 3) {
			// Handle government sub-steps
			setGovernmentSubStep(governmentSubStep + 1);
		} else if (tabIndex === 5 && bankingSubStep < 1) {
			// Handle banking sub-steps
			setBankingSubStep(bankingSubStep + 1);
		} else if (tabIndex < 5) {
			// Move to next main tab
			setTabIndex(tabIndex + 1);
			// Reset sub-steps when leaving tabs
			if (tabIndex === 0) {
				setPersonalSubStep(0);
			} else if (tabIndex === 1) {
				setEmploymentSubStep(0);
			} else if (tabIndex === 3) {
				setBenefitsSubStep(0);
			} else if (tabIndex === 4) {
				setGovernmentSubStep(0);
			}
		}
	};

	const handlePreviousTab = () => {
		if (tabIndex === 0 && personalSubStep > 0) {
			// Handle personal info sub-steps
			setPersonalSubStep(personalSubStep - 1);
		} else if (tabIndex === 1 && employmentSubStep > 0) {
			// Handle employment info sub-steps
			setEmploymentSubStep(employmentSubStep - 1);
		} else if (tabIndex === 3 && benefitsSubStep > 0) {
			// Handle benefits sub-steps
			setBenefitsSubStep(benefitsSubStep - 1);
		} else if (tabIndex === 4 && governmentSubStep > 0) {
			// Handle government sub-steps
			setGovernmentSubStep(governmentSubStep - 1);
		} else if (tabIndex === 5 && bankingSubStep > 0) {
			// Handle banking sub-steps
			setBankingSubStep(bankingSubStep - 1);
		} else if (tabIndex > 0) {
			// Move to previous main tab
			setTabIndex(tabIndex - 1);
			// If moving back to personal info tab, go to last sub-step
			if (tabIndex === 1) {
				setPersonalSubStep(2);
			} else if (tabIndex === 2) {
				setEmploymentSubStep(2);
			} else if (tabIndex === 3) {
				// coming from benefits to pay
				// no sub-steps
			} else if (tabIndex === 4) {
				setBenefitsSubStep(2);
			} else if (tabIndex === 5) {
				setGovernmentSubStep(3);
			} else if (tabIndex === 6) {
				setBankingSubStep(1);
			}
		}
	};

	const handleSubmit = async () => {
		try {
			formData.companyName = company;
			const { data } = await PayrollService.onboardUser(formData);

			toast({
				title: "Employee added successfully",
				status: "success",
				duration: 3000,
				isClosable: true,
			});
		} catch (error) {
			toast({
				title: "Something went wrong.",
				description: "Please try again.",
				status: "error",
				duration: 3000,
				isClosable: true,
			});
		} finally {
			onClose();
		}
	};

	// Get button text based on current tab and sub-step
	const getNextButtonText = () => {
		if (tabIndex === 0) {
			return personalSubStep < 2 ? "Continue" : "Next: Employment";
		} else if (tabIndex === 1) {
			return employmentSubStep < 2 ? "Continue" : "Next: Pay";
		} else if (tabIndex === 2) {
			return "Next: Benefits";
		} else if (tabIndex === 3) {
			return benefitsSubStep < 2 ? "Continue" : "Next: Government";
		} else if (tabIndex === 4) {
			return governmentSubStep < 3 ? "Continue" : "Next: Banking";
		} else if (tabIndex === 5) {
			return bankingSubStep < 1 ? "Continue" : "Save Employee";
		}
		return "Save Employee";
	};

	// Get button icon based on current tab and sub-step
	const getNextButtonIcon = () => {
		if (tabIndex === 5 && bankingSubStep === 1) {
			return <FaSave />;
		}
		return <FaChevronRight />;
	};

	// Determine if we're on the last step of the entire form
	const isLastStep = tabIndex === 5 && bankingSubStep === 1;

	// Determine button action based on current tab and sub-step
	const getNextButtonAction = () => {
		if (isLastStep) {
			return handleSubmit;
		}
		return handleNextTab;
	};

	return (
		<Modal isOpen={isOpen} onClose={onClose} size="5xl" isCentered motionPreset="slideInBottom">
			<ModalOverlay bg="rgba(0, 0, 0, 0.4)" backdropFilter="blur(8px)" />
			<ModalContent
				height="700px"
				maxH="80vh"
				borderRadius="lg"
				boxShadow="2xl"
				display="flex"
				flexDirection="column"
			>
				<ModalHeader
					bg="var(--banner_bg)"
					color="white"
					borderTopRadius="lg"
					py={5}
					position="relative"
					flexShrink={0}
				>
					<Flex align="center" gap={3} fontSize="xl">
						<FaUserPlus />
						<Text fontWeight="bold">Add New Employee</Text>
					</Flex>
					<ModalCloseButton
						color="#000"
						top="16px"
						right="16px"
						bg="rgba(255, 255, 255, 0.1)"
						borderRadius="full"
						_hover={{
							bg: "rgba(255, 255, 255, 0.2)",
							transform: "scale(1.1)",
						}}
						_active={{
							bg: "rgba(255, 255, 255, 0.3)",
						}}
						aria-label="Close modal"
						title="Close"
						zIndex="10"
					/>
				</ModalHeader>

				<ModalBody p={0} flex="1" overflow="hidden" display="flex" flexDirection="column">
					<Tabs
						index={tabIndex}
						onChange={setTabIndex}
						variant="enclosed"
						colorScheme="purple"
						display="flex"
						flexDirection="column"
						height="100%"
						sx={tabStyleCss}
					>
						<TabList bg="gray.50" px={6} pt={5} pb={2} flexShrink={0}>
							{ONBOARD_TABS.map(({ name }) => (
								<Tab
									key={name}
									fontWeight="semibold"
									px={8}
									_selected={{ color: "white", bg: "var(--banner_bg)" }}
								>
									{name}
								</Tab>
							))}
						</TabList>

						{/* Personal Info Tab with Sub-steps */}
						<TabPanels flex="1" overflow="hidden">
							{ONBOARD_TABS.map(({ name, content }, i) => (
								<TabPanel key={`${name}_content_${i}`}>{content}</TabPanel>
							))}
						</TabPanels>
					</Tabs>
				</ModalBody>

				<ModalFooter bg="gray.50" borderBottomRadius="lg" py={5} flexShrink={0}>
					<HStack spacing={4}>
						{(tabIndex > 0 || personalSubStep > 0 || employmentSubStep > 0) && (
							<Button
								leftIcon={<FaChevronLeft />}
								onClick={handlePreviousTab}
								colorScheme="gray"
								variant="outline"
								px={6}
							>
								Back
							</Button>
						)}

						<Button
							rightIcon={getNextButtonIcon()}
							onClick={getNextButtonAction()}
							bg={isLastStep ? "var(--banner_bg)" : "var(--banner_bg)"}
							color="white"
							_hover={{ bg: "#4a2b4a" }}
							px={6}
						>
							{getNextButtonText()}
						</Button>

						<Button
							onClick={onClose}
							variant="ghost"
							px={6}
							color="gray.600"
							_hover={{ bg: "gray.100" }}
						>
							Cancel
						</Button>
					</HStack>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};

export default NewEmployeeOnboardingModal;
