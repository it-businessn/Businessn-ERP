import {
	Box,
	Flex,
	FormControl,
	FormLabel,
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
import BoxCard from "components/ui/card";
import TextTitle from "components/ui/text/TextTitle";
import { tabPanelStyleCss, tabScrollCss } from "erp-modules/payroll/onboard-user/customInfo";

const ContactInfo = ({ formData, setFormData }) => {
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
						<Box whiteSpace="wrap" ml={3}>
							<StepTitle fontWeight={"bold"} mb={1}>
								Contact Info
							</StepTitle>
						</Box>
						<StepSeparator />
					</Step>
				</Stepper>
			</Box>
			<Box flex={{ base: 1, md: 0.5 }} overflowY="auto" css={tabScrollCss}>
				<Stack spacing={3} p={5}>
					<TextTitle size="xl" title="Contact Information" />
					<BoxCard p={2} border="1px solid var(--lead_cards_border)">
						<FormControl isRequired>
							<FormLabel size="sm">Your First Name</FormLabel>
							<Input
								size="sm"
								value={formData.contactInfo.clientFirstName || ""}
								onChange={(e) => handleChange("contactInfo", "clientFirstName", e.target.value)}
								placeholder="Please enter first name"
							/>
						</FormControl>
						<FormControl isRequired>
							<FormLabel size="sm">Your Last Name</FormLabel>
							<Input
								size="sm"
								value={formData.contactInfo.clientLastName || ""}
								onChange={(e) => handleChange("contactInfo", "clientLastName", e.target.value)}
								placeholder="Please enter last name"
							/>
						</FormControl>
						<FormControl isRequired>
							<FormLabel size="sm">Email </FormLabel>
							<Input
								size="sm"
								type="email"
								value={formData.contactInfo.clientEmail || ""}
								onChange={(e) => handleChange("contactInfo", "clientEmail", e.target.value)}
								placeholder="Please enter email address"
							/>
						</FormControl>
						<FormControl isRequired>
							<FormLabel size="sm">Phone Number </FormLabel>
							<Input
								size="sm"
								value={formData.contactInfo.clientPhoneNumber || ""}
								onChange={(e) => handleChange("contactInfo", "clientPhoneNumber", e.target.value)}
								placeholder="Please enter phone number"
							/>
						</FormControl>
						<FormControl isRequired>
							<FormLabel size="sm">Preferred method of contact</FormLabel>
							<Flex gap={4} mt={2}>
								<label>
									<input
										type="radio"
										checked={formData.contactInfo.clientModeOfContact === "Email"}
										onChange={() => handleChange("contactInfo", "clientModeOfContact", "Email")}
										style={{ marginRight: "8px", cursor: "pointer" }}
									/>
									Email
								</label>
								<label>
									<input
										type="radio"
										checked={formData.contactInfo.clientModeOfContact === "Phone Number"}
										onChange={() =>
											handleChange("contactInfo", "clientModeOfContact", "Phone Number")
										}
										style={{ marginRight: "8px", cursor: "pointer" }}
									/>
									Phone Number
								</label>
							</Flex>
						</FormControl>
					</BoxCard>
				</Stack>
			</Box>
		</Flex>
	);
};

export default ContactInfo;
