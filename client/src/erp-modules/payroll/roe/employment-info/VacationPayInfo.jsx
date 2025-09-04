import { HStack, Stack } from "@chakra-ui/react";
import DateTimeFormControl from "components/ui/form/DateTimeFormControl";
import InputFormControl from "components/ui/form/InputFormControl";
import SelectFormControl from "components/ui/form/SelectFormControl";
import TextTitle from "components/ui/text/TextTitle";
import { getDefaultDate } from "utils/convertDate";
import { VACATION_PAY_CODE } from "../data";

export const VacationPayInfo = ({ isReadOnly, formData, handleFieldChange }) => {
	return (
		<Stack spacing={3}>
			<TextTitle size="xl" title={"Vacation Pay"} />
			<HStack>
				{isReadOnly ? (
					<>
						<InputFormControl
							readOnly={isReadOnly}
							size="sm"
							label="Vacation Pay Code"
							valueText={formData?.employmentInfo?.vacationPayCode || ""}
						/>
						<InputFormControl
							readOnly={isReadOnly}
							size="sm"
							label="Vacation Pay Amount"
							valueText={formData?.employmentInfo?.vacationPayAmount || ""}
						/>
					</>
				) : (
					<>
						<SelectFormControl
							valueParam="name"
							name="vacationPayCode"
							label="Vacation Pay Code"
							placeholder="Select code"
							valueText={formData?.employmentInfo?.vacationPayCode || ""}
							handleChange={(e) =>
								!isReadOnly &&
								e.target.value &&
								handleFieldChange("employmentInfo", "vacationPayCode", e.target.value)
							}
							options={VACATION_PAY_CODE}
						/>
						{!formData?.employmentInfo?.vacationPayCode?.startsWith("1") && (
							<InputFormControl
								readOnly={isReadOnly}
								type="number"
								label="Vacation Pay Amount"
								name="vacationPayAmount"
								placeholder="Enter Vacation Pay Amount"
								valueText={formData?.employmentInfo?.vacationPayAmount || ""}
								handleChange={(e) =>
									handleFieldChange("employmentInfo", "vacationPayAmount", e.target.value)
								}
							/>
						)}
					</>
				)}
			</HStack>
			{(formData?.employmentInfo?.vacationPayCode?.startsWith("3") ||
				formData?.employmentInfo?.vacationPayCode?.startsWith("4")) && (
				<HStack>
					{isReadOnly ? (
						<>
							<InputFormControl
								readOnly={isReadOnly}
								size="sm"
								label="Vacation Pay Start Date"
								valueText={getDefaultDate(formData?.employmentInfo?.vacationPayStartDate) || ""}
							/>
							<InputFormControl
								readOnly={isReadOnly}
								size="sm"
								label="Vacation Pay End Date"
								valueText={getDefaultDate(formData?.employmentInfo?.vacationPayEndDate) || ""}
							/>
						</>
					) : (
						<>
							<DateTimeFormControl
								label="Vacation Pay Start Date"
								valueText1={
									formData?.employmentInfo?.vacationPayStartDate
										? getDefaultDate(formData?.employmentInfo?.vacationPayStartDate)
										: ""
								}
								name1="vacationPayStartDate"
								handleChange={(e) =>
									handleFieldChange("employmentInfo", "vacationPayStartDate", e.target.value)
								}
							/>
							{formData?.employmentInfo?.vacationPayCode?.startsWith("3") && (
								<DateTimeFormControl
									label="Vacation Pay End Date"
									valueText1={
										formData?.employmentInfo?.vacationPayEndDate
											? getDefaultDate(formData?.employmentInfo?.vacationPayEndDate)
											: ""
									}
									name1="vacationPayEndDate"
									handleChange={(e) =>
										handleFieldChange("employmentInfo", "vacationPayEndDate", e.target.value)
									}
								/>
							)}
						</>
					)}
				</HStack>
			)}
		</Stack>
	);
};
