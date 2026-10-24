import { Button, HStack, Stack, Text } from "@chakra-ui/react";
import RoeSection from "../RoeSection";
import { ContactInfo } from "./ContactInfo";

// ROE-01 tab 3: employer details, contact and issuer; Confirm Selection moves
// on to the earnings.
const EmployerInfo = ({
	formData,
	employer,
	admins,
	handleFieldChange,
	sections,
	toggleSection,
	done,
	onConfirm,
	errors,
}) => (
	<Stack spacing={4} p={2}>
		<RoeSection
			title="Employer Details"
			isOpen={sections.employer}
			onToggle={() => toggleSection("employer")}
			isDone={done.employer}
			summary={formData?.employerInfo?.contactName ? `Contact: ${formData.employerInfo.contactName}` : ""}
		>
			<Stack spacing={4}>
				<ContactInfo
					employer={employer}
					formData={formData}
					admins={admins}
					handleFieldChange={handleFieldChange}
				/>
				{errors?.length > 0 && (
					<Text color="red.500" fontSize="sm">
						Required: {errors.join(", ")}
					</Text>
				)}
				<HStack justify="end">
					<Button bg="var(--banner_bg)" color="white" _hover={{ bg: "#4a2b4a" }} onClick={onConfirm}>
						Confirm Selection
					</Button>
				</HStack>
			</Stack>
		</RoeSection>
	</Stack>
);

export default EmployerInfo;
