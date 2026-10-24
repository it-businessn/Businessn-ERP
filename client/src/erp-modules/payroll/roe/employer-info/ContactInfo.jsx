import { Box, HStack, Radio, RadioGroup, Select, SimpleGrid, Stack, Text } from "@chakra-ui/react";
import FormControlMain from "components/ui/form";
import InputFormControl from "components/ui/form/InputFormControl";
import RequiredLabel from "components/ui/form/RequiredLabel";

const Field = ({ label, children }) => (
	<Box>
		<Text fontSize="xs" color="gray.500" textTransform="uppercase">
			{label}
		</Text>
		{children}
	</Box>
);

/** Block 4, 5 and 7: from the company record, read only. */
export const EmployerDetails = ({ employer }) => {
	const a = employer?.address || {};
	return (
		<SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
			<Field label="Employer name">
				<Text fontWeight="semibold">{employer?.name || "-"}</Text>
			</Field>
			<Field label="Employer address">
				<Text>{[a.streetNumber, a.streetName].filter(Boolean).join(" ") || "-"}</Text>
				<Text>{[a.city, a.state].filter(Boolean).join(", ")}</Text>
				<Text>{[a.country, a.postalCode].filter(Boolean).join(" ")}</Text>
			</Field>
			<Field label="CRA payroll account number (BN)">
				<Text fontWeight="semibold">
					{employer?.cra_business_number || "Not on file - add it in the company settings"}
				</Text>
			</Field>
		</SimpleGrid>
	);
};

const PersonPicker = ({ role, label, admins, info, handleFieldChange }) => (
	<HStack align="end" spacing={3}>
		<FormControlMain>
			<RequiredLabel label={`${label} Name`} required name={`${role}Name`} />
			<Select
				id={`${role}Name`}
				placeholder={`Select ${label.toLowerCase()}`}
				value={info?.[`${role}Name`] || ""}
				onChange={(e) => handleFieldChange("employerInfo", `${role}Name`, e.target.value)}
			>
				{(admins || []).map(({ fullName }) => (
					<option key={fullName} value={fullName}>
						{fullName}
					</option>
				))}
			</Select>
		</FormControlMain>
		<InputFormControl
			required={role === "contact"}
			type="tel"
			label="Telephone Number"
			name={`${role}TelNumber`}
			placeholder="(604) 555-0123"
			valueText={info?.[`${role}TelNumber`] || ""}
			handleChange={(e) => handleFieldChange("employerInfo", `${role}TelNumber`, e.target.value)}
		/>
		<InputFormControl
			label="Ext."
			name={`${role}ExtNumber`}
			placeholder="Ext."
			w="100px"
			valueText={info?.[`${role}ExtNumber`] || ""}
			handleChange={(e) => handleFieldChange("employerInfo", `${role}ExtNumber`, e.target.value)}
		/>
	</HStack>
);

// ROE-01 tab 3: employer details (read only), contact (block 16) and issuer
// (block 21-22), both chosen from the company's administrators, and the
// preferred language (block 20, English by default).
export const ContactInfo = ({ employer, handleFieldChange, formData, admins }) => {
	const info = formData?.employerInfo || {};
	return (
		<Stack spacing={5}>
			<EmployerDetails employer={employer} />
			<PersonPicker
				role="contact"
				label="Contact"
				admins={admins}
				info={info}
				handleFieldChange={handleFieldChange}
			/>
			<PersonPicker
				role="issuer"
				label="Issuer"
				admins={admins}
				info={info}
				handleFieldChange={handleFieldChange}
			/>
			<FormControlMain>
				<RequiredLabel label="Preferred Communication" />
				<RadioGroup
					value={info.preferredCommunication || "E"}
					onChange={(value) => handleFieldChange("employerInfo", "preferredCommunication", value)}
				>
					<HStack spacing={6}>
						<Radio value="E">English</Radio>
						<Radio value="F">French</Radio>
					</HStack>
				</RadioGroup>
			</FormControlMain>
		</Stack>
	);
};
