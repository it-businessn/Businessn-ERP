import {
	Box,
	Flex,
	FormControl,
	FormLabel,
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
	Textarea,
} from "@chakra-ui/react";
import BoxCard from "components/ui/card";
import TextTitle from "components/ui/text/TextTitle";
import { tabPanelStyleCss, tabScrollCss } from "erp-modules/payroll/onboard-user/customInfo";

const QueryInfo = ({ formData, setFormData }) => {
	const INQUIRIES = [
		{ name: "Price related inquiry", id: "price" },
		{ name: "Client Experience or Support Inquiry", id: "support" },
		{ name: "Product Experience/Concern", id: "product_experience" },
		{ name: "Delivery", id: "delivery" },
		{ name: "New Client or product onboarding", id: "onboard" },
		{ name: "Tax inquiry", id: "tax" },
		{ name: "Other", id: "other" },
	];
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
						<Box flexShrink="0" ml={3}>
							<StepTitle fontWeight={"bold"} mb={1}>
								Query
							</StepTitle>
						</Box>
						<StepSeparator />
					</Step>
				</Stepper>
			</Box>
			<Box flex={{ base: 1, md: 0.5 }} overflowY="auto" css={tabScrollCss}>
				<Stack spacing={3} p={5}>
					<TextTitle size="xl" title="Query" />
					<BoxCard p={2} border="1px solid var(--lead_cards_border)">
						<FormControl isRequired>
							<FormLabel size="sm">Type of Inquiry</FormLabel>
							<Select
								value={formData.queryInfo.inquiryType || ""}
								onChange={(e) => {
									if (e.target.value) handleChange("queryInfo", "inquiryType", e.target.value);
								}}
								placeholder="Select type of inquiry"
							>
								{INQUIRIES.map(({ name, id }) => (
									<option key={id} value={id}>
										{name}
									</option>
								))}
							</Select>
						</FormControl>
						<FormControl isRequired>
							<FormLabel size="sm">Describe the issue</FormLabel>
							<Textarea
								size="sm"
								value={formData.queryInfo.issue || ""}
								onChange={(e) => handleChange("queryInfo", "issue", e.target.value)}
							/>
						</FormControl>
					</BoxCard>
				</Stack>
			</Box>
		</Flex>
	);
};

export default QueryInfo;
