import { FormControl, FormLabel, HStack, Input, Select, Stack } from "@chakra-ui/react";
import InputFormControl from "components/ui/form/InputFormControl";
import TextTitle from "components/ui/text/TextTitle";
import { COUNTRIES } from "erp-modules/payroll/onboard-user/customInfo";
import { useEffect, useState } from "react";
import { maskSIN } from "../roeUtils";

export const PersonalInfo = ({ isReadOnly, formData, handleFieldChange }) => {
	const [provinces, setProvinces] = useState([]);

	useEffect(() => {
		if (formData?.empInfo?.country) {
			// ROE-01: a country stored as "CA" / "Canada" (not "CAN") crashed the screen
			const value = String(formData.empInfo.country).trim().toLowerCase();
			const country = COUNTRIES.find(
				({ code, type }) =>
					code.toLowerCase() === value ||
					type.toLowerCase() === value ||
					code.toLowerCase().slice(0, 2) === value,
			);
			setProvinces(country?.provinces || []);
			// show it in the Country list (stored as "CAN")
			if (country && country.code !== formData.empInfo.country)
				handleFieldChange("empInfo", "country", country.code);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [formData?.empInfo?.country]);

	return (
		<Stack spacing={3}>
			<Stack>
				<HStack>
					<FormControl isRequired>
						<FormLabel size="sm">First Name</FormLabel>
						<Input
							readOnly={isReadOnly}
							size="sm"
							value={formData.empInfo?.firstName || ""}
							onChange={(e) => handleFieldChange("empInfo", "firstName", e.target.value)}
							placeholder="Please enter first name"
						/>
					</FormControl>
					<FormControl>
						<FormLabel size="sm">Middle Name</FormLabel>
						<Input
							readOnly={isReadOnly}
							size="sm"
							value={formData.empInfo?.middleName || ""}
							onChange={(e) => handleFieldChange("empInfo", "middleName", e.target.value)}
							placeholder="Please enter middle name"
						/>
					</FormControl>
					<FormControl isRequired>
						<FormLabel size="sm">Last Name </FormLabel>
						<Input
							readOnly={isReadOnly}
							size="sm"
							value={formData.empInfo?.lastName || ""}
							onChange={(e) => handleFieldChange("empInfo", "lastName", e.target.value)}
							placeholder="Please enter last name"
						/>
					</FormControl>
				</HStack>
				<FormControl>
					<FormLabel size="sm">Social Insurance Number </FormLabel>
					{/* ROE-01: from the employee's profile, shown masked as on the ROE */}
					<Input
						readOnly
						size="sm"
						cursor="not-allowed"
						value={maskSIN(formData.empInfo?.SIN) || "Not on file - add it in the employee's profile"}
					/>
				</FormControl>
				<TextTitle title="Address" />
				<HStack>
					<FormControl isRequired>
						<FormLabel size="sm">Street Address </FormLabel>
						<Input
							readOnly={isReadOnly}
							size="sm"
							value={formData.empInfo?.streetAddress || ""}
							onChange={(e) => handleFieldChange("empInfo", "streetAddress", e.target.value)}
							placeholder="Please enter street address"
						/>
					</FormControl>
					<FormControl>
						<FormLabel size="sm"> Suite </FormLabel>
						<Input
							readOnly={isReadOnly}
							size="sm"
							value={formData.empInfo?.streetAddressSuite || ""}
							onChange={(e) => handleFieldChange("empInfo", "streetAddressSuite", e.target.value)}
							placeholder="Please enter suite no"
						/>
					</FormControl>
					<FormControl isRequired>
						<FormLabel size="sm">City</FormLabel>
						<Input
							readOnly={isReadOnly}
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
						{isReadOnly ? (
							<Input
								readOnly={isReadOnly}
								size="sm"
								placeholder="Select Country"
								value={formData?.empInfo?.country || ""}
							/>
						) : (
							<Select
								placeholder="Select Country"
								value={formData?.empInfo?.country || ""}
								onChange={(e) => {
									if (e.target.value) {
										handleFieldChange("empInfo", "country", e.target.value);
									}
								}}
							>
								{COUNTRIES.map(({ type, code }) => (
									<option key={type} value={code}>
										{type}
									</option>
								))}
							</Select>
						)}
					</FormControl>
					<FormControl>
						<FormLabel size="sm">Province / State</FormLabel>
						{isReadOnly ? (
							<Input
								readOnly={isReadOnly}
								size="sm"
								placeholder="Select Province / State"
								value={formData?.empInfo?.province || ""}
							/>
						) : (
							<Select
								placeholder="Select Province / State"
								value={formData?.empInfo?.province || ""}
								onChange={(e) => {
									if (e.target.value) {
										handleFieldChange("empInfo", "province", e.target.value);
									}
								}}
							>
								{(provinces || []).map(({ name, id }) => (
									<option key={name} value={id}>
										{name}
									</option>
								))}
							</Select>
						)}
					</FormControl>
					<InputFormControl
						readOnly={isReadOnly}
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
	);
};
