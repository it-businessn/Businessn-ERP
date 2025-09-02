import {
	Box,
	Flex,
	HStack,
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
import RadioFormControl from "components/ui/form/RadioFormControl";
import SelectFormControl from "components/ui/form/SelectFormControl";
import NormalTextTitle from "components/ui/NormalTextTitle";
import TextTitle from "components/ui/text/TextTitle";
import { tabPanelStyleCss, tabScrollCss } from "erp-modules/payroll/onboard-user/customInfo";

const EmployerInfo = ({ formData, setFormData, admins }) => {
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
								Employer Details
							</StepTitle>
						</Box>
						<StepSeparator />
					</Step>
				</Stepper>
			</Box>
			<Box flex={{ base: 1, md: 0.7 }} overflowY="auto" css={tabScrollCss}>
				<Stack spacing={3} p={5}>
					<TextTitle size="xl" title="Personal Information" />
					<HStack alignItems="baseline" justifyContent="space-between">
						<Box>
							<TextTitle title="Employer Name" />
							<NormalTextTitle title={formData?.employerInfo?.name} />
						</Box>
						<Box>
							<TextTitle title="Employer Address" />
							<NormalTextTitle title={formData?.employerInfo?.address?.streetNumber} />
							<NormalTextTitle title={formData?.employerInfo?.address?.city} />
							<NormalTextTitle
								title={`${formData?.employerInfo?.address?.state} ${formData?.employerInfo?.address?.country}`}
							/>
							<NormalTextTitle title={formData?.employerInfo?.address?.postalCode} />
						</Box>
						<Box>
							<TextTitle title="CRA Payroll Account Number" />
							<NormalTextTitle title={formData?.employerInfo?.registration_number} />
						</Box>
					</HStack>

					<HStack>
						{admins && (
							<Stack>
								<TextTitle title="Contact Name" />
								<SelectFormControl
									valueParam="fullName"
									name="fullName"
									label=""
									valueText={formData?.employerInfo?.contactName}
									handleChange={(e) =>
										handleFieldChange("employerInfo", "contactName", e.target.value)
									}
									options={admins}
								/>
							</Stack>
						)}
						<Stack>
							<TextTitle title="Contact Telephone Number" />
							<HStack>
								<InputFormControl
									type="tel"
									label=""
									name="contactTelNumber"
									placeholder="Enter Telephone Number"
									valueText={formData?.employerInfo?.contactTelNumber || ""}
									handleChange={(e) =>
										handleFieldChange("employerInfo", "contactTelNumber", e.target.value)
									}
								/>
								<InputFormControl
									label=""
									name="contactExtNumber"
									placeholder="Enter Ext Number"
									valueText={formData?.employerInfo?.contactExtNumber || ""}
									handleChange={(e) =>
										handleFieldChange("employerInfo", "contactExtNumber", e.target.value)
									}
								/>
							</HStack>
						</Stack>
					</HStack>
					<HStack>
						<Stack>
							<TextTitle title="Issuer Name" />
							{admins && (
								<SelectFormControl
									valueParam="fullName"
									name="fullName"
									label=""
									valueText={formData?.employerInfo?.issuerName}
									handleChange={(e) =>
										handleFieldChange("employerInfo", "issuerName", e.target.value)
									}
									options={admins}
								/>
							)}
						</Stack>
						<Stack>
							<TextTitle title="Issuer Telephone Number" />
							<HStack>
								<InputFormControl
									type="tel"
									label=""
									name="issuerTelNumber"
									placeholder="Enter Telephone Number"
									valueText={formData?.employerInfo?.issuerTelNumber || ""}
									handleChange={(e) =>
										handleFieldChange("employerInfo", "issuerTelNumber", e.target.value)
									}
								/>
								<InputFormControl
									label=""
									name="issuerExtNumber"
									placeholder="Enter Ext Number"
									valueText={formData?.employerInfo?.issuerExtNumber || ""}
									handleChange={(e) =>
										handleFieldChange("employerInfo", "issuerExtNumber", e.target.value)
									}
								/>
							</HStack>
						</Stack>
					</HStack>
					<RadioFormControl
						label="Preferred Communication"
						handleChange={(value) =>
							handleFieldChange("employerInfo", "preferredCommunication", value)
						}
						defaultVal="E"
						options={[
							{ name: "English", value: "E" },
							{ name: "French", value: "F" },
						]}
					/>
				</Stack>
			</Box>
		</Flex>
	);
};

export default EmployerInfo;
