import {
	Box,
	Flex,
	FormControl,
	FormLabel,
	Input,
	Select,
	Stack,
	Step,
	StepDescription,
	StepIcon,
	StepIndicator,
	StepNumber,
	Stepper,
	StepSeparator,
	StepStatus,
	StepTitle,
} from "@chakra-ui/react";
import TextTitle from "components/ui/text/TextTitle";

import * as Yup from "yup";
import { COUNTRIES, personalSubSteps } from "./userInfoDetails";

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

const PersonalInfo = ({
	personalSubStep,
	setPersonalSubStep,
	tabPanelStyleCss,
	tabScrollCss,
	formData,
	handleChange,
	availableProvinces,
}) => {
	return (
		<Flex height="100%">
			<Box
				p={6}
				width="280px"
				borderRight="1px solid"
				borderColor="gray.200"
				flexShrink={0}
				bg="gray.50"
			>
				<Stepper index={personalSubStep} orientation="vertical" gap={8} sx={tabPanelStyleCss}>
					{personalSubSteps.map((step, index) => (
						<Step key={index} onClick={() => setPersonalSubStep(index)} cursor="pointer" py={2}>
							<StepIndicator>
								<StepStatus
									complete={<StepIcon fontSize="1.2em" color="white" bg={"var(--banner_bg)"} />}
									incomplete={<StepNumber fontSize="1.1em" color={"var(--banner_bg)"} />}
									active={<StepNumber fontSize="1.1em" color="white" bg={"var(--banner_bg)"} />}
								/>
							</StepIndicator>
							<Box flexShrink="0" ml={3}>
								<StepTitle fontWeight={personalSubStep === index ? "bold" : "normal"} mb={1}>
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

			<Box flex="1" overflowY="auto" css={tabScrollCss}>
				{personalSubStep === 0 && (
					<Stack spacing={4} p={5}>
						<TextTitle size="xl" title="Basic Information" />

						<Flex gap={4}>
							<FormControl isRequired>
								<FormLabel size="sm">First Name</FormLabel>
								<Input
									size="sm"
									value={formData.personalInfo.firstName}
									onChange={(e) => handleChange("personalInfo", "firstName", e.target.value)}
									placeholder="First Name"
								/>
							</FormControl>

							<FormControl>
								<FormLabel size="sm">Middle Name</FormLabel>
								<Input
									size="sm"
									value={formData.personalInfo.middleName}
									onChange={(e) => handleChange("personalInfo", "middleName", e.target.value)}
									placeholder="Middle Name"
								/>
							</FormControl>

							<FormControl isRequired>
								<FormLabel size="sm">Last Name</FormLabel>
								<Input
									size="sm"
									value={formData.personalInfo.lastName}
									onChange={(e) => handleChange("personalInfo", "lastName", e.target.value)}
									placeholder="Last Name"
								/>
							</FormControl>
						</Flex>

						<Flex gap={4}>
							<FormControl>
								<FormLabel size="sm">Date of Birth</FormLabel>
								<Input
									size="sm"
									type="date"
									value={formData.personalInfo.dateOfBirth}
									onChange={(e) => handleChange("personalInfo", "dateOfBirth", e.target.value)}
								/>
							</FormControl>

							<FormControl>
								<FormLabel size="sm">Gender</FormLabel>
								<Select
									size="sm"
									value={formData.personalInfo.gender}
									onChange={(e) => handleChange("personalInfo", "gender", e.target.value)}
									placeholder="Select Gender"
								>
									<option value="male">Male</option>
									<option value="female">Female</option>
									<option value="other">Other</option>
									<option value="preferNotToSay">Prefer not to say</option>
								</Select>
							</FormControl>
						</Flex>

						<FormControl>
							<FormLabel size="sm">SSN / National ID</FormLabel>
							<Input
								size="sm"
								value={formData.personalInfo.ssn}
								onChange={(e) => handleChange("personalInfo", "ssn", e.target.value)}
								placeholder="Social Security Number"
							/>
						</FormControl>

						<Flex gap={4}>
							<FormControl>
								<FormLabel size="sm">Work Permit Number</FormLabel>
								<Input
									size="sm"
									value={formData.personalInfo.workPermitNumber}
									onChange={(e) => handleChange("personalInfo", "workPermitNumber", e.target.value)}
									placeholder="Work Permit Number"
								/>
							</FormControl>

							<FormControl>
								<FormLabel size="sm">Work Permit Expiry</FormLabel>
								<Input
									size="sm"
									type="date"
									value={formData.personalInfo.workPermitExpiry}
									onChange={(e) => handleChange("personalInfo", "workPermitExpiry", e.target.value)}
								/>
							</FormControl>
						</Flex>

						<FormControl>
							<FormLabel size="sm">Citizenship</FormLabel>
							<Flex gap={4} mt={2}>
								<label>
									<input
										type="radio"
										checked={formData.personalInfo.citizenship === "Yes"}
										onChange={() => handleChange("personalInfo", "citizenship", "Yes")}
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
					<Stack spacing={4} p={5}>
						<TextTitle size="xl" title="Contact Information" />

						<Flex gap={4}>
							<FormControl isRequired>
								<FormLabel size="sm">Personal Email</FormLabel>
								<Input
									size="sm"
									type="email"
									value={formData.contactInfo.email}
									onChange={(e) => handleChange("contactInfo", "email", e.target.value)}
									placeholder="Personal Email Address"
								/>
							</FormControl>

							<FormControl>
								<FormLabel size="sm">Work Email</FormLabel>
								<Input
									size="sm"
									type="email"
									value={formData.contactInfo.workEmail}
									onChange={(e) => handleChange("contactInfo", "workEmail", e.target.value)}
									placeholder="Work Email Address"
								/>
							</FormControl>
						</Flex>

						<Flex gap={4}>
							<FormControl isRequired>
								<FormLabel size="sm">Personal Phone</FormLabel>
								<Input
									size="sm"
									value={formData.contactInfo.personalPhone}
									onChange={(e) => handleChange("contactInfo", "personalPhone", e.target.value)}
									placeholder="Personal Phone Number"
								/>
							</FormControl>

							<FormControl>
								<FormLabel size="sm">Work Phone</FormLabel>
								<Input
									size="sm"
									value={formData.contactInfo.workPhone}
									onChange={(e) => handleChange("contactInfo", "workPhone", e.target.value)}
									placeholder="Work Phone Number"
								/>
							</FormControl>
						</Flex>

						<FormControl isRequired>
							<FormLabel size="sm">Street Address</FormLabel>
							<Input
								size="sm"
								value={formData.contactInfo.address}
								onChange={(e) => handleChange("contactInfo", "address", e.target.value)}
								placeholder="Street Address"
							/>
						</FormControl>

						<Flex gap={4} mb={2}>
							<FormControl isRequired>
								<FormLabel size="sm">Country</FormLabel>
								<Select
									value={formData.contactInfo.country}
									onChange={(e) => handleChange("contactInfo", "country", e.target.value)}
								>
									{COUNTRIES.map((country) => (
										<option key={country.type} value={country.type}>
											{country.type}
										</option>
									))}
								</Select>
							</FormControl>

							<FormControl isRequired>
								<FormLabel size="sm">Province/State</FormLabel>
								<Select
									value={formData.contactInfo.province}
									onChange={(e) => handleChange("contactInfo", "province", e.target.value)}
								>
									{availableProvinces.map((province) => (
										<option key={province} value={province}>
											{province}
										</option>
									))}
								</Select>
							</FormControl>
						</Flex>

						<Flex gap={4}>
							<FormControl isRequired>
								<FormLabel size="sm">City</FormLabel>
								<Input
									size="sm"
									value={formData.contactInfo.city}
									onChange={(e) => handleChange("contactInfo", "city", e.target.value)}
									placeholder="City"
								/>
							</FormControl>

							<FormControl isRequired>
								<FormLabel size="sm">ZIP/Postal Code</FormLabel>
								<Input
									size="sm"
									value={formData.contactInfo.zipCode}
									onChange={(e) => handleChange("contactInfo", "zipCode", e.target.value)}
									placeholder="ZIP/Postal Code"
								/>
							</FormControl>
						</Flex>
					</Stack>
				)}

				{personalSubStep === 2 && (
					<Stack spacing={4} p={5}>
						<TextTitle size="xl" title="Emergency Contact" />

						<Flex gap={4}>
							<FormControl isRequired>
								<FormLabel size="sm">First Name</FormLabel>
								<Input
									size="sm"
									value={formData.emergencyContact.firstName}
									onChange={(e) => handleChange("emergencyContact", "firstName", e.target.value)}
									placeholder="First Name"
								/>
							</FormControl>

							<FormControl isRequired>
								<FormLabel size="sm">Last Name</FormLabel>
								<Input
									size="sm"
									value={formData.emergencyContact.lastName}
									onChange={(e) => handleChange("emergencyContact", "lastName", e.target.value)}
									placeholder="Last Name"
								/>
							</FormControl>
						</Flex>

						<FormControl isRequired>
							<FormLabel size="sm">Personal Email</FormLabel>
							<Input
								size="sm"
								type="email"
								value={formData.emergencyContact.email}
								onChange={(e) => handleChange("emergencyContact", "email", e.target.value)}
								placeholder="Email Address"
							/>
						</FormControl>

						<FormControl isRequired>
							<FormLabel size="sm">Personal Phone</FormLabel>
							<Input
								size="sm"
								value={formData.emergencyContact.phone}
								onChange={(e) => handleChange("emergencyContact", "phone", e.target.value)}
								placeholder="Phone Number"
							/>
						</FormControl>

						<FormControl isRequired>
							<FormLabel size="sm">Relationship</FormLabel>
							<Select
								value={formData.emergencyContact.relationship}
								onChange={(e) => handleChange("emergencyContact", "relationship", e.target.value)}
								placeholder="Select Relationship"
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
	);
};
export default PersonalInfo;
