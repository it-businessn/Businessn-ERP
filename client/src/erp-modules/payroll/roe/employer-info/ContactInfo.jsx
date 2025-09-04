import { Box, HStack, Stack } from "@chakra-ui/react";
import InputFormControl from "components/ui/form/InputFormControl";
import RadioFormControl from "components/ui/form/RadioFormControl";
import SelectFormControl from "components/ui/form/SelectFormControl";
import NormalTextTitle from "components/ui/NormalTextTitle";
import TextTitle from "components/ui/text/TextTitle";

export const ContactInfo = ({ isReadOnly, handleFieldChange, formData, admins }) => {
	return (
		<>
			<Stack spacing={3} p={!isReadOnly && 5}>
				<TextTitle size="xl" title="Employer Details" />
				<HStack
					w={isReadOnly && 0.7}
					alignItems="baseline"
					spacing={isReadOnly && 10}
					justifyContent={isReadOnly ? "start" : "space-between"}
				>
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
					{isReadOnly && (
						<Box>
							<TextTitle title="Preferred Communication" />
							<NormalTextTitle title={formData?.employerInfo?.preferredCommunication} />
						</Box>
					)}
				</HStack>

				<HStack>
					{isReadOnly ? (
						<>
							<InputFormControl
								readOnly={isReadOnly}
								size="sm"
								label="Contact Name"
								valueText={formData?.employerInfo?.contactName || ""}
							/>
							<InputFormControl
								readOnly={isReadOnly}
								size="sm"
								label="Contact Telephone Number"
								valueText={formData?.employerInfo?.contactTelNumber || ""}
							/>
							<InputFormControl
								readOnly={isReadOnly}
								size="sm"
								label="Contact Ext Number"
								valueText={formData?.employerInfo?.contactExtNumber || ""}
							/>
						</>
					) : (
						<>
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
										readOnly={isReadOnly}
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
										readOnly={isReadOnly}
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
						</>
					)}
				</HStack>
				<HStack>
					{isReadOnly ? (
						<>
							<InputFormControl
								readOnly={isReadOnly}
								size="sm"
								label="Issuer Name"
								valueText={formData?.employerInfo?.issuerName || ""}
							/>
							<InputFormControl
								readOnly={isReadOnly}
								size="sm"
								label="Issuer Telephone Number"
								valueText={formData?.employerInfo?.issuerTelNumber || ""}
							/>
							<InputFormControl
								readOnly={isReadOnly}
								size="sm"
								label="Issuer Ext Number"
								valueText={formData?.employerInfo?.issuerExtNumber || ""}
							/>
						</>
					) : (
						<>
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
										readOnly={isReadOnly}
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
										readOnly={isReadOnly}
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
						</>
					)}
				</HStack>
				{!isReadOnly && (
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
				)}
			</Stack>
		</>
	);
};
