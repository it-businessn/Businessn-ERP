import { HStack, Select, Stack, Text } from "@chakra-ui/react";
import DateTimeFormControl from "components/ui/form/DateTimeFormControl";
import FormControlMain from "components/ui/form";
import InputFormControl from "components/ui/form/InputFormControl";
import RequiredLabel from "components/ui/form/RequiredLabel";
import SelectFormControl from "components/ui/form/SelectFormControl";
import { getDefaultDate } from "utils/convertDate";
import { REASON_CODE, RECALL_OPTIONS } from "../data";
import { formatPayDate, isReturnDate } from "../roeUtils";

// Reasons where the employee is not expected back: no return date (Y) allowed.
const NO_RETURN_PREFIXES = ["E", "G", "M"];
export const returnDateAllowed = (reasonCode) =>
	!NO_RETURN_PREFIXES.some((prefix) => String(reasonCode || "").startsWith(prefix));

// ROE-01: block 12 (final pay period ending date, filled in from the last day
// worked), 16 (reason) and 14 (expected date of recall, default Unknown; a
// recall date only, and always, for a return date).
export const FinalPayInfo = ({ isReadOnly, formData, handleFieldChange, payPeriodOptions }) => {
	const e = formData?.employmentInfo || {};
	const recallOptions = RECALL_OPTIONS.map((opt) =>
		opt.name?.startsWith("Y") && !returnDateAllowed(e.reasonCode) ? { ...opt, disabled: true } : opt,
	);
	const finalEnd = e.finalPayPeriodEndDate ? getDefaultDate(e.finalPayPeriodEndDate) : "";
	const options = payPeriodOptions || [];
	const listed = options.some((p) => p.payPeriodEndDate === finalEnd);

	if (isReadOnly) {
		return (
			<Stack spacing={3}>
				<HStack>
					<InputFormControl readOnly size="sm" label="Final Pay Period End Date" valueText={formatPayDate(finalEnd)} />
					<InputFormControl readOnly size="sm" label="Reason Code" valueText={e.reasonCode || ""} />
				</HStack>
				<HStack>
					<InputFormControl
						readOnly
						size="sm"
						label="Expected Date of Recall"
						valueText={e.expectedRecallDate || ""}
					/>
					{isReturnDate(e.expectedRecallDate) && (
						<InputFormControl
							readOnly
							size="sm"
							label="Recall Date"
							valueText={e.recallDate ? getDefaultDate(e.recallDate) : ""}
						/>
					)}
				</HStack>
			</Stack>
		);
	}

	return (
		<Stack spacing={3}>
			<HStack align="start">
				<FormControlMain>
					<RequiredLabel label="Final Pay Period End Date" required name="finalPayPeriodEndDate" />
					<Select
						id="finalPayPeriodEndDate"
						placeholder={options.length ? "Select pay period" : "No pay periods found"}
						value={finalEnd}
						onChange={(ev) =>
							handleFieldChange("employmentInfo", "finalPayPeriodEndDate", ev.target.value)
						}
					>
						{!listed && finalEnd && <option value={finalEnd}>{formatPayDate(finalEnd)}</option>}
						{options.map(({ payPeriodEndDate, payPeriod }) => (
							<option key={payPeriodEndDate} value={payPeriodEndDate}>
								{formatPayDate(payPeriodEndDate)}
								{payPeriod ? ` (PP ${payPeriod})` : ""}
							</option>
						))}
					</Select>
					<Text fontSize="xs" color="gray.500" mt={1}>
						Filled in from the last day worked: the pay period that contains it.
					</Text>
				</FormControlMain>
				<SelectFormControl
					required
					valueParam="name"
					name="reasonCode"
					label="Reason Code"
					placeholder="Select reason"
					valueText={e.reasonCode || ""}
					handleChange={(ev) =>
						ev.target.value && handleFieldChange("employmentInfo", "reasonCode", ev.target.value)
					}
					options={REASON_CODE}
				/>
			</HStack>
			<HStack align="start">
				<SelectFormControl
					required
					valueParam="name"
					name="expectedRecallDate"
					label="Expected Date of Recall"
					valueText={e.expectedRecallDate || ""}
					handleChange={(ev) =>
						ev.target.value &&
						handleFieldChange("employmentInfo", "expectedRecallDate", ev.target.value)
					}
					options={recallOptions}
				/>
				{isReturnDate(e.expectedRecallDate) ? (
					<DateTimeFormControl
						required
						label="Recall Date"
						valueText1={e.recallDate ? getDefaultDate(e.recallDate) : ""}
						name1="recallDate"
						minDate={e.employmentLeaveDate ? getDefaultDate(e.employmentLeaveDate) : undefined}
						handleChange={(ev) => handleFieldChange("employmentInfo", "recallDate", ev.target.value)}
					/>
				) : (
					<FormControlMain />
				)}
			</HStack>
		</Stack>
	);
};
