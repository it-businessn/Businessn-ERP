import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Stack,
  Step,
  StepDescription,
  StepIcon,
  StepIndicator,
  StepNumber,
  StepSeparator,
  StepStatus,
  StepTitle,
  Stepper,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useToast,
  SimpleGrid,
  Divider,
  Spinner,
  Tooltip,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import {
  FaChevronLeft,
  FaChevronRight,
  FaSave,
  FaUserPlus,
  FaPlus,
  FaInfoCircle,
} from "react-icons/fa";
import useCompany from "hooks/useCompany";
import LocalStorageService from "services/LocalStorageService";
import useCostCenter from "hooks/useCostCenter";
import useDepartment from "hooks/useDepartment";
import usePaygroup from "hooks/usePaygroup";
import usePositionRoles from "hooks/usePositionRoles";
import useRoles from "hooks/useRoles";
import * as Yup from "yup";

// Custom theme colors
const THEME_COLOR = "#371f37";

// Country data for dropdowns
const COUNTRIES = [
  {
    type: "Canada",
    dependent: false,
    provinces: [
      "Alberta",
      "British Columbia",
      "Manitoba",
      "New Brunswick",
      "Newfoundland and Labrador",
      "Nova Scotia",
      "Ontario",
      "Prince Edward Island",
      "Quebec",
      "Saskatchewan",
      "Northwest Territories",
      "Nunavut",
      "Yukon",
    ],
  },
  {
    type: "US",
    dependent: false,
    provinces: [
      "Alabama",
      "Alaska",
      "Arizona",
      "Arkansas",
      "California",
      "Colorado",
      "Connecticut",
      "Delaware",
      "Florida",
      "Georgia",
      "Hawaii",
      "Idaho",
      "Illinois",
      "Indiana",
      "Iowa",
      "Kansas",
      "Kentucky",
      "Louisiana",
      "Maine",
      "Maryland",
      "Massachusetts",
      "Michigan",
      "Minnesota",
      "Mississippi",
      "Missouri",
      "Montana",
      "Nebraska",
      "Nevada",
      "New Hampshire",
      "New Jersey",
      "New Mexico",
      "New York",
      "North Carolina",
      "North Dakota",
      "Ohio",
      "Oklahoma",
      "Oregon",
      "Pennsylvania",
      "Rhode Island",
      "South Carolina",
      "South Dakota",
      "Tennessee",
      "Texas",
      "Utah",
      "Vermont",
      "Virginia",
      "Washington",
      "West Virginia",
      "Wisconsin",
      "Wyoming",
    ],
  },
];

// Payroll status options
const PAYROLL_STATUS = [
  {
    type: "Payroll Active",
    dependent: false,
  },
  {
    type: "Include final pay in next pay period",
    dependent: false,
  },
  {
    type: "Do not include final pay in next pay period",
    dependent: false,
  },
  {
    type: "Payroll Terminated",
    dependent: false,
  },
];

// Banking validation schema
const BankingFormSchema = Yup.object().shape({
  bankNum: Yup.string()
    .matches(/^\d{3}$/, "Bank number must be exactly 3 digits")
    .required("Bank number is required"),
  transitNum: Yup.string()
    .matches(/^\d{5}$/, "Transit number must be exactly 5 digits")
    .required("Transit number is required"),
  accountNum: Yup.string()
    .matches(/^\d{7,16}$/, "Account number must be between 7 and 16 digits")
    .required("Account number is required"),
});

const NewEmployeeOnboardingModal = ({ isOpen, onClose }) => {
  const toast = useToast();
  const [tabIndex, setTabIndex] = useState(0);
  const [personalSubStep, setPersonalSubStep] = useState(0);
  const [employmentSubStep, setEmploymentSubStep] = useState(0);
  const [benefitsSubStep, setBenefitsSubStep] = useState(0);
  const [governmentSubStep, setGovernmentSubStep] = useState(0);
  const [bankingSubStep, setBankingSubStep] = useState(0);
  const [formData, setFormData] = useState({
    personalInfo: {
      firstName: "",
      middleName: "",
      lastName: "",
      dateOfBirth: "",
      gender: "",
      ssn: "",
      workPermitNumber: "",
      workPermitExpiry: "",
      citizenship: "Yes",
    },
    contactInfo: {
      email: "",
      workEmail: "",
      personalPhone: "",
      workPhone: "",
      address: "",
      city: "",
      state: "",
      country: "Canada",
      province: "British Columbia",
      zipCode: "",
    },
    emergencyContact: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      relationship: "",
    },
    employmentInfo: {
      status: "Payroll Active",
      employeeNo: "",
      systemAccessLevel: "Employee",
      jobTitle: "",
      payGroup: "",
      timeManagementBadgeID: "",
      costCenter: "",
      employeeCardNumber: "",
      department: "",
      startDate: "",
      country: "Canada",
      province: "British Columbia",
      branch: "",
      branchAddress: "",
      branchCity: "",
      branchZipCode: "",
    },
    payInfo: {
      salary: "",
      payType: "hourly",
      payFrequency: "biweekly",
      taxWithholding: "",
    },
    benefitsInfo: {
      // Vacation
      typeOfVacationTreatment: "Accrued",
      vacationPayPercent: "",
      YTDVacationAccrued: "0.00",
      YTDVacationUsed: "0.00",
      vacationAdjustment: "",

      // Employer Contributions
      typeOfPensionERTreatment: "No Pension Contributions",
      pensionERContribution: "",
      typeOfDentalERTreatment: "No Dental Contributions",
      dentalERContribution: "",
      typeOfExtendedHealthERTreatment: "No Extended Health Contributions",
      extendedHealthERContribution: "",

      // Employee Contributions
      typeOfPensionEETreatment: "No Pension Contributions",
      pensionEEContribution: "",
      typeOfDentalEETreatment: "No Dental Contributions",
      dentalEEContribution: "",
      typeOfExtendedHealthEETreatment: "No Extended Health Contributions",
      extendedHealthEEContribution: "",
      typeOfUnionDuesTreatment: "No Union Contributions",
      unionDuesContribution: "",
    },
    governmentInfo: {
      // Exemptions
      isCPPExempt: false,
      isEIExempt: false,

      // Income Tax
      federalTax: "Canada",
      regionalTax: "British Columbia",
      federalTaxCredit: "0",
      regionalTaxCredit: "0",

      // Federal Government Contributions
      federalPensionEE: "",
      federalEmploymentInsuranceEE: "",
      federalPensionER: "",
      federalEmploymentInsuranceER: "",

      // Regional Government Deductions
      regionalEmployeeInjury: "",
      regionalEmployeeHealth: "",
      regionalEmployerInjury: "",
      regionalEmployerHealth: "",
    },
    bankingInfo: {
      // Payment Notification
      payStubSendByEmail: "Yes",
      paymentEmail: "",

      // Banking Info
      directDeposit: "Yes",
      bankNum: "",
      transitNum: "",
      accountNum: "",
    },
  });

  // State for available provinces based on selected country
  const [availableProvinces, setAvailableProvinces] = useState(
    COUNTRIES.find((country) => country.type === formData.contactInfo.country)?.provinces || []
  );

  // State for available provinces based on employment region country
  const [employmentProvinces, setEmploymentProvinces] = useState(
    COUNTRIES.find((country) => country.type === formData.employmentInfo.country)?.provinces || []
  );

  // State for available provinces based on government federal tax
  const [governmentProvinces, setGovernmentProvinces] = useState(
    COUNTRIES.find((country) => country.type === formData.governmentInfo.federalTax)?.provinces ||
      []
  );

  // State for form validation errors
  const [bankingErrors, setBankingErrors] = useState({
    bankNum: "",
    transitNum: "",
    accountNum: "",
  });

  // State for form touched fields
  const [bankingTouched, setBankingTouched] = useState({
    bankNum: false,
    transitNum: false,
    accountNum: false,
  });

  // Update provinces when country changes
  useEffect(() => {
    const selectedCountry = COUNTRIES.find(
      (country) => country.type === formData.contactInfo.country
    );
    if (selectedCountry) {
      setAvailableProvinces(selectedCountry.provinces);
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
      (country) => country.type === formData.employmentInfo.country
    );
    if (selectedCountry) {
      setEmploymentProvinces(selectedCountry.provinces);
      // Reset province if changing country
      if (!selectedCountry.provinces.includes(formData.employmentInfo.province)) {
        setFormData({
          ...formData,
          employmentInfo: {
            ...formData.employmentInfo,
            province: selectedCountry.provinces[0],
          },
        });
      }
    }
  }, [formData.employmentInfo.country]);

  // Update government provinces when federal tax changes
  useEffect(() => {
    const selectedCountry = COUNTRIES.find(
      (country) => country.type === formData.governmentInfo.federalTax
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

  // Get company from LocalStorage
  const company = LocalStorageService.getItem("selectedCompany");

  // Use hooks to fetch dynamic data
  const { company: companyInfo } = useCompany(company);
  const [dataRefresh, setDataRefresh] = useState(false);

  // Dynamic data hooks
  const costCentres = useCostCenter(company, dataRefresh);
  const departments = useDepartment(company, dataRefresh);
  const positionRoles = usePositionRoles(company, dataRefresh);
  const roles = useRoles(company, dataRefresh);
  const { hasMultiPaygroups, selectedPayGroup, payGroups } = usePaygroup(company, dataRefresh);

  const handleChange = (section, field, value) => {
    setFormData({
      ...formData,
      [section]: {
        ...formData[section],
        [field]: value,
      },
    });

    // Validate banking fields on change if they have been touched
    if (section === "bankingInfo" && bankingTouched[field]) {
      validateBankingField(field, value);
    }
  };

  // Handle banking form field blur for validation
  const handleBankingBlur = (field) => {
    setBankingTouched({
      ...bankingTouched,
      [field]: true,
    });

    validateBankingField(field, formData.bankingInfo[field]);
  };

  // Validate banking form fields
  const validateBankingField = (field, value) => {
    try {
      const schema = BankingFormSchema.pick([field]);
      schema.validateSync({ [field]: value });
      setBankingErrors({
        ...bankingErrors,
        [field]: "",
      });
      return true;
    } catch (error) {
      setBankingErrors({
        ...bankingErrors,
        [field]: error.message,
      });
      return false;
    }
  };

  // Validate all banking fields
  const validateBankingForm = () => {
    try {
      BankingFormSchema.validateSync(
        {
          bankNum: formData.bankingInfo.bankNum,
          transitNum: formData.bankingInfo.transitNum,
          accountNum: formData.bankingInfo.accountNum,
        },
        { abortEarly: false }
      );
      return true;
    } catch (error) {
      const errors = {};
      error.inner.forEach((e) => {
        errors[e.path] = e.message;
      });
      setBankingErrors(errors);

      // Mark all fields as touched
      setBankingTouched({
        bankNum: true,
        transitNum: true,
        accountNum: true,
      });

      return false;
    }
  };

  // Handle banking form submission
  const handleBankingSubmit = () => {
    if (formData.bankingInfo.directDeposit === "No" || validateBankingForm()) {
      toast({
        title: "Banking information saved",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    }
  };

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

  const handleSubmit = () => {
    // Here you would typically send the data to your API
    console.log("Submitting employee data:", formData);

    toast({
      title: "Employee added successfully",
      status: "success",
      duration: 3000,
      isClosable: true,
    });

    // Call the onClose function from props
    onClose();
  };

  // Labels for the personal info sub-steps
  const personalSubSteps = [
    { title: "Basic Info", description: "Name & Identification" },
    { title: "Contact Info", description: "Email & Phone" },
    { title: "Emergency Contact", description: "Emergency details" },
  ];

  // Labels for the employment info sub-steps
  const employmentSubSteps = [
    { title: "Identification & Status", description: "Basic employment details" },
    { title: "Position", description: "Job details" },
    { title: "Region", description: "Location info" },
  ];

  // Labels for the benefits sub-steps
  const benefitsSubSteps = [
    { title: "Vacation", description: "Vacation settings" },
    { title: "Employer Contributions", description: "Company benefits" },
    { title: "Employee Contributions", description: "Employee deductions" },
  ];

  // Labels for the government sub-steps
  const governmentSubSteps = [
    { title: "Exemption", description: "CPP/EI exemptions" },
    { title: "Income Tax", description: "Tax settings" },
    { title: "Federal Contributions", description: "Federal deductions" },
    { title: "Regional Deductions", description: "Provincial deductions" },
  ];

  // Labels for the banking sub-steps
  const bankingSubSteps = [
    { title: "Payment Notification", description: "Paystub delivery" },
    { title: "Banking Info", description: "Direct deposit details" },
  ];

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
    <>
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
            bg="var(--main_color)"
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
              color="white"
              size="lg"
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
              size="lg"
              display="flex"
              flexDirection="column"
              height="100%"
              sx={{
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
                  bg: THEME_COLOR,
                  borderColor: "transparent",
                },
                ".chakra-tabs__tab[aria-selected=true]:focus": {
                  boxShadow: "none",
                },
                ".chakra-tabs__tab:hover": {
                  bg: `${THEME_COLOR}20`,
                },
              }}
            >
              <TabList bg="gray.50" px={6} pt={5} pb={2} flexShrink={0}>
                <Tab fontWeight="semibold" px={8} _selected={{ color: "white", bg: THEME_COLOR }}>
                  Personal Info
                </Tab>
                <Tab fontWeight="semibold" px={8} _selected={{ color: "white", bg: THEME_COLOR }}>
                  Employment
                </Tab>
                <Tab fontWeight="semibold" px={8} _selected={{ color: "white", bg: THEME_COLOR }}>
                  Pay
                </Tab>
                <Tab fontWeight="semibold" px={8} _selected={{ color: "white", bg: THEME_COLOR }}>
                  Benefits
                </Tab>
                <Tab fontWeight="semibold" px={8} _selected={{ color: "white", bg: THEME_COLOR }}>
                  Government
                </Tab>
                <Tab fontWeight="semibold" px={8} _selected={{ color: "white", bg: THEME_COLOR }}>
                  Banking
                </Tab>
              </TabList>

              <TabPanels flex="1" overflow="hidden">
                {/* Personal Info Tab with Sub-steps */}
                <TabPanel>
                  <Flex height="100%">
                    {/* Vertical Sub-step Stepper */}
                    <Box
                      p={6}
                      width="280px"
                      borderRight="1px solid"
                      borderColor="gray.200"
                      flexShrink={0}
                      bg="gray.50"
                    >
                      <Stepper
                        index={personalSubStep}
                        orientation="vertical"
                        size="lg"
                        gap={8}
                        sx={{
                          ".chakra-step__separator": {
                            minHeight: "40px",
                          },
                          ".chakra-step__separator[data-status=active]": {
                            bg: THEME_COLOR,
                          },
                          ".chakra-step__separator[data-status=complete]": {
                            bg: THEME_COLOR,
                          },
                          ".chakra-step__indicator[data-status=complete]": {
                            bg: THEME_COLOR,
                            borderColor: THEME_COLOR,
                          },
                          ".chakra-step__indicator[data-status=active]": {
                            bg: THEME_COLOR,
                            borderColor: THEME_COLOR,
                          },
                          ".chakra-step__indicator": {
                            width: "36px",
                            height: "36px",
                          },
                        }}
                      >
                        {personalSubSteps.map((step, index) => (
                          <Step
                            key={index}
                            onClick={() => setPersonalSubStep(index)}
                            cursor="pointer"
                            py={2}
                          >
                            <StepIndicator>
                              <StepStatus
                                complete={
                                  <StepIcon fontSize="1.2em" color="white" bg={THEME_COLOR} />
                                }
                                incomplete={<StepNumber fontSize="1.1em" color={THEME_COLOR} />}
                                active={
                                  <StepNumber fontSize="1.1em" color="white" bg={THEME_COLOR} />
                                }
                              />
                            </StepIndicator>
                            <Box flexShrink="0" ml={3}>
                              <StepTitle
                                fontWeight={personalSubStep === index ? "bold" : "normal"}
                                fontSize="md"
                                mb={1}
                              >
                                {step.title}
                              </StepTitle>
                              <StepDescription fontSize="sm" color="gray.600">
                                {step.description}
                              </StepDescription>
                            </Box>
                            <StepSeparator />
                          </Step>
                        ))}
                      </Stepper>
                    </Box>

                    {/* Sub-step Content with Scroll */}
                    <Box
                      flex="1"
                      overflowY="auto"
                      css={{
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
                      }}
                    >
                      {personalSubStep === 0 && (
                        <Stack spacing={6} p={8}>
                          <Text fontSize="xl" fontWeight="bold" mb={2}>
                            Basic Information
                          </Text>

                          <Flex gap={6}>
                            <FormControl isRequired>
                              <FormLabel fontSize="md">First Name</FormLabel>
                              <Input
                                value={formData.personalInfo.firstName}
                                onChange={(e) =>
                                  handleChange("personalInfo", "firstName", e.target.value)
                                }
                                placeholder="First Name"
                                size="lg"
                              />
                            </FormControl>

                            <FormControl>
                              <FormLabel fontSize="md">Middle Name</FormLabel>
                              <Input
                                value={formData.personalInfo.middleName}
                                onChange={(e) =>
                                  handleChange("personalInfo", "middleName", e.target.value)
                                }
                                placeholder="Middle Name"
                                size="lg"
                              />
                            </FormControl>

                            <FormControl isRequired>
                              <FormLabel fontSize="md">Last Name</FormLabel>
                              <Input
                                value={formData.personalInfo.lastName}
                                onChange={(e) =>
                                  handleChange("personalInfo", "lastName", e.target.value)
                                }
                                placeholder="Last Name"
                                size="lg"
                              />
                            </FormControl>
                          </Flex>

                          <Flex gap={6}>
                            <FormControl>
                              <FormLabel fontSize="md">Date of Birth</FormLabel>
                              <Input
                                type="date"
                                value={formData.personalInfo.dateOfBirth}
                                onChange={(e) =>
                                  handleChange("personalInfo", "dateOfBirth", e.target.value)
                                }
                                size="lg"
                              />
                            </FormControl>

                            <FormControl>
                              <FormLabel fontSize="md">Gender</FormLabel>
                              <Select
                                value={formData.personalInfo.gender}
                                onChange={(e) =>
                                  handleChange("personalInfo", "gender", e.target.value)
                                }
                                placeholder="Select Gender"
                                size="lg"
                              >
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                                <option value="preferNotToSay">Prefer not to say</option>
                              </Select>
                            </FormControl>
                          </Flex>

                          <FormControl>
                            <FormLabel fontSize="md">SSN / National ID</FormLabel>
                            <Input
                              value={formData.personalInfo.ssn}
                              onChange={(e) => handleChange("personalInfo", "ssn", e.target.value)}
                              placeholder="Social Security Number"
                              size="lg"
                            />
                          </FormControl>

                          <Flex gap={6}>
                            <FormControl>
                              <FormLabel fontSize="md">Work Permit Number</FormLabel>
                              <Input
                                value={formData.personalInfo.workPermitNumber}
                                onChange={(e) =>
                                  handleChange("personalInfo", "workPermitNumber", e.target.value)
                                }
                                placeholder="Work Permit Number"
                                size="lg"
                              />
                            </FormControl>

                            <FormControl>
                              <FormLabel fontSize="md">Work Permit Expiry</FormLabel>
                              <Input
                                type="date"
                                value={formData.personalInfo.workPermitExpiry}
                                onChange={(e) =>
                                  handleChange("personalInfo", "workPermitExpiry", e.target.value)
                                }
                                size="lg"
                              />
                            </FormControl>
                          </Flex>

                          <FormControl>
                            <FormLabel fontSize="md">Citizenship</FormLabel>
                            <Flex gap={4} mt={2}>
                              <label>
                                <input
                                  type="radio"
                                  checked={formData.personalInfo.citizenship === "Yes"}
                                  onChange={() =>
                                    handleChange("personalInfo", "citizenship", "Yes")
                                  }
                                  style={{ marginRight: "8px" }}
                                />
                                Yes
                              </label>
                              <label>
                                <input
                                  type="radio"
                                  checked={formData.personalInfo.citizenship === "No"}
                                  onChange={() => handleChange("personalInfo", "citizenship", "No")}
                                  style={{ marginRight: "8px" }}
                                />
                                No
                              </label>
                            </Flex>
                          </FormControl>
                        </Stack>
                      )}

                      {personalSubStep === 1 && (
                        <Stack spacing={6} p={8}>
                          <Text fontSize="xl" fontWeight="bold" mb={2}>
                            Contact Information
                          </Text>

                          <Flex gap={6}>
                            <FormControl isRequired>
                              <FormLabel fontSize="md">Personal Email</FormLabel>
                              <Input
                                type="email"
                                value={formData.contactInfo.email}
                                onChange={(e) =>
                                  handleChange("contactInfo", "email", e.target.value)
                                }
                                placeholder="Personal Email Address"
                                size="lg"
                              />
                            </FormControl>

                            <FormControl>
                              <FormLabel fontSize="md">Work Email</FormLabel>
                              <Input
                                type="email"
                                value={formData.contactInfo.workEmail}
                                onChange={(e) =>
                                  handleChange("contactInfo", "workEmail", e.target.value)
                                }
                                placeholder="Work Email Address"
                                size="lg"
                              />
                            </FormControl>
                          </Flex>

                          <Flex gap={6}>
                            <FormControl isRequired>
                              <FormLabel fontSize="md">Personal Phone</FormLabel>
                              <Input
                                value={formData.contactInfo.personalPhone}
                                onChange={(e) =>
                                  handleChange("contactInfo", "personalPhone", e.target.value)
                                }
                                placeholder="Personal Phone Number"
                                size="lg"
                              />
                            </FormControl>

                            <FormControl>
                              <FormLabel fontSize="md">Work Phone</FormLabel>
                              <Input
                                value={formData.contactInfo.workPhone}
                                onChange={(e) =>
                                  handleChange("contactInfo", "workPhone", e.target.value)
                                }
                                placeholder="Work Phone Number"
                                size="lg"
                              />
                            </FormControl>
                          </Flex>

                          <FormControl isRequired>
                            <FormLabel fontSize="md">Street Address</FormLabel>
                            <Input
                              value={formData.contactInfo.address}
                              onChange={(e) =>
                                handleChange("contactInfo", "address", e.target.value)
                              }
                              placeholder="Street Address"
                              size="lg"
                            />
                          </FormControl>

                          <Flex gap={6} mb={2}>
                            <FormControl isRequired>
                              <FormLabel fontSize="md">Country</FormLabel>
                              <Select
                                value={formData.contactInfo.country}
                                onChange={(e) =>
                                  handleChange("contactInfo", "country", e.target.value)
                                }
                                size="lg"
                              >
                                {COUNTRIES.map((country) => (
                                  <option key={country.type} value={country.type}>
                                    {country.type}
                                  </option>
                                ))}
                              </Select>
                            </FormControl>

                            <FormControl isRequired>
                              <FormLabel fontSize="md">Province/State</FormLabel>
                              <Select
                                value={formData.contactInfo.province}
                                onChange={(e) =>
                                  handleChange("contactInfo", "province", e.target.value)
                                }
                                size="lg"
                              >
                                {availableProvinces.map((province) => (
                                  <option key={province} value={province}>
                                    {province}
                                  </option>
                                ))}
                              </Select>
                            </FormControl>
                          </Flex>

                          <Flex gap={6}>
                            <FormControl isRequired>
                              <FormLabel fontSize="md">City</FormLabel>
                              <Input
                                value={formData.contactInfo.city}
                                onChange={(e) =>
                                  handleChange("contactInfo", "city", e.target.value)
                                }
                                placeholder="City"
                                size="lg"
                              />
                            </FormControl>

                            <FormControl isRequired>
                              <FormLabel fontSize="md">ZIP/Postal Code</FormLabel>
                              <Input
                                value={formData.contactInfo.zipCode}
                                onChange={(e) =>
                                  handleChange("contactInfo", "zipCode", e.target.value)
                                }
                                placeholder="ZIP/Postal Code"
                                size="lg"
                              />
                            </FormControl>
                          </Flex>
                        </Stack>
                      )}

                      {personalSubStep === 2 && (
                        <Stack spacing={6} p={8}>
                          <Text fontSize="xl" fontWeight="bold" mb={2}>
                            Emergency Contact
                          </Text>

                          <Flex gap={6}>
                            <FormControl isRequired>
                              <FormLabel fontSize="md">First Name</FormLabel>
                              <Input
                                value={formData.emergencyContact.firstName}
                                onChange={(e) =>
                                  handleChange("emergencyContact", "firstName", e.target.value)
                                }
                                placeholder="First Name"
                                size="lg"
                              />
                            </FormControl>

                            <FormControl isRequired>
                              <FormLabel fontSize="md">Last Name</FormLabel>
                              <Input
                                value={formData.emergencyContact.lastName}
                                onChange={(e) =>
                                  handleChange("emergencyContact", "lastName", e.target.value)
                                }
                                placeholder="Last Name"
                                size="lg"
                              />
                            </FormControl>
                          </Flex>

                          <FormControl isRequired>
                            <FormLabel fontSize="md">Personal Email</FormLabel>
                            <Input
                              type="email"
                              value={formData.emergencyContact.email}
                              onChange={(e) =>
                                handleChange("emergencyContact", "email", e.target.value)
                              }
                              placeholder="Email Address"
                              size="lg"
                            />
                          </FormControl>

                          <FormControl isRequired>
                            <FormLabel fontSize="md">Personal Phone</FormLabel>
                            <Input
                              value={formData.emergencyContact.phone}
                              onChange={(e) =>
                                handleChange("emergencyContact", "phone", e.target.value)
                              }
                              placeholder="Phone Number"
                              size="lg"
                            />
                          </FormControl>

                          <FormControl isRequired>
                            <FormLabel fontSize="md">Relationship</FormLabel>
                            <Select
                              value={formData.emergencyContact.relationship}
                              onChange={(e) =>
                                handleChange("emergencyContact", "relationship", e.target.value)
                              }
                              placeholder="Select Relationship"
                              size="lg"
                            >
                              <option value="spouse">Spouse</option>
                              <option value="parent">Parent</option>
                              <option value="child">Child</option>
                              <option value="sibling">Sibling</option>
                              <option value="friend">Friend</option>
                              <option value="other">Other</option>
                            </Select>
                          </FormControl>
                        </Stack>
                      )}
                    </Box>
                  </Flex>
                </TabPanel>

                {/* Employment Tab */}
                <TabPanel>
                  <Flex height="100%">
                    {/* Vertical Sub-step Stepper */}
                    <Box
                      p={6}
                      width="280px"
                      borderRight="1px solid"
                      borderColor="gray.200"
                      flexShrink={0}
                      bg="gray.50"
                    >
                      <Stepper
                        index={employmentSubStep}
                        orientation="vertical"
                        size="lg"
                        gap={8}
                        sx={{
                          ".chakra-step__separator": {
                            minHeight: "40px",
                          },
                          ".chakra-step__separator[data-status=active]": {
                            bg: THEME_COLOR,
                          },
                          ".chakra-step__separator[data-status=complete]": {
                            bg: THEME_COLOR,
                          },
                          ".chakra-step__indicator[data-status=complete]": {
                            bg: THEME_COLOR,
                            borderColor: THEME_COLOR,
                          },
                          ".chakra-step__indicator[data-status=active]": {
                            bg: THEME_COLOR,
                            borderColor: THEME_COLOR,
                          },
                          ".chakra-step__indicator": {
                            width: "36px",
                            height: "36px",
                          },
                        }}
                      >
                        {employmentSubSteps.map((step, index) => (
                          <Step
                            key={index}
                            onClick={() => setEmploymentSubStep(index)}
                            cursor="pointer"
                            py={2}
                          >
                            <StepIndicator>
                              <StepStatus
                                complete={
                                  <StepIcon fontSize="1.2em" color="white" bg={THEME_COLOR} />
                                }
                                incomplete={<StepNumber fontSize="1.1em" color={THEME_COLOR} />}
                                active={
                                  <StepNumber fontSize="1.1em" color="white" bg={THEME_COLOR} />
                                }
                              />
                            </StepIndicator>
                            <Box flexShrink="0" ml={3}>
                              <StepTitle
                                fontWeight={employmentSubStep === index ? "bold" : "normal"}
                                fontSize="md"
                                mb={1}
                              >
                                {step.title}
                              </StepTitle>
                              <StepDescription fontSize="sm" color="gray.600">
                                {step.description}
                              </StepDescription>
                            </Box>
                            <StepSeparator />
                          </Step>
                        ))}
                      </Stepper>
                    </Box>

                    {/* Sub-step Content with Scroll */}
                    <Box
                      flex="1"
                      overflowY="auto"
                      css={{
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
                      }}
                    >
                      {/* Identification & Status Sub-step */}
                      {employmentSubStep === 0 && (
                        <Stack spacing={6} p={8}>
                          <Text fontSize="xl" fontWeight="bold" mb={2}>
                            Identification & Status
                          </Text>

                          <FormControl>
                            <FormLabel fontSize="md">Status</FormLabel>
                            <Select
                              value={formData.employmentInfo.status}
                              onChange={(e) =>
                                handleChange("employmentInfo", "status", e.target.value)
                              }
                              size="lg"
                            >
                              {PAYROLL_STATUS.map((status) => (
                                <option key={status.type} value={status.type}>
                                  {status.type}
                                </option>
                              ))}
                            </Select>
                          </FormControl>

                          <FormControl isRequired>
                            <FormLabel fontSize="md">Employee Number</FormLabel>
                            <Input
                              value={formData.employmentInfo.employeeNo}
                              onChange={(e) =>
                                handleChange("employmentInfo", "employeeNo", e.target.value)
                              }
                              placeholder="Enter employee number"
                              size="lg"
                            />
                          </FormControl>

                          <FormControl>
                            <FormLabel fontSize="md">System Access Level</FormLabel>
                            {roles ? (
                              <Select
                                value={formData.employmentInfo.systemAccessLevel}
                                onChange={(e) =>
                                  handleChange(
                                    "employmentInfo",
                                    "systemAccessLevel",
                                    e.target.value
                                  )
                                }
                                size="lg"
                              >
                                {roles.map((role) => (
                                  <option key={role.name} value={role.name}>
                                    {role.name}
                                  </option>
                                ))}
                              </Select>
                            ) : (
                              <Flex align="center" justify="center" py={2}>
                                <Spinner size="sm" mr={2} />
                                <Text>Loading access levels...</Text>
                              </Flex>
                            )}
                          </FormControl>
                        </Stack>
                      )}

                      {/* Position Sub-step */}
                      {employmentSubStep === 1 && (
                        <Stack spacing={6} p={8}>
                          <Text fontSize="xl" fontWeight="bold" mb={2}>
                            Position
                          </Text>

                          <SimpleGrid columns={2} spacing={6}>
                            <FormControl isRequired>
                              <FormLabel fontSize="md">Role Title</FormLabel>
                              {positionRoles ? (
                                <Select
                                  value={formData.employmentInfo.jobTitle}
                                  onChange={(e) =>
                                    handleChange("employmentInfo", "jobTitle", e.target.value)
                                  }
                                  placeholder="Select Role title"
                                  size="lg"
                                >
                                  {positionRoles.map((role) => (
                                    <option key={role.name} value={role.name}>
                                      {role.name}
                                    </option>
                                  ))}
                                </Select>
                              ) : (
                                <Flex align="center" justify="center" py={2}>
                                  <Spinner size="sm" mr={2} />
                                  <Text>Loading job titles...</Text>
                                </Flex>
                              )}
                            </FormControl>

                            <FormControl>
                              <FormLabel fontSize="md">Pay Group</FormLabel>
                              {payGroups ? (
                                <Select
                                  value={formData.employmentInfo.payGroup}
                                  onChange={(e) =>
                                    handleChange("employmentInfo", "payGroup", e.target.value)
                                  }
                                  placeholder="Select pay group"
                                  size="lg"
                                >
                                  {payGroups.map((group) => (
                                    <option key={group.name} value={group.name}>
                                      {group.name}
                                    </option>
                                  ))}
                                </Select>
                              ) : (
                                <Flex align="center" justify="center" py={2}>
                                  <Spinner size="sm" mr={2} />
                                  <Text>Loading pay groups...</Text>
                                </Flex>
                              )}
                            </FormControl>
                          </SimpleGrid>

                          <FormControl>
                            <FormLabel fontSize="md">Time Management Badge ID</FormLabel>
                            <Input
                              value={formData.employmentInfo.timeManagementBadgeID}
                              onChange={(e) =>
                                handleChange(
                                  "employmentInfo",
                                  "timeManagementBadgeID",
                                  e.target.value
                                )
                              }
                              placeholder="Enter badge ID"
                              size="lg"
                            />
                          </FormControl>

                          <SimpleGrid columns={2} spacing={6}>
                            <FormControl isRequired>
                              <FormLabel fontSize="md">Cost Center</FormLabel>
                              {costCentres ? (
                                <Select
                                  value={formData.employmentInfo.costCenter}
                                  onChange={(e) =>
                                    handleChange("employmentInfo", "costCenter", e.target.value)
                                  }
                                  placeholder="Select cost center"
                                  size="lg"
                                >
                                  {costCentres.map((center) => (
                                    <option key={center.name} value={center.name}>
                                      {center.name}
                                    </option>
                                  ))}
                                </Select>
                              ) : (
                                <Flex align="center" justify="center" py={2}>
                                  <Spinner size="sm" mr={2} />
                                  <Text>Loading cost centers...</Text>
                                </Flex>
                              )}
                            </FormControl>

                            <FormControl>
                              <FormLabel fontSize="md">Employee Card Number</FormLabel>
                              <Input
                                value={formData.employmentInfo.employeeCardNumber}
                                onChange={(e) =>
                                  handleChange(
                                    "employmentInfo",
                                    "employeeCardNumber",
                                    e.target.value
                                  )
                                }
                                placeholder="Enter card number"
                                size="lg"
                              />
                            </FormControl>
                          </SimpleGrid>

                          <SimpleGrid columns={2} spacing={6}>
                            <FormControl isRequired>
                              <FormLabel fontSize="md">Department</FormLabel>
                              {departments ? (
                                <Select
                                  value={formData.employmentInfo.department}
                                  onChange={(e) =>
                                    handleChange("employmentInfo", "department", e.target.value)
                                  }
                                  placeholder="Select department"
                                  size="lg"
                                >
                                  {departments.map((dept) => (
                                    <option key={dept.name} value={dept.name}>
                                      {dept.name}
                                    </option>
                                  ))}
                                </Select>
                              ) : (
                                <Flex align="center" justify="center" py={2}>
                                  <Spinner size="sm" mr={2} />
                                  <Text>Loading departments...</Text>
                                </Flex>
                              )}
                            </FormControl>

                            <FormControl isRequired>
                              <FormLabel fontSize="md">Start Date</FormLabel>
                              <Input
                                type="date"
                                value={formData.employmentInfo.startDate}
                                onChange={(e) =>
                                  handleChange("employmentInfo", "startDate", e.target.value)
                                }
                                size="lg"
                              />
                            </FormControl>
                          </SimpleGrid>
                        </Stack>
                      )}

                      {/* Region Sub-step */}
                      {employmentSubStep === 2 && (
                        <Stack spacing={6} p={8}>
                          <Text fontSize="xl" fontWeight="bold" mb={2}>
                            Region
                          </Text>

                          <SimpleGrid columns={2} spacing={6}>
                            <FormControl isRequired>
                              <FormLabel fontSize="md">Country</FormLabel>
                              <Select
                                value={formData.employmentInfo.country}
                                onChange={(e) =>
                                  handleChange("employmentInfo", "country", e.target.value)
                                }
                                size="lg"
                              >
                                {COUNTRIES.map((country) => (
                                  <option key={country.type} value={country.type}>
                                    {country.type}
                                  </option>
                                ))}
                              </Select>
                            </FormControl>

                            <FormControl isRequired>
                              <FormLabel fontSize="md">Province/State</FormLabel>
                              <Select
                                value={formData.employmentInfo.province}
                                onChange={(e) =>
                                  handleChange("employmentInfo", "province", e.target.value)
                                }
                                size="lg"
                              >
                                {employmentProvinces.map((province) => (
                                  <option key={province} value={province}>
                                    {province}
                                  </option>
                                ))}
                              </Select>
                            </FormControl>
                          </SimpleGrid>
                        </Stack>
                      )}
                    </Box>
                  </Flex>
                </TabPanel>

                {/* Pay Tab */}
                <TabPanel>
                  <Box
                    height="100%"
                    overflowY="auto"
                    css={{
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
                    }}
                  >
                    <Stack spacing={6} p={8}>
                      <Text fontSize="xl" fontWeight="bold" mb={2}>
                        Compensation Information
                      </Text>

                      <Flex gap={6}>
                        <FormControl isRequired>
                          <FormLabel fontSize="md">Pay Rate</FormLabel>
                          <Input
                            type="number"
                            value={formData.payInfo.salary}
                            onChange={(e) => handleChange("payInfo", "salary", e.target.value)}
                            placeholder="Pay Rate"
                            size="lg"
                          />
                        </FormControl>

                        <FormControl isRequired>
                          <FormLabel fontSize="md">Pay Type</FormLabel>
                          <Select
                            value={formData.payInfo.payType}
                            onChange={(e) => handleChange("payInfo", "payType", e.target.value)}
                            size="lg"
                          >
                            <option value="hourly">Hourly</option>
                            <option value="salary">Salary</option>
                            <option value="commission">Commission</option>
                          </Select>
                        </FormControl>
                      </Flex>

                      <Flex gap={6}>
                        <FormControl isRequired>
                          <FormLabel fontSize="md">Pay Frequency</FormLabel>
                          <Select
                            value={formData.payInfo.payFrequency}
                            onChange={(e) =>
                              handleChange("payInfo", "payFrequency", e.target.value)
                            }
                            size="lg"
                          >
                            <option value="weekly">Weekly</option>
                            <option value="biweekly">Bi-weekly</option>
                            <option value="monthly">Monthly</option>
                          </Select>
                        </FormControl>

                        <FormControl>
                          <FormLabel fontSize="md">Tax Withholding</FormLabel>
                          <Input
                            value={formData.payInfo.taxWithholding}
                            onChange={(e) =>
                              handleChange("payInfo", "taxWithholding", e.target.value)
                            }
                            placeholder="Tax Withholding"
                            size="lg"
                          />
                        </FormControl>
                      </Flex>
                    </Stack>
                  </Box>
                </TabPanel>

                {/* Benefits Tab */}
                <TabPanel>
                  <Flex height="100%">
                    {/* Vertical Sub-step Stepper */}
                    <Box
                      p={6}
                      width="280px"
                      borderRight="1px solid"
                      borderColor="gray.200"
                      flexShrink={0}
                      bg="gray.50"
                    >
                      <Stepper
                        index={benefitsSubStep}
                        orientation="vertical"
                        size="lg"
                        gap={8}
                        sx={{
                          ".chakra-step__separator": {
                            minHeight: "40px",
                          },
                          ".chakra-step__separator[data-status=active]": {
                            bg: THEME_COLOR,
                          },
                          ".chakra-step__separator[data-status=complete]": {
                            bg: THEME_COLOR,
                          },
                          ".chakra-step__indicator[data-status=complete]": {
                            bg: THEME_COLOR,
                            borderColor: THEME_COLOR,
                          },
                          ".chakra-step__indicator[data-status=active]": {
                            bg: THEME_COLOR,
                            borderColor: THEME_COLOR,
                          },
                          ".chakra-step__indicator": {
                            width: "36px",
                            height: "36px",
                          },
                        }}
                      >
                        {benefitsSubSteps.map((step, index) => (
                          <Step
                            key={index}
                            onClick={() => setBenefitsSubStep(index)}
                            cursor="pointer"
                            py={2}
                          >
                            <StepIndicator>
                              <StepStatus
                                complete={
                                  <StepIcon fontSize="1.2em" color="white" bg={THEME_COLOR} />
                                }
                                incomplete={<StepNumber fontSize="1.1em" color={THEME_COLOR} />}
                                active={
                                  <StepNumber fontSize="1.1em" color="white" bg={THEME_COLOR} />
                                }
                              />
                            </StepIndicator>
                            <Box flexShrink="0" ml={3}>
                              <StepTitle
                                fontWeight={benefitsSubStep === index ? "bold" : "normal"}
                                fontSize="md"
                                mb={1}
                              >
                                {step.title}
                              </StepTitle>
                              <StepDescription fontSize="sm" color="gray.600">
                                {step.description}
                              </StepDescription>
                            </Box>
                            <StepSeparator />
                          </Step>
                        ))}
                      </Stepper>
                    </Box>

                    {/* Sub-step Content with Scroll */}
                    <Box
                      flex="1"
                      overflowY="auto"
                      css={{
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
                      }}
                    >
                      {/* Vacation Sub-step */}
                      {benefitsSubStep === 0 && (
                        <Stack spacing={6} p={8}>
                          <Text fontSize="xl" fontWeight="bold" mb={2}>
                            Vacation
                          </Text>

                          <FormControl isRequired>
                            <FormLabel fontSize="md">Vacation Treatment</FormLabel>
                            <Stack direction="column" spacing={4}>
                              <label>
                                <input
                                  type="radio"
                                  checked={
                                    formData.benefitsInfo.typeOfVacationTreatment === "Payout"
                                  }
                                  onChange={() =>
                                    handleChange(
                                      "benefitsInfo",
                                      "typeOfVacationTreatment",
                                      "Payout"
                                    )
                                  }
                                  style={{ marginRight: "8px" }}
                                />
                                Payout
                              </label>
                              <label>
                                <input
                                  type="radio"
                                  checked={
                                    formData.benefitsInfo.typeOfVacationTreatment === "Accrued"
                                  }
                                  onChange={() =>
                                    handleChange(
                                      "benefitsInfo",
                                      "typeOfVacationTreatment",
                                      "Accrued"
                                    )
                                  }
                                  style={{ marginRight: "8px" }}
                                />
                                Accrued
                              </label>
                            </Stack>
                          </FormControl>

                          <FormControl isRequired>
                            <FormLabel fontSize="md">Vacation Pay Percentage (%)</FormLabel>
                            <Input
                              type="number"
                              value={formData.benefitsInfo.vacationPayPercent}
                              onChange={(e) =>
                                handleChange("benefitsInfo", "vacationPayPercent", e.target.value)
                              }
                              placeholder="Enter percentage"
                              size="lg"
                            />
                          </FormControl>

                          <Divider my={2} />

                          <Text fontSize="lg" fontWeight="semibold" mt={2} mb={4}>
                            Vacation Balances
                          </Text>

                          <FormControl>
                            <FormLabel fontSize="md">Accrued This Year</FormLabel>
                            <Input
                              type="number"
                              value={formData.benefitsInfo.YTDVacationAccrued || ""}
                              onChange={(e) =>
                                handleChange("benefitsInfo", "YTDVacationAccrued", e.target.value)
                              }
                              placeholder="0.00"
                              size="lg"
                              readOnly
                            />
                          </FormControl>

                          <FormControl>
                            <FormLabel fontSize="md">Used This Year</FormLabel>
                            <Input
                              type="number"
                              value={formData.benefitsInfo.YTDVacationUsed || ""}
                              onChange={(e) =>
                                handleChange("benefitsInfo", "YTDVacationUsed", e.target.value)
                              }
                              placeholder="0.00"
                              size="lg"
                              readOnly
                            />
                          </FormControl>

                          <HStack justifyContent="space-between" mt={2}>
                            <Button
                              leftIcon={<FaPlus />}
                              bg={THEME_COLOR}
                              color="white"
                              _hover={{ bg: "#4a2b4a" }}
                              size="md"
                              onClick={() => {
                                // This would typically call an API to add the adjustment
                                console.log(
                                  "Adding adjustment:",
                                  formData.benefitsInfo.vacationAdjustment
                                );
                                // Reset the adjustment value after submission
                                handleChange("benefitsInfo", "vacationAdjustment", "");
                                toast({
                                  title: "Adjustment Added",
                                  description: "Vacation balance adjustment has been recorded",
                                  status: "success",
                                  duration: 3000,
                                  isClosable: true,
                                });
                              }}
                            >
                              Add Adjustment
                            </Button>
                            <FormControl maxWidth="250px">
                              <Input
                                size="md"
                                placeholder="Enter amount to adjust"
                                value={formData.benefitsInfo.vacationAdjustment || ""}
                                onChange={(e) =>
                                  handleChange("benefitsInfo", "vacationAdjustment", e.target.value)
                                }
                              />
                            </FormControl>
                          </HStack>
                        </Stack>
                      )}

                      {/* Employer Contributions Sub-step */}
                      {benefitsSubStep === 1 && (
                        <Stack spacing={6} p={8}>
                          <Text fontSize="xl" fontWeight="bold" mb={2}>
                            Employer Contributions
                          </Text>

                          <FormControl>
                            <FormLabel fontSize="md">Pension Contribution Treatment</FormLabel>
                            <Select
                              value={formData.benefitsInfo.typeOfPensionERTreatment}
                              onChange={(e) =>
                                handleChange(
                                  "benefitsInfo",
                                  "typeOfPensionERTreatment",
                                  e.target.value
                                )
                              }
                              size="lg"
                            >
                              <option value="No Pension Contributions">
                                No Pension Contributions
                              </option>
                              <option value="Pension Contributions (%)">
                                Pension Contributions (%)
                              </option>
                              <option value="Amount Pension Contributions">
                                Amount Pension Contributions
                              </option>
                              <option value="Amount per Hour Pension Contributions">
                                Amount per Hour Pension Contributions
                              </option>
                            </Select>
                          </FormControl>

                          {formData.benefitsInfo.typeOfPensionERTreatment !==
                            "No Pension Contributions" && (
                            <FormControl>
                              <FormLabel fontSize="md">Pension - ER</FormLabel>
                              <Input
                                value={formData.benefitsInfo.pensionERContribution}
                                onChange={(e) =>
                                  handleChange(
                                    "benefitsInfo",
                                    "pensionERContribution",
                                    e.target.value
                                  )
                                }
                                placeholder="Enter value"
                                size="lg"
                              />
                            </FormControl>
                          )}

                          <FormControl>
                            <FormLabel fontSize="md">Dental - ER Treatment</FormLabel>
                            <Select
                              value={formData.benefitsInfo.typeOfDentalERTreatment}
                              onChange={(e) =>
                                handleChange(
                                  "benefitsInfo",
                                  "typeOfDentalERTreatment",
                                  e.target.value
                                )
                              }
                              size="lg"
                            >
                              <option value="No Dental Contributions">
                                No Dental Contributions
                              </option>
                              <option value="Dental Contributions (%)">
                                Dental Contributions (%)
                              </option>
                              <option value="Amount Dental Contributions">
                                Amount Dental Contributions
                              </option>
                              <option value="Amount per Hour Dental Contributions">
                                Amount per Hour Dental Contributions
                              </option>
                            </Select>
                          </FormControl>

                          {formData.benefitsInfo.typeOfDentalERTreatment !==
                            "No Dental Contributions" && (
                            <FormControl>
                              <FormLabel fontSize="md">Dental - ER</FormLabel>
                              <Input
                                value={formData.benefitsInfo.dentalERContribution}
                                onChange={(e) =>
                                  handleChange(
                                    "benefitsInfo",
                                    "dentalERContribution",
                                    e.target.value
                                  )
                                }
                                placeholder="Enter value"
                                size="lg"
                              />
                            </FormControl>
                          )}

                          <FormControl>
                            <FormLabel fontSize="md">Extended Health - ER Treatment</FormLabel>
                            <Select
                              value={formData.benefitsInfo.typeOfExtendedHealthERTreatment}
                              onChange={(e) =>
                                handleChange(
                                  "benefitsInfo",
                                  "typeOfExtendedHealthERTreatment",
                                  e.target.value
                                )
                              }
                              size="lg"
                            >
                              <option value="No Extended Health Contributions">
                                No Extended Health Contributions
                              </option>
                              <option value="Extended Health Contributions (%)">
                                Extended Health Contributions (%)
                              </option>
                              <option value="Amount Extended Health Contributions">
                                Amount Extended Health Contributions
                              </option>
                              <option value="Amount per Hour Extended Health Contributions">
                                Amount per Hour Extended Health Contributions
                              </option>
                            </Select>
                          </FormControl>

                          {formData.benefitsInfo.typeOfExtendedHealthERTreatment !==
                            "No Extended Health Contributions" && (
                            <FormControl>
                              <FormLabel fontSize="md">Extended Health - ER</FormLabel>
                              <Input
                                value={formData.benefitsInfo.extendedHealthERContribution}
                                onChange={(e) =>
                                  handleChange(
                                    "benefitsInfo",
                                    "extendedHealthERContribution",
                                    e.target.value
                                  )
                                }
                                placeholder="Enter value"
                                size="lg"
                              />
                            </FormControl>
                          )}
                        </Stack>
                      )}

                      {/* Employee Contributions Sub-step */}
                      {benefitsSubStep === 2 && (
                        <Stack spacing={6} p={8}>
                          <Text fontSize="xl" fontWeight="bold" mb={2}>
                            Employee Contributions
                          </Text>

                          <FormControl>
                            <FormLabel fontSize="md">Pension Contribution Treatment</FormLabel>
                            <Select
                              value={formData.benefitsInfo.typeOfPensionEETreatment}
                              onChange={(e) =>
                                handleChange(
                                  "benefitsInfo",
                                  "typeOfPensionEETreatment",
                                  e.target.value
                                )
                              }
                              size="lg"
                            >
                              <option value="No Pension Contributions">
                                No Pension Contributions
                              </option>
                              <option value="Pension Contributions (%)">
                                Pension Contributions (%)
                              </option>
                              <option value="Amount Pension Contributions">
                                Amount Pension Contributions
                              </option>
                              <option value="Amount per Hour Pension Contributions">
                                Amount per Hour Pension Contributions
                              </option>
                            </Select>
                          </FormControl>

                          {formData.benefitsInfo.typeOfPensionEETreatment !==
                            "No Pension Contributions" && (
                            <FormControl>
                              <FormLabel fontSize="md">Pension - EE</FormLabel>
                              <Input
                                value={formData.benefitsInfo.pensionEEContribution}
                                onChange={(e) =>
                                  handleChange(
                                    "benefitsInfo",
                                    "pensionEEContribution",
                                    e.target.value
                                  )
                                }
                                placeholder="Enter value"
                                size="lg"
                              />
                            </FormControl>
                          )}

                          <FormControl>
                            <FormLabel fontSize="md">Dental - EE Treatment</FormLabel>
                            <Select
                              value={formData.benefitsInfo.typeOfDentalEETreatment}
                              onChange={(e) =>
                                handleChange(
                                  "benefitsInfo",
                                  "typeOfDentalEETreatment",
                                  e.target.value
                                )
                              }
                              size="lg"
                            >
                              <option value="No Dental Contributions">
                                No Dental Contributions
                              </option>
                              <option value="Dental Contributions (%)">
                                Dental Contributions (%)
                              </option>
                              <option value="Amount Dental Contributions">
                                Amount Dental Contributions
                              </option>
                              <option value="Amount per Hour Dental Contributions">
                                Amount per Hour Dental Contributions
                              </option>
                            </Select>
                          </FormControl>

                          {formData.benefitsInfo.typeOfDentalEETreatment !==
                            "No Dental Contributions" && (
                            <FormControl>
                              <FormLabel fontSize="md">Dental - EE</FormLabel>
                              <Input
                                value={formData.benefitsInfo.dentalEEContribution}
                                onChange={(e) =>
                                  handleChange(
                                    "benefitsInfo",
                                    "dentalEEContribution",
                                    e.target.value
                                  )
                                }
                                placeholder="Enter value"
                                size="lg"
                              />
                            </FormControl>
                          )}

                          <FormControl>
                            <FormLabel fontSize="md">Extended Health - EE Treatment</FormLabel>
                            <Select
                              value={formData.benefitsInfo.typeOfExtendedHealthEETreatment}
                              onChange={(e) =>
                                handleChange(
                                  "benefitsInfo",
                                  "typeOfExtendedHealthEETreatment",
                                  e.target.value
                                )
                              }
                              size="lg"
                            >
                              <option value="No Extended Health Contributions">
                                No Extended Health Contributions
                              </option>
                              <option value="Extended Health Contributions (%)">
                                Extended Health Contributions (%)
                              </option>
                              <option value="Amount Extended Health Contributions">
                                Amount Extended Health Contributions
                              </option>
                              <option value="Amount per Hour Extended Health Contributions">
                                Amount per Hour Extended Health Contributions
                              </option>
                            </Select>
                          </FormControl>

                          {formData.benefitsInfo.typeOfExtendedHealthEETreatment !==
                            "No Extended Health Contributions" && (
                            <FormControl>
                              <FormLabel fontSize="md">Extended Health - EE</FormLabel>
                              <Input
                                value={formData.benefitsInfo.extendedHealthEEContribution}
                                onChange={(e) =>
                                  handleChange(
                                    "benefitsInfo",
                                    "extendedHealthEEContribution",
                                    e.target.value
                                  )
                                }
                                placeholder="Enter value"
                                size="lg"
                              />
                            </FormControl>
                          )}

                          <FormControl>
                            <FormLabel fontSize="md">Union Dues Treatment</FormLabel>
                            <Select
                              value={formData.benefitsInfo.typeOfUnionDuesTreatment}
                              onChange={(e) =>
                                handleChange(
                                  "benefitsInfo",
                                  "typeOfUnionDuesTreatment",
                                  e.target.value
                                )
                              }
                              size="lg"
                            >
                              <option value="No Union Contributions">No Union Contributions</option>
                              <option value="Union Contributions (%)">
                                Union Contributions (%)
                              </option>
                              <option value="Amount Union Contributions">
                                Amount Union Contributions
                              </option>
                              <option value="Amount per Hour Union Contributions">
                                Amount per Hour Union Contributions
                              </option>
                            </Select>
                          </FormControl>

                          {formData.benefitsInfo.typeOfUnionDuesTreatment !==
                            "No Union Contributions" && (
                            <FormControl>
                              <FormLabel fontSize="md">Union Dues</FormLabel>
                              <Input
                                value={formData.benefitsInfo.unionDuesContribution}
                                onChange={(e) =>
                                  handleChange(
                                    "benefitsInfo",
                                    "unionDuesContribution",
                                    e.target.value
                                  )
                                }
                                placeholder="Enter value"
                                size="lg"
                              />
                            </FormControl>
                          )}
                        </Stack>
                      )}
                    </Box>
                  </Flex>
                </TabPanel>

                {/* Government Tab */}
                <TabPanel>
                  <Flex height="100%">
                    {/* Vertical Sub-step Stepper */}
                    <Box
                      p={6}
                      width="280px"
                      borderRight="1px solid"
                      borderColor="gray.200"
                      flexShrink={0}
                      bg="gray.50"
                    >
                      <Stepper
                        index={governmentSubStep}
                        orientation="vertical"
                        size="lg"
                        gap={8}
                        sx={{
                          ".chakra-step__separator": {
                            minHeight: "40px",
                          },
                          ".chakra-step__separator[data-status=active]": {
                            bg: THEME_COLOR,
                          },
                          ".chakra-step__separator[data-status=complete]": {
                            bg: THEME_COLOR,
                          },
                          ".chakra-step__indicator[data-status=complete]": {
                            bg: THEME_COLOR,
                            borderColor: THEME_COLOR,
                          },
                          ".chakra-step__indicator[data-status=active]": {
                            bg: THEME_COLOR,
                            borderColor: THEME_COLOR,
                          },
                          ".chakra-step__indicator": {
                            width: "36px",
                            height: "36px",
                          },
                        }}
                      >
                        {governmentSubSteps.map((step, index) => (
                          <Step
                            key={index}
                            onClick={() => setGovernmentSubStep(index)}
                            cursor="pointer"
                            py={2}
                          >
                            <StepIndicator>
                              <StepStatus
                                complete={
                                  <StepIcon fontSize="1.2em" color="white" bg={THEME_COLOR} />
                                }
                                incomplete={<StepNumber fontSize="1.1em" color={THEME_COLOR} />}
                                active={
                                  <StepNumber fontSize="1.1em" color="white" bg={THEME_COLOR} />
                                }
                              />
                            </StepIndicator>
                            <Box flexShrink="0" ml={3}>
                              <StepTitle
                                fontWeight={governmentSubStep === index ? "bold" : "normal"}
                                fontSize="md"
                                mb={1}
                              >
                                {step.title}
                              </StepTitle>
                              <StepDescription fontSize="sm" color="gray.600">
                                {step.description}
                              </StepDescription>
                            </Box>
                            <StepSeparator />
                          </Step>
                        ))}
                      </Stepper>
                    </Box>

                    {/* Sub-step Content with Scroll */}
                    <Box
                      flex="1"
                      overflowY="auto"
                      css={{
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
                      }}
                    >
                      {/* Exemption Sub-step */}
                      {governmentSubStep === 0 && (
                        <Stack spacing={6} p={8}>
                          <Text fontSize="xl" fontWeight="bold" mb={2}>
                            Exemption
                          </Text>

                          <FormControl>
                            <Tooltip
                              hasArrow
                              label="Canada Pension Plan/Quebec Pension Plan exemption status"
                              placement="top"
                            >
                              <FormLabel fontSize="md">
                                CPP/QPP Exemption{" "}
                                <FaInfoCircle
                                  size="0.8em"
                                  color="#718096"
                                  style={{ display: "inline", marginBottom: "3px" }}
                                />
                              </FormLabel>
                            </Tooltip>
                            <Flex gap={4} mt={2}>
                              <label>
                                <input
                                  type="radio"
                                  checked={formData.governmentInfo.isCPPExempt}
                                  onChange={() =>
                                    handleChange("governmentInfo", "isCPPExempt", true)
                                  }
                                  style={{ marginRight: "8px" }}
                                />
                                Yes
                              </label>
                              <label>
                                <input
                                  type="radio"
                                  checked={!formData.governmentInfo.isCPPExempt}
                                  onChange={() =>
                                    handleChange("governmentInfo", "isCPPExempt", false)
                                  }
                                  style={{ marginRight: "8px" }}
                                />
                                No
                              </label>
                            </Flex>
                          </FormControl>

                          <FormControl>
                            <Tooltip
                              hasArrow
                              label="Employment Insurance exemption status"
                              placement="top"
                            >
                              <FormLabel fontSize="md">
                                EI Exemption{" "}
                                <FaInfoCircle
                                  size="0.8em"
                                  color="#718096"
                                  style={{ display: "inline", marginBottom: "3px" }}
                                />
                              </FormLabel>
                            </Tooltip>
                            <Flex gap={4} mt={2}>
                              <label>
                                <input
                                  type="radio"
                                  checked={formData.governmentInfo.isEIExempt}
                                  onChange={() =>
                                    handleChange("governmentInfo", "isEIExempt", true)
                                  }
                                  style={{ marginRight: "8px" }}
                                />
                                Yes
                              </label>
                              <label>
                                <input
                                  type="radio"
                                  checked={!formData.governmentInfo.isEIExempt}
                                  onChange={() =>
                                    handleChange("governmentInfo", "isEIExempt", false)
                                  }
                                  style={{ marginRight: "8px" }}
                                />
                                No
                              </label>
                            </Flex>
                          </FormControl>
                        </Stack>
                      )}

                      {/* Income Tax Sub-step */}
                      {governmentSubStep === 1 && (
                        <Stack spacing={6} p={8}>
                          <Text fontSize="xl" fontWeight="bold" mb={2}>
                            Income Tax
                          </Text>

                          <FormControl>
                            <FormLabel fontSize="md">Federal Tax</FormLabel>
                            <Select
                              value={formData.governmentInfo.federalTax}
                              onChange={(e) =>
                                handleChange("governmentInfo", "federalTax", e.target.value)
                              }
                              size="lg"
                            >
                              {["Canada", "US"].map((country) => (
                                <option key={country} value={country}>
                                  {country}
                                </option>
                              ))}
                            </Select>
                          </FormControl>

                          <FormControl>
                            <FormLabel fontSize="md">Regional Tax</FormLabel>
                            <Select
                              value={formData.governmentInfo.regionalTax}
                              onChange={(e) =>
                                handleChange("governmentInfo", "regionalTax", e.target.value)
                              }
                              size="lg"
                            >
                              {governmentProvinces.map((province) => (
                                <option key={province} value={province}>
                                  {province}
                                </option>
                              ))}
                            </Select>
                          </FormControl>

                          <SimpleGrid columns={2} spacing={6}>
                            <FormControl>
                              <FormLabel fontSize="md">Personal Federal Tax Credit</FormLabel>
                              <Input
                                type="number"
                                value={formData.governmentInfo.federalTaxCredit}
                                onChange={(e) =>
                                  handleChange("governmentInfo", "federalTaxCredit", e.target.value)
                                }
                                placeholder="Enter amount"
                                size="lg"
                              />
                            </FormControl>

                            <FormControl>
                              <FormLabel fontSize="md">Personal Regional Tax Credit</FormLabel>
                              <Input
                                type="number"
                                value={formData.governmentInfo.regionalTaxCredit}
                                onChange={(e) =>
                                  handleChange(
                                    "governmentInfo",
                                    "regionalTaxCredit",
                                    e.target.value
                                  )
                                }
                                placeholder="Enter amount"
                                size="lg"
                              />
                            </FormControl>
                          </SimpleGrid>
                        </Stack>
                      )}

                      {/* Federal Contributions Sub-step */}
                      {governmentSubStep === 2 && (
                        <Stack spacing={6} p={8}>
                          <Text fontSize="xl" fontWeight="bold" mb={2}>
                            Federal Government Contributions
                          </Text>

                          <SimpleGrid columns={2} spacing={6}>
                            <FormControl>
                              <Tooltip
                                hasArrow
                                label="Employee contribution to pension plan"
                                placement="top"
                              >
                                <FormLabel fontSize="md">
                                  Pension (EE){" "}
                                  <FaInfoCircle
                                    size="0.8em"
                                    color="#718096"
                                    style={{ display: "inline", marginBottom: "3px" }}
                                  />
                                </FormLabel>
                              </Tooltip>
                              <Input
                                value={formData.governmentInfo.federalPensionEE}
                                onChange={(e) =>
                                  handleChange("governmentInfo", "federalPensionEE", e.target.value)
                                }
                                placeholder="Enter amount"
                                size="lg"
                              />
                            </FormControl>

                            <FormControl>
                              <Tooltip
                                hasArrow
                                label="Employee contribution to employment insurance"
                                placement="top"
                              >
                                <FormLabel fontSize="md">
                                  Employment Insurance (EE){" "}
                                  <FaInfoCircle
                                    size="0.8em"
                                    color="#718096"
                                    style={{ display: "inline", marginBottom: "3px" }}
                                  />
                                </FormLabel>
                              </Tooltip>
                              <Input
                                value={formData.governmentInfo.federalEmploymentInsuranceEE}
                                onChange={(e) =>
                                  handleChange(
                                    "governmentInfo",
                                    "federalEmploymentInsuranceEE",
                                    e.target.value
                                  )
                                }
                                placeholder="Enter amount"
                                size="lg"
                              />
                            </FormControl>
                          </SimpleGrid>

                          <SimpleGrid columns={2} spacing={6}>
                            <FormControl>
                              <Tooltip
                                hasArrow
                                label="Employer contribution to pension plan"
                                placement="top"
                              >
                                <FormLabel fontSize="md">
                                  Pension (ER){" "}
                                  <FaInfoCircle
                                    size="0.8em"
                                    color="#718096"
                                    style={{ display: "inline", marginBottom: "3px" }}
                                  />
                                </FormLabel>
                              </Tooltip>
                              <Input
                                value={formData.governmentInfo.federalPensionER}
                                onChange={(e) =>
                                  handleChange("governmentInfo", "federalPensionER", e.target.value)
                                }
                                placeholder="Enter amount"
                                size="lg"
                              />
                            </FormControl>

                            <FormControl>
                              <Tooltip
                                hasArrow
                                label="Employer contribution to employment insurance"
                                placement="top"
                              >
                                <FormLabel fontSize="md">
                                  Employment Insurance (ER){" "}
                                  <FaInfoCircle
                                    size="0.8em"
                                    color="#718096"
                                    style={{ display: "inline", marginBottom: "3px" }}
                                  />
                                </FormLabel>
                              </Tooltip>
                              <Input
                                value={formData.governmentInfo.federalEmploymentInsuranceER}
                                onChange={(e) =>
                                  handleChange(
                                    "governmentInfo",
                                    "federalEmploymentInsuranceER",
                                    e.target.value
                                  )
                                }
                                placeholder="Enter amount"
                                size="lg"
                              />
                            </FormControl>
                          </SimpleGrid>
                        </Stack>
                      )}

                      {/* Regional Government Deductions Sub-step */}
                      {governmentSubStep === 3 && (
                        <Stack spacing={6} p={8}>
                          <Text fontSize="xl" fontWeight="bold" mb={2}>
                            Regional Government Deductions
                          </Text>

                          <SimpleGrid columns={2} spacing={6}>
                            <FormControl>
                              <Tooltip
                                hasArrow
                                label="Deduction for employee injury insurance"
                                placement="top"
                              >
                                <FormLabel fontSize="md">
                                  Employee Injury{" "}
                                  <FaInfoCircle
                                    size="0.8em"
                                    color="#718096"
                                    style={{ display: "inline", marginBottom: "3px" }}
                                  />
                                </FormLabel>
                              </Tooltip>
                              <Input
                                value={formData.governmentInfo.regionalEmployeeInjury}
                                onChange={(e) =>
                                  handleChange(
                                    "governmentInfo",
                                    "regionalEmployeeInjury",
                                    e.target.value
                                  )
                                }
                                placeholder="Enter amount"
                                size="lg"
                              />
                            </FormControl>

                            <FormControl>
                              <Tooltip
                                hasArrow
                                label="Deduction for employee health insurance"
                                placement="top"
                              >
                                <FormLabel fontSize="md">
                                  Employee Health{" "}
                                  <FaInfoCircle
                                    size="0.8em"
                                    color="#718096"
                                    style={{ display: "inline", marginBottom: "3px" }}
                                  />
                                </FormLabel>
                              </Tooltip>
                              <Input
                                value={formData.governmentInfo.regionalEmployeeHealth}
                                onChange={(e) =>
                                  handleChange(
                                    "governmentInfo",
                                    "regionalEmployeeHealth",
                                    e.target.value
                                  )
                                }
                                placeholder="Enter amount"
                                size="lg"
                              />
                            </FormControl>
                          </SimpleGrid>

                          <SimpleGrid columns={2} spacing={6}>
                            <FormControl>
                              <Tooltip
                                hasArrow
                                label="Contribution from employer for injury insurance"
                                placement="top"
                              >
                                <FormLabel fontSize="md">
                                  Employer Injury{" "}
                                  <FaInfoCircle
                                    size="0.8em"
                                    color="#718096"
                                    style={{ display: "inline", marginBottom: "3px" }}
                                  />
                                </FormLabel>
                              </Tooltip>
                              <Input
                                value={formData.governmentInfo.regionalEmployerInjury}
                                onChange={(e) =>
                                  handleChange(
                                    "governmentInfo",
                                    "regionalEmployerInjury",
                                    e.target.value
                                  )
                                }
                                placeholder="Enter amount"
                                size="lg"
                              />
                            </FormControl>

                            <FormControl>
                              <Tooltip
                                hasArrow
                                label="Contribution from employer for health insurance"
                                placement="top"
                              >
                                <FormLabel fontSize="md">
                                  Employer Health{" "}
                                  <FaInfoCircle
                                    size="0.8em"
                                    color="#718096"
                                    style={{ display: "inline", marginBottom: "3px" }}
                                  />
                                </FormLabel>
                              </Tooltip>
                              <Input
                                value={formData.governmentInfo.regionalEmployerHealth}
                                onChange={(e) =>
                                  handleChange(
                                    "governmentInfo",
                                    "regionalEmployerHealth",
                                    e.target.value
                                  )
                                }
                                placeholder="Enter amount"
                                size="lg"
                              />
                            </FormControl>
                          </SimpleGrid>
                        </Stack>
                      )}
                    </Box>
                  </Flex>
                </TabPanel>

                {/* Banking Tab */}
                <TabPanel>
                  <Flex height="100%">
                    {/* Vertical Sub-step Stepper */}
                    <Box
                      p={6}
                      width="280px"
                      borderRight="1px solid"
                      borderColor="gray.200"
                      flexShrink={0}
                      bg="gray.50"
                    >
                      <Stepper
                        index={bankingSubStep}
                        orientation="vertical"
                        size="lg"
                        gap={8}
                        sx={{
                          ".chakra-step__separator": {
                            minHeight: "40px",
                          },
                          ".chakra-step__separator[data-status=active]": {
                            bg: THEME_COLOR,
                          },
                          ".chakra-step__separator[data-status=complete]": {
                            bg: THEME_COLOR,
                          },
                          ".chakra-step__indicator[data-status=complete]": {
                            bg: THEME_COLOR,
                            borderColor: THEME_COLOR,
                          },
                          ".chakra-step__indicator[data-status=active]": {
                            bg: THEME_COLOR,
                            borderColor: THEME_COLOR,
                          },
                          ".chakra-step__indicator": {
                            width: "36px",
                            height: "36px",
                          },
                        }}
                      >
                        {bankingSubSteps.map((step, index) => (
                          <Step
                            key={index}
                            onClick={() => setBankingSubStep(index)}
                            cursor="pointer"
                            py={2}
                          >
                            <StepIndicator>
                              <StepStatus
                                complete={
                                  <StepIcon fontSize="1.2em" color="white" bg={THEME_COLOR} />
                                }
                                incomplete={<StepNumber fontSize="1.1em" color={THEME_COLOR} />}
                                active={
                                  <StepNumber fontSize="1.1em" color="white" bg={THEME_COLOR} />
                                }
                              />
                            </StepIndicator>
                            <Box flexShrink="0" ml={3}>
                              <StepTitle
                                fontWeight={bankingSubStep === index ? "bold" : "normal"}
                                fontSize="md"
                                mb={1}
                              >
                                {step.title}
                              </StepTitle>
                              <StepDescription fontSize="sm" color="gray.600">
                                {step.description}
                              </StepDescription>
                            </Box>
                            <StepSeparator />
                          </Step>
                        ))}
                      </Stepper>
                    </Box>

                    {/* Sub-step Content with Scroll */}
                    <Box
                      flex="1"
                      overflowY="auto"
                      css={{
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
                      }}
                    >
                      {/* Payment Notification Sub-step */}
                      {bankingSubStep === 0 && (
                        <Stack spacing={6} p={8}>
                          <Text fontSize="xl" fontWeight="bold" mb={2}>
                            Payment Notification
                          </Text>

                          <FormControl>
                            <FormLabel fontSize="md">Send Paystub by Email on Pay Day</FormLabel>
                            <Select
                              value={formData.bankingInfo.payStubSendByEmail}
                              onChange={(e) =>
                                handleChange("bankingInfo", "payStubSendByEmail", e.target.value)
                              }
                              size="lg"
                            >
                              <option value="Yes">Yes</option>
                              <option value="No">No</option>
                            </Select>
                          </FormControl>

                          {formData.bankingInfo.payStubSendByEmail === "Yes" && (
                            <FormControl>
                              <FormLabel fontSize="md">Email for Paystub Delivery</FormLabel>
                              <Input
                                type="email"
                                value={formData.bankingInfo.paymentEmail}
                                onChange={(e) =>
                                  handleChange("bankingInfo", "paymentEmail", e.target.value)
                                }
                                placeholder="Enter email address"
                                size="lg"
                              />
                            </FormControl>
                          )}

                          <Button
                            mt={4}
                            bg={THEME_COLOR}
                            color="white"
                            _hover={{ bg: "#4a2b4a" }}
                            size="lg"
                            onClick={() => {
                              toast({
                                title: "Payment notification settings saved",
                                status: "success",
                                duration: 3000,
                                isClosable: true,
                              });
                            }}
                          >
                            Save Notification Settings
                          </Button>
                        </Stack>
                      )}

                      {/* Banking Info Sub-step */}
                      {bankingSubStep === 1 && (
                        <Stack spacing={6} p={8}>
                          <Text fontSize="xl" fontWeight="bold" mb={2}>
                            Banking Information
                          </Text>

                          <FormControl>
                            <FormLabel fontSize="md">
                              Deposit Paycheque via Direct Deposit
                            </FormLabel>
                            <Select
                              value={formData.bankingInfo.directDeposit}
                              onChange={(e) =>
                                handleChange("bankingInfo", "directDeposit", e.target.value)
                              }
                              size="lg"
                            >
                              <option value="Yes">Yes</option>
                              <option value="No">No</option>
                            </Select>
                          </FormControl>

                          {formData.bankingInfo.directDeposit === "Yes" && (
                            <>
                              <FormControl
                                isRequired
                                isInvalid={bankingTouched.bankNum && bankingErrors.bankNum}
                              >
                                <FormLabel fontSize="md">Bank Number</FormLabel>
                                <Input
                                  value={formData.bankingInfo.bankNum}
                                  onChange={(e) =>
                                    handleChange("bankingInfo", "bankNum", e.target.value)
                                  }
                                  onBlur={() => handleBankingBlur("bankNum")}
                                  placeholder="Enter bank number (3 digits)"
                                  size="lg"
                                />
                                <FormErrorMessage>{bankingErrors.bankNum}</FormErrorMessage>
                              </FormControl>

                              <FormControl
                                isRequired
                                isInvalid={bankingTouched.transitNum && bankingErrors.transitNum}
                              >
                                <FormLabel fontSize="md">Transit Number</FormLabel>
                                <Input
                                  value={formData.bankingInfo.transitNum}
                                  onChange={(e) =>
                                    handleChange("bankingInfo", "transitNum", e.target.value)
                                  }
                                  onBlur={() => handleBankingBlur("transitNum")}
                                  placeholder="Enter transit number (5 digits)"
                                  size="lg"
                                />
                                <FormErrorMessage>{bankingErrors.transitNum}</FormErrorMessage>
                              </FormControl>

                              <FormControl
                                isRequired
                                isInvalid={bankingTouched.accountNum && bankingErrors.accountNum}
                              >
                                <FormLabel fontSize="md">Account Number</FormLabel>
                                <Input
                                  value={formData.bankingInfo.accountNum}
                                  onChange={(e) =>
                                    handleChange("bankingInfo", "accountNum", e.target.value)
                                  }
                                  onBlur={() => handleBankingBlur("accountNum")}
                                  placeholder="Enter account number (7-16 digits)"
                                  size="lg"
                                />
                                <FormErrorMessage>{bankingErrors.accountNum}</FormErrorMessage>
                              </FormControl>
                            </>
                          )}

                          <Button
                            mt={4}
                            bg={THEME_COLOR}
                            color="white"
                            _hover={{ bg: "#4a2b4a" }}
                            size="lg"
                            onClick={handleBankingSubmit}
                          >
                            Save Banking Information
                          </Button>
                        </Stack>
                      )}
                    </Box>
                  </Flex>
                </TabPanel>
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
                  size="lg"
                  px={6}
                >
                  Back
                </Button>
              )}

              <Button
                rightIcon={getNextButtonIcon()}
                onClick={getNextButtonAction()}
                bg={isLastStep ? THEME_COLOR : THEME_COLOR}
                color="white"
                _hover={{ bg: "#4a2b4a" }}
                size="lg"
                px={6}
              >
                {getNextButtonText()}
              </Button>

              <Button
                onClick={onClose}
                variant="ghost"
                size="lg"
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
    </>
  );
};

export default NewEmployeeOnboardingModal;
