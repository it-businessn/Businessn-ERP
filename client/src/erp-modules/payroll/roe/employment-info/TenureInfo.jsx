import { HStack, Stack } from "@chakra-ui/react";
import DateTimeFormControl from "components/ui/form/DateTimeFormControl";
import InputFormControl from "components/ui/form/InputFormControl";
import TextTitle from "components/ui/text/TextTitle";
import moment from "moment";
import { useEffect } from "react";
import { getDefaultDate } from "utils/convertDate";

export const TenureInfo = ({ isReadOnly, payGroupSchedule, formData, handleFieldChange }) => {
	useEffect(() => {
		if (payGroupSchedule && formData?.employmentInfo?.employmentLeaveDate) {
			const finalPayPeriodRecord = payGroupSchedule?.find(
				({ payPeriodStartDate, payPeriodEndDate }) =>
					moment(formData?.employmentInfo?.employmentLeaveDate).isBetween(
						payPeriodStartDate,
						payPeriodEndDate,
						null,
						"[]",
					),
			);
			if (finalPayPeriodRecord) {
				handleFieldChange(
					"employmentInfo",
					"finalPayPeriodEndDate",
					finalPayPeriodRecord?.payPeriodEndDate,
				);
			}
		}
	}, [payGroupSchedule, formData?.employmentInfo?.employmentLeaveDate]);

	return (
		<Stack spacing={3} p={!isReadOnly && 5}>
			<TextTitle size="xl" title="Tenure" />
			<HStack>
				{isReadOnly ? (
					<>
						<InputFormControl
							readOnly={isReadOnly}
							size="sm"
							label="Start Date"
							valueText={getDefaultDate(formData?.employmentInfo?.employmentStartDate) || ""}
						/>
						<InputFormControl
							readOnly={isReadOnly}
							size="sm"
							label="Last Day Worked"
							valueText={getDefaultDate(formData?.employmentInfo?.employmentLeaveDate) || ""}
						/>
					</>
				) : (
					<>
						<DateTimeFormControl
							label="Start Date"
							valueText1={getDefaultDate(formData?.employmentInfo?.employmentStartDate)}
							name1="employmentStartDate"
							handleChange={(e) =>
								handleFieldChange("employmentInfo", "employmentStartDate", e.target.value)
							}
						/>
						<DateTimeFormControl
							required
							label="Last Day Worked"
							valueText1={
								formData?.employmentInfo?.employmentLeaveDate
									? getDefaultDate(formData?.employmentInfo?.employmentLeaveDate)
									: ""
							}
							name1="employmentLeaveDate"
							handleChange={(e) =>
								handleFieldChange("employmentInfo", "employmentLeaveDate", e.target.value)
							}
						/>
					</>
				)}
			</HStack>
		</Stack>
	);
};
