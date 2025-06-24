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
	useToast,
} from "@chakra-ui/react";
import PrimaryButton from "components/ui/button/PrimaryButton";
import TextTitle from "components/ui/text/TextTitle";
import {
	COUNTRIES,
	personalSubSteps,
	tabPanelStyleCss,
	tabScrollCss,
	userInfoDetails,
} from "erp-modules/payroll/onboard-user/customInfo";
import useEmployeeProfileInfo from "hooks/useEmployeeProfileInfo";
import { useEffect, useState } from "react";
import PayrollService from "services/PayrollService";
import { getDefaultDate } from "utils/convertDate";

const PersonalInfo = ({ company, userId }) => {
	const [personalSubStep, setPersonalSubStep] = useState(0);
	const [moreDetails, setMoreDetails] = useState(null);
	const [availableProvinces, setAvailableProvinces] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [formData, setFormData] = useState(userInfoDetails);

	const toast = useToast();
	const profileInfo = useEmployeeProfileInfo(company, userId);

	useEffect(() => {
		if (profileInfo) {
			const {
				firstName,
				middleName,
				lastName,
				birthDate,
				gender,
				SIN,
				workPermitNo,
				workPermitExpiryNo,
				citizenship,
				personalEmail,
				businessEmail,
				personalPhoneNum,
				businessPhoneNum,
				streetAddress,
				city,
				streetAddressSuite,
				country,
				province,
				postalCode,
				emergencyFirstName,
				emergencyLastName,
				emergencyPersonalEmail,
				emergencyPersonalPhoneNum,
				emergencyContactRelationship,
				empId,
				_id,
			} = profileInfo;

			setFormData({
				personalInfo: {
					firstName,
					middleName,
					lastName,
					birthDate,
					gender,
					SIN,
					workPermitNo,
					workPermitExpiryNo,
					citizenship,
				},
				contactInfo: {
					personalEmail,
					businessEmail,
					personalPhoneNum,
					businessPhoneNum,
					streetAddress,
					city,
					streetAddressSuite,
					country,
					province,
					postalCode,
				},
				emergencyContact: {
					emergencyFirstName,
					emergencyLastName,
					emergencyPersonalEmail,
					emergencyPersonalPhoneNum,
					emergencyContactRelationship,
				},
			});
			setMoreDetails({ empId, _id });
		}
	}, [profileInfo]);

	useEffect(() => {
		const selectedCountry = COUNTRIES.find(
			(country) => country.type === formData.contactInfo.country,
		);
		if (selectedCountry) {
			setAvailableProvinces(selectedCountry?.provinces);
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

	const handleChange = (section, field, value) => {
		setFormData({
			...formData,
			[section]: {
				...formData[section],
				[field]: value,
			},
		});
	};

	const handleSave = async () => {
		setIsLoading(true);
		try {
			const {
				firstName,
				middleName,
				lastName,
				birthDate,
				gender,
				SIN,
				workPermitNo,
				workPermitExpiryNo,
				citizenship,
			} = formData.personalInfo;

			const {
				personalEmail,
				businessEmail,
				streetAddress,
				personalPhoneNum,
				businessPhoneNum,
				streetAddressSuite,
				city,
				province,
				country,
				postalCode,
			} = formData.contactInfo;

			const {
				emergencyFirstName,
				emergencyLastName,
				emergencyPersonalEmail,
				emergencyPersonalPhoneNum,
				emergencyContactRelationship,
			} = formData.emergencyContact;

			const profileData = {
				empId: moreDetails.empId,
				companyName: company,
				firstName,
				middleName,
				lastName,
				birthDate,
				gender,
				SIN,
				workPermitNo,
				workPermitExpiryNo,
				citizenship,
				personalEmail,
				businessEmail,
				personalPhoneNum,
				businessPhoneNum,
				streetAddress,
				city,
				streetAddressSuite,
				country,
				province,
				postalCode,
				emergencyFirstName,
				emergencyLastName,
				emergencyPersonalEmail,
				emergencyPersonalPhoneNum,
				emergencyContactRelationship,
			};
			const { data } = await PayrollService.updateEmployeeProfileInfo(
				profileData,
				moreDetails?._id,
			);
			setIsLoading(false);
			toast({
				title: "Personal info updated successfully.",
				status: "success",
				duration: 1000,
				isClosable: true,
			});
		} catch (error) {}
	};

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
						<Step
							key={`step_num_${step.title}_${index}`}
							onClick={() => setPersonalSubStep(index)}
							cursor="pointer"
							py={2}
						>
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

			<Box flex={0.7} overflowY="auto" css={tabScrollCss}>
				{personalSubStep === 0 && (
					<Stack spacing={4} p={5}>
						<TextTitle size="xl" title="Basic Information" />

						<Flex gap={4}>
							<FormControl isRequired>
								<FormLabel size="sm">First Name</FormLabel>
								<Input
									size="sm"
									value={formData.personalInfo.firstName || ""}
									onChange={(e) => handleChange("personalInfo", "firstName", e.target.value)}
									placeholder="First Name"
								/>
							</FormControl>

							<FormControl>
								<FormLabel size="sm">Middle Name</FormLabel>
								<Input
									size="sm"
									value={formData.personalInfo.middleName || ""}
									onChange={(e) => handleChange("personalInfo", "middleName", e.target.value)}
									placeholder="Middle Name"
								/>
							</FormControl>

							<FormControl isRequired>
								<FormLabel size="sm">Last Name</FormLabel>
								<Input
									size="sm"
									value={formData.personalInfo.lastName || ""}
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
									value={
										formData.personalInfo.birthDate
											? getDefaultDate(formData.personalInfo.birthDate)
											: ""
									}
									onChange={(e) => handleChange("personalInfo", "birthDate", e.target.value)}
								/>
							</FormControl>

							<FormControl>
								<FormLabel size="sm">Gender</FormLabel>
								<Select
									size="sm"
									value={formData.personalInfo.gender || ""}
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
								value={formData.personalInfo.SIN || ""}
								onChange={(e) => handleChange("personalInfo", "SIN", e.target.value)}
								placeholder="Social Security Number"
							/>
						</FormControl>

						<Flex gap={4}>
							<FormControl>
								<FormLabel size="sm">Work Permit Number</FormLabel>
								<Input
									size="sm"
									value={formData.personalInfo.workPermitNo || ""}
									onChange={(e) => handleChange("personalInfo", "workPermitNo", e.target.value)}
									placeholder="Work Permit Number"
								/>
							</FormControl>

							<FormControl>
								<FormLabel size="sm">Work Permit Expiry</FormLabel>
								<Input
									size="sm"
									type="date"
									value={formData.personalInfo.workPermitExpiryNo || ""}
									onChange={(e) =>
										handleChange("personalInfo", "workPermitExpiryNo", e.target.value)
									}
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
									value={formData.contactInfo.personalEmail || ""}
									onChange={(e) => handleChange("contactInfo", "personalEmail", e.target.value)}
									placeholder="Personal Email Address"
								/>
							</FormControl>

							<FormControl>
								<FormLabel size="sm">Work Email</FormLabel>
								<Input
									size="sm"
									type="email"
									value={formData.contactInfo.businessEmail || ""}
									onChange={(e) => handleChange("contactInfo", "businessEmail", e.target.value)}
									placeholder="Work Email Address"
								/>
							</FormControl>
						</Flex>

						<Flex gap={4}>
							<FormControl isRequired>
								<FormLabel size="sm">Personal Phone</FormLabel>
								<Input
									size="sm"
									type="tel"
									value={formData.contactInfo.personalPhoneNum || ""}
									onChange={(e) => handleChange("contactInfo", "personalPhoneNum", e.target.value)}
									placeholder="Personal Phone Number"
								/>
							</FormControl>

							<FormControl>
								<FormLabel size="sm">Work Phone</FormLabel>
								<Input
									size="sm"
									type="tel"
									value={formData.contactInfo.businessPhoneNum || ""}
									onChange={(e) => handleChange("contactInfo", "businessPhoneNum", e.target.value)}
									placeholder="Work Phone Number"
								/>
							</FormControl>
						</Flex>
						<TextTitle size="sm" title="Address" />
						<Flex gap={4} mb={2}>
							<FormControl>
								<FormLabel size="sm">Suite</FormLabel>
								<Input
									size="sm"
									value={formData.contactInfo.streetAddressSuite}
									onChange={(e) =>
										handleChange("contactInfo", "streetAddressSuite", e.target.value)
									}
									placeholder="Street Address"
								/>
							</FormControl>
							<FormControl isRequired>
								<FormLabel size="sm">Street Address</FormLabel>
								<Input
									size="sm"
									value={formData.contactInfo.streetAddress || ""}
									onChange={(e) => handleChange("contactInfo", "streetAddress", e.target.value)}
									placeholder="Street Address"
								/>
							</FormControl>
						</Flex>

						<Flex gap={4}>
							<FormControl isRequired>
								<FormLabel size="sm">City</FormLabel>
								<Input
									size="sm"
									value={formData.contactInfo.city || ""}
									onChange={(e) => handleChange("contactInfo", "city", e.target.value)}
									placeholder="City"
								/>
							</FormControl>

							<FormControl isRequired>
								<FormLabel size="sm">ZIP/Postal Code</FormLabel>
								<Input
									size="sm"
									value={formData.contactInfo.postalCode || ""}
									onChange={(e) => handleChange("contactInfo", "postalCode", e.target.value)}
									placeholder="ZIP/Postal Code"
								/>
							</FormControl>
						</Flex>
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
									value={formData.contactInfo.province || ""}
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
					</Stack>
				)}
				{personalSubStep === 2 && (
					<Stack spacing={4} p={5}>
						<TextTitle size="xl" title="Emergency Contact" />

						<Flex gap={4}>
							<FormControl>
								<FormLabel size="sm">First Name</FormLabel>
								<Input
									size="sm"
									value={formData.emergencyContact.emergencyFirstName || ""}
									onChange={(e) =>
										handleChange("emergencyContact", "emergencyFirstName", e.target.value)
									}
									placeholder="First Name"
								/>
							</FormControl>

							<FormControl>
								<FormLabel size="sm">Last Name</FormLabel>
								<Input
									size="sm"
									value={formData.emergencyContact.emergencyLastName}
									onChange={(e) =>
										handleChange("emergencyContact", "emergencyLastName", e.target.value)
									}
									placeholder="Last Name"
								/>
							</FormControl>
						</Flex>

						<FormControl>
							<FormLabel size="sm">Personal Email</FormLabel>
							<Input
								size="sm"
								type="email"
								value={formData.emergencyContact.emergencyPersonalEmail || ""}
								onChange={(e) =>
									handleChange("emergencyContact", "emergencyPersonalEmail", e.target.value)
								}
								placeholder="Email Address"
							/>
						</FormControl>

						<FormControl>
							<FormLabel size="sm">Personal Phone</FormLabel>
							<Input
								size="sm"
								type="tel"
								value={formData.emergencyContact.emergencyPersonalPhoneNum || ""}
								onChange={(e) =>
									handleChange("emergencyContact", "emergencyPersonalPhoneNum", e.target.value)
								}
								placeholder="Phone Number"
							/>
						</FormControl>

						<FormControl>
							<FormLabel size="sm">Relationship</FormLabel>
							<Select
								value={formData.emergencyContact.emergencyContactRelationship || ""}
								onChange={(e) =>
									handleChange("emergencyContact", "emergencyContactRelationship", e.target.value)
								}
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
				<PrimaryButton
					bg="var(--banner_bg)"
					size="sm"
					onOpen={handleSave}
					ml={5}
					mt={4}
					borderRadius={6}
					name="Save"
					isLoading={isLoading}
				/>
			</Box>
		</Flex>
	);
};
export default PersonalInfo;
