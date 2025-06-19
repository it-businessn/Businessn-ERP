import {
	Box,
	Flex,
	FormControl,
	FormLabel,
	HStack,
	Input,
	Stack,
	Step,
	StepIcon,
	StepIndicator,
	StepNumber,
	Stepper,
	StepSeparator,
	StepStatus,
	StepTitle,
} from "@chakra-ui/react";
import TextTitle from "components/ui/text/TextTitle";
import { tabPanelStyleCss, tabScrollCss } from "erp-modules/payroll/onboard-user/customInfo";

const MasterUserInfo = ({ formData, setFormData }) => {
	const handleChange = (section, field, value) => {
		setFormData({
			...formData,
			[section]: {
				...formData[section],
				[field]: value,
			},
		});
	};
	return (
		<Flex height="100%">
			<Box
				display={{ base: "none", md: "flex" }}
				p={6}
				borderRight="1px solid"
				borderColor="gray.200"
				flex={0.2}
				bg="gray.50"
			>
				<Stepper index={0} orientation="vertical" gap={8} sx={tabPanelStyleCss}>
					<Step cursor="pointer" py={2}>
						<StepIndicator>
							<StepStatus
								complete={<StepIcon fontSize="1.2em" color="white" bg={"var(--banner_bg)"} />}
								incomplete={<StepNumber fontSize="1.1em" color={"var(--banner_bg)"} />}
								active={<StepNumber fontSize="1.1em" color="white" bg={"var(--banner_bg)"} />}
							/>
						</StepIndicator>
						<Box ml={3} whiteSpace="wrap">
							<StepTitle fontWeight={"bold"} mb={1}>
								Personal Details
							</StepTitle>
						</Box>
						<StepSeparator />
					</Step>
				</Stepper>
			</Box>
			<Box flex={1} overflowY="auto" css={tabScrollCss}>
				<Stack spacing={3} p={5}>
					<TextTitle size="xl" title="Personal Details" />
					<Stack>
						<HStack alignItems="center" spacing={5}>
							<FormControl isRequired>
								<FormLabel size="sm">First Name</FormLabel>
								<Input
									size="sm"
									value={formData.personalInfo.firstName || ""}
									onChange={(e) => handleChange("personalInfo", "firstName", e.target.value)}
									placeholder="Enter first name"
								/>
							</FormControl>
							<FormControl isRequired>
								<FormLabel size="sm">Middle Name</FormLabel>
								<Input
									size="sm"
									value={formData.personalInfo.middleName || ""}
									onChange={(e) => handleChange("personalInfo", "middleName", e.target.value)}
									placeholder="Enter middle name"
								/>
							</FormControl>
							<FormControl isRequired>
								<FormLabel size="sm">Last Name</FormLabel>
								<Input
									size="sm"
									value={formData.personalInfo.lastName || ""}
									onChange={(e) => handleChange("personalInfo", "lastName", e.target.value)}
									placeholder="Enter last name"
								/>
							</FormControl>
						</HStack>
						<HStack alignItems="center" spacing={5}>
							<FormControl isRequired>
								<FormLabel size="sm">Email </FormLabel>
								<Input
									size="sm"
									type="email"
									value={formData.personalInfo.email || ""}
									onChange={(e) => handleChange("personalInfo", "email", e.target.value)}
									placeholder="Please enter email address"
								/>
							</FormControl>
							<FormControl isRequired>
								<FormLabel size="sm">Phone Number </FormLabel>
								<Input
									size="sm"
									type="tel"
									value={formData.personalInfo.phoneNumber || ""}
									onChange={(e) => handleChange("personalInfo", "phoneNumber", e.target.value)}
									placeholder="Please enter phone number"
								/>
							</FormControl>
						</HStack>
						<HStack alignItems="center" spacing={5}>
							<FormControl isRequired>
								<FormLabel size="sm">Role / Position </FormLabel>
								<Input
									size="sm"
									value={formData.personalInfo.position || ""}
									onChange={(e) => handleChange("personalInfo", "position", e.target.value)}
									placeholder="Enter position"
								/>
							</FormControl>
							<FormControl isRequired>
								<FormLabel size="sm">Start Date</FormLabel>
								<Input
									size="sm"
									type="date"
									value={formData.personalInfo.startDate || ""}
									onChange={(e) => handleChange("personalInfo", "startDate", e.target.value)}
								/>
							</FormControl>
						</HStack>
					</Stack>
				</Stack>
			</Box>
		</Flex>
	);
};

export default MasterUserInfo;
