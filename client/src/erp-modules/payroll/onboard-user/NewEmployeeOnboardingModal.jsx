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

import PayrollService from "services/PayrollService";
import BankingInfo from "./BankingInfo";
import BenefitInfo from "./BenefitInfo";
import EmploymentInfo from "./EmploymentInfo";
import GovernmentInfo from "./GovernmentInfo";
import PayInfo from "./PayInfo";
import PersonalInfo from "./PersonalInfo";
import {
	bankingSubSteps,
	benefitsSubSteps,
	COUNTRIES,
	employmentSubSteps,
	governmentSubSteps,
	personalSubSteps,
	tabStyleCss,
	trimText,
	userInfoDetails,
} from "./customInfo";

const NewEmployeeOnboardingModal = ({ isOpen, onClose }) => {
	const company = LocalStorageService.getItem("selectedCompany");
	const toast = useToast();

	const [tabIndex, setTabIndex] = useState(0);
	const [personalSubStep, setPersonalSubStep] = useState(0);
	const [employmentSubStep, setEmploymentSubStep] = useState(0);
	const [benefitsSubStep, setBenefitsSubStep] = useState(0);
	const [governmentSubStep, setGovernmentSubStep] = useState(0);
	const [bankingSubStep, setBankingSubStep] = useState(0);
	const [formData, setFormData] = useState(userInfoDetails);
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
					formData={formData}
					handleChange={handleChange}
					employmentProvinces={employmentProvinces}
					company={company}
				/>
			),
		},
		{
			name: "Pay",
			content: <PayInfo formData={formData} handleChange={handleChange} />,
		},
		{
			name: "Benefits",
			content: (
				<BenefitInfo
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
					formData={formData}
					handleChange={handleChange}
				/>
			),
		},
	];

	useEffect(() => {
		if (formData.personalInfo.firstName) {
			setFormData({
				...formData,
				personalInfo: {
					...formData.personalInfo,
					firstName: trimText(formData.personalInfo.firstName),
				},
			});
		}
	}, [formData.personalInfo.firstName]);

	useEffect(() => {
		if (formData.personalInfo.middleName) {
			setFormData({
				...formData,
				personalInfo: {
					...formData.personalInfo,
					middleName: trimText(formData.personalInfo.middleName),
				},
			});
		}
	}, [formData.personalInfo.middleName]);

	useEffect(() => {
		if (formData.personalInfo.lastName) {
			setFormData({
				...formData,
				personalInfo: {
					...formData.personalInfo,
					lastName: trimText(formData.personalInfo.lastName),
				},
			});
		}
	}, [formData.personalInfo.lastName]);

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
		if (tabIndex === 0 && personalSubStep < personalSubSteps.length - 1) {
			// Handle personal info sub-steps
			setPersonalSubStep(personalSubStep + 1);
		} else if (tabIndex === 1 && employmentSubStep < employmentSubSteps?.length - 1) {
			// Handle employment info sub-steps
			setEmploymentSubStep(employmentSubStep + 1);
		} else if (tabIndex === 3 && benefitsSubStep < benefitsSubSteps.length - 1) {
			// Handle benefits sub-steps
			setBenefitsSubStep(benefitsSubStep + 1);
		} else if (tabIndex === 4 && governmentSubStep < governmentSubSteps.length - 1) {
			// Handle government sub-steps
			setGovernmentSubStep(governmentSubStep + 1);
		} else if (tabIndex === 5 && bankingSubStep < bankingSubSteps.length - 1) {
			// Handle banking sub-steps
			setBankingSubStep(bankingSubStep + 1);
		} else if (tabIndex < ONBOARD_TABS.length - 1) {
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
				setGovernmentSubStep(1);
			} else if (tabIndex === 6) {
				setBankingSubStep(1);
			}
		}
	};

	const handleSubmit = async () => {
		try {
			formData.companyName = company;
			const { data } = await PayrollService.onboardUser(formData);
			console.log("newEmpDetails=", data);
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
			return personalSubStep < personalSubSteps.length - 1 ? "Continue" : "Next: Employment";
		} else if (tabIndex === 1) {
			return employmentSubStep < employmentSubSteps.length - 1 ? "Continue" : "Next: Pay";
		} else if (tabIndex === 2) {
			return "Next: Benefits";
		} else if (tabIndex === 3) {
			return benefitsSubStep < benefitsSubSteps.length - 1 ? "Continue" : "Next: Government";
		} else if (tabIndex === 4) {
			return governmentSubStep < governmentSubSteps.length - 1 ? "Continue" : "Next: Banking";
		} else if (tabIndex === 5) {
			return bankingSubStep < 1 ? "Continue" : "Save Employee";
		}
		return "Save Employee";
	};

	// Get button icon based on current tab and sub-step
	const getNextButtonIcon = () => {
		if (tabIndex === ONBOARD_TABS.length - 1 && bankingSubStep === 1) {
			return <FaSave />;
		}
		return <FaChevronRight />;
	};

	// Determine if we're on the last step of the entire form
	const isLastStep = tabIndex === ONBOARD_TABS.length - 1 && bankingSubStep === 1;

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
						<TabList
							bg="gray.50"
							px={6}
							pt={5}
							pb={2}
							flexShrink={0}
							justifyContent="space-between"
						>
							{ONBOARD_TABS.map(({ name }) => (
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
