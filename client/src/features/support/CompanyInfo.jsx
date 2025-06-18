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

const CompanyInfo = ({ formData, setFormData }) => {
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
								Company Info
							</StepTitle>
						</Box>
						<StepSeparator />
					</Step>
				</Stepper>
			</Box>
			<Box flex={{ base: 1, md: 0.5 }} overflowY="auto" css={tabScrollCss}>
				<Stack spacing={3} p={5}>
					<TextTitle size="xl" title="Company Information" />
					<BoxCard p={2} border="1px solid var(--lead_cards_border)">
						<FormControl isRequired>
							<FormLabel size="sm">Company Name</FormLabel>
							<Input
								size="sm"
								value={formData.companyInfo.companyName || ""}
								onChange={(e) => handleChange("companyInfo", "companyName", e.target.value)}
								placeholder="Please enter company name"
							/>
						</FormControl>
						<FormControl isRequired>
							<FormLabel size="sm">Client ID</FormLabel>
							<Input
								size="sm"
								value={formData.companyInfo.clientId || ""}
								onChange={(e) => handleChange("companyInfo", "clientId", e.target.value)}
								placeholder="Enter client ID"
							/>
						</FormControl>
					</BoxCard>
				</Stack>
			</Box>
		</Flex>
	);
};

export default CompanyInfo;
