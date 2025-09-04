import {
	Box,
	Flex,
	Step,
	StepIcon,
	StepIndicator,
	StepNumber,
	Stepper,
	StepSeparator,
	StepStatus,
	StepTitle,
} from "@chakra-ui/react";
import { tabPanelStyleCss, tabScrollCss } from "erp-modules/payroll/onboard-user/customInfo";
import { PersonalInfo } from "./PersonalInfo";

const EmployeeInfo = ({ formData, handleFieldChange }) => {
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
				<PersonalInfo handleFieldChange={handleFieldChange} formData={formData} />
			</Box>
		</Flex>
	);
};

export default EmployeeInfo;
