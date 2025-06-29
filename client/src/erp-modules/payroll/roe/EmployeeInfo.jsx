import {
	Box,
	Flex,
	FormControl,
	FormLabel,
	HStack,
	Input,
	Select,
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
import InputFormControl from "components/ui/form/InputFormControl";
import TextTitle from "components/ui/text/TextTitle";
import {
	COUNTRIES,
	tabPanelStyleCss,
	tabScrollCss,
} from "erp-modules/payroll/onboard-user/customInfo";
import { useEffect, useState } from "react";

const EmployeeInfo = ({ formData, setFormData }) => {
	const [provinces, setProvinces] = useState([]);

	useEffect(() => {
		if (formData?.empInfo?.country) {
			setProvinces(COUNTRIES.find(({ code }) => code === formData?.empInfo?.country)?.provinces);
		}
	}, [formData?.empInfo?.country]);

	const handleFieldChange = (section, field, value) => {
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
				<Stepper orientation="vertical" gap={8} sx={tabPanelStyleCss}>
					<Step cursor="pointer" py={2}>
						<StepIndicator>
							<StepStatus
								complete={<StepIcon fontSize="1.2em" color="white" bg={"var(--banner_bg)"} />}
								incomplete={<StepNumber fontSize="1.1em" color={"var(--banner_bg)"} />}
								active={<StepNumber fontSize="1.1em" color="white" bg={"var(--banner_bg)"} />}
							/>
						</StepIndicator>
						<Box flexShrink="0" ml={3} whiteSpace="wrap">
							<StepTitle fontWeight={"bold"} mb={1}>
								Personal Information
							</StepTitle>
						</Box>
						<StepSeparator />
					</Step>
				</Stepper>
			</Box>
			<Box flex={{ base: 1, md: 0.7 }} overflowY="auto" css={tabScrollCss}>
				<Stack spacing={3} p={5}>
					<TextTitle size="xl" title="Personal Information" />
					<Stack>
						<HStack>
							<FormControl isRequired>
								<FormLabel size="sm">First Name</FormLabel>
								<Input
									size="sm"
									value={formData.empInfo?.firstName || ""}
									onChange={(e) => handleFieldChange("empInfo", "firstName", e.target.value)}
									placeholder="Please enter first name"
								/>
							</FormControl>
							<FormControl>
								<FormLabel size="sm">Middle Name</FormLabel>
								<Input
									size="sm"
									value={formData.empInfo?.middleName || ""}
									onChange={(e) => handleFieldChange("empInfo", "middleName", e.target.value)}
									placeholder="Please enter middle name"
								/>
							</FormControl>
							<FormControl isRequired>
								<FormLabel size="sm">Last Name </FormLabel>
								<Input
									size="sm"
									value={formData.empInfo?.lastName || ""}
									onChange={(e) => handleFieldChange("empInfo", "lastName", e.target.value)}
									placeholder="Please enter last name"
								/>
							</FormControl>
						</HStack>
						<FormControl isRequired>
							<FormLabel size="sm">Social Insurance Number </FormLabel>
							<Input
								size="sm"
								value={formData.empInfo?.SIN || ""}
								onChange={(e) => handleFieldChange("empInfo", "SIN", e.target.value)}
								placeholder="Please enter SSN"
							/>
						</FormControl>
						<TextTitle title="Address" />
						<HStack>
							<FormControl isRequired>
								<FormLabel size="sm">Street Address </FormLabel>
								<Input
									size="sm"
									value={formData.empInfo?.streetAddress || ""}
									onChange={(e) => handleFieldChange("empInfo", "streetAddress", e.target.value)}
									placeholder="Please enter street address"
								/>
							</FormControl>
							<FormControl>
								<FormLabel size="sm"> Suite </FormLabel>
								<Input
									size="sm"
									value={formData.empInfo?.streetAddressSuite || ""}
									onChange={(e) =>
										handleFieldChange("empInfo", "streetAddressSuite", e.target.value)
									}
									placeholder="Please enter suite no"
								/>
							</FormControl>
							<FormControl isRequired>
								<FormLabel size="sm">City</FormLabel>
								<Input
									size="sm"
									value={formData.empInfo?.city || ""}
									onChange={(e) => handleFieldChange("empInfo", "city", e.target.value)}
									placeholder="Please enter city"
								/>
							</FormControl>
						</HStack>
						<HStack>
							<FormControl>
								<FormLabel size="sm">Country</FormLabel>
								<Select
									placeholder="Select Country"
									value={formData?.empInfo?.country || ""}
									onChange={(e) => handleFieldChange("empInfo", "country", e.target.value)}
								>
									{COUNTRIES.map(({ type, code }) => (
										<option key={type} value={code}>
											{type}
										</option>
									))}
								</Select>
							</FormControl>
							<FormControl>
								<FormLabel size="sm">Province / State</FormLabel>
								<Select
									placeholder="Select Province / State"
									value={formData?.empInfo?.province || ""}
									onChange={(e) => handleFieldChange("empInfo", "province", e.target.value)}
								>
									{provinces.map(({ name, id }) => (
										<option key={name} value={id}>
											{name}
										</option>
									))}
								</Select>
							</FormControl>
							<InputFormControl
								size="sm"
								label="Postal Code"
								required
								name="postalCode"
								placeholder="Enter Postal Code"
								valueText={formData?.empInfo?.postalCode || ""}
								handleChange={(e) => handleFieldChange("empInfo", "postalCode", e.target.value)}
							/>
						</HStack>
					</Stack>
				</Stack>
			</Box>
		</Flex>
	);
};

export default EmployeeInfo;
