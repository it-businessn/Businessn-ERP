import { HStack, Stack } from "@chakra-ui/react";
import DateTimeFormControl from "components/ui/form/DateTimeFormControl";
import InputFormControl from "components/ui/form/InputFormControl";
import SelectFormControl from "components/ui/form/SelectFormControl";
import TextTitle from "components/ui/text/TextTitle";
import { getDefaultDate } from "utils/convertDate";
import { REASON_CODE, RECALL_OPTIONS } from "../data";

export const FinalPayInfo = ({ isReadOnly, formData, handleFieldChange }) => {
	const RECALL_OPTIONS_WITH_DISABLED = RECALL_OPTIONS.map((opt) => {
		if (
			opt.name?.startsWith("Y") &&
			["E", "G", "M"].some((prefix) => formData?.employmentInfo?.reasonCode?.startsWith(prefix))
		) {
			return { ...opt, disabled: true };
		}
		return opt;
	});

	return (
		<Stack spacing={3}>
			<TextTitle size="xl" title="Final Pay" />
			<HStack>
				{isReadOnly ? (
					<>
						<InputFormControl
							readOnly={isReadOnly}
							size="sm"
							label="Final Pay Period End Date"
							valueText={getDefaultDate(formData?.employmentInfo?.finalPayPeriodEndDate) || ""}
						/>
						<InputFormControl
							readOnly={isReadOnly}
							size="sm"
							label="Reason Code"
							valueText={formData?.employmentInfo?.reasonCode || ""}
						/>
					</>
				) : (
					<>
						<DateTimeFormControl
							label="Final Pay Period End Date"
							valueText1={
								formData?.employmentInfo?.finalPayPeriodEndDate
									? getDefaultDate(formData?.employmentInfo?.finalPayPeriodEndDate)
									: ""
							}
							name1="finalPayPeriodEndDate"
							handleChange={(e) =>
								handleFieldChange("employmentInfo", "finalPayPeriodEndDate", e.target.value)
							}
						/>
						<SelectFormControl
							valueParam="name"
							name="reasonCode"
							label="Reason Code"
							placeholder="Select reason"
							valueText={formData?.employmentInfo?.reasonCode || ""}
							handleChange={(e) =>
								!isReadOnly &&
								e.target.value &&
								handleFieldChange("employmentInfo", "reasonCode", e.target.value)
							}
							options={REASON_CODE}
						/>
					</>
				)}
			</HStack>
			<HStack>
				{isReadOnly ? (
					<>
						<InputFormControl
							readOnly={isReadOnly}
							size="sm"
							label="Expected Date of Recall"
							valueText={formData?.employmentInfo?.expectedRecallDate || ""}
						/>
						<InputFormControl
							readOnly={isReadOnly}
							size="sm"
							label="Recall Date"
							valueText={getDefaultDate(formData?.employmentInfo?.recallDate) || ""}
						/>
					</>
				) : (
					<>
						<SelectFormControl
							valueParam="name"
							name="expectedRecallDate"
							label="Expected Date of Recall"
							valueText={formData?.employmentInfo?.expectedRecallDate || ""}
							handleChange={(e) =>
								!isReadOnly &&
								e.target.value &&
								handleFieldChange("employmentInfo", "expectedRecallDate", e.target.value)
							}
							options={RECALL_OPTIONS_WITH_DISABLED}
						/>
						{formData?.employmentInfo?.expectedRecallDate?.startsWith("Y") && (
							<DateTimeFormControl
								readOnly={isReadOnly}
								required
								label="Recall Date"
								valueText1={
									formData?.employmentInfo?.recallDate
										? getDefaultDate(formData?.employmentInfo?.recallDate)
										: ""
								}
								name1="recallDate"
								handleChange={(e) =>
									handleFieldChange("employmentInfo", "recallDate", e.target.value)
								}
							/>
						)}
					</>
				)}
			</HStack>
		</Stack>
	);
};
