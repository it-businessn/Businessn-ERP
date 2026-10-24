import { Box, HStack, Stack, Text } from "@chakra-ui/react";
import DateTimeFormControl from "components/ui/form/DateTimeFormControl";
import InputFormControl from "components/ui/form/InputFormControl";
import TextTitle from "components/ui/text/TextTitle";
import { getAmount } from "utils/convertAmt";
import { getDefaultDate } from "utils/convertDate";

// ROE-01: block 10 (first day worked), 11 (last day for which paid) and the
// employee's positions (block 13 occupation = the first position).
export const TenureInfo = ({ isReadOnly, formData, handleFieldChange }) => {
	const e = formData?.employmentInfo || {};
	return (
		<Stack spacing={4}>
			<HStack align="start">
				{isReadOnly ? (
					<>
						<InputFormControl
							readOnly
							size="sm"
							label="Start Date"
							valueText={e.employmentStartDate ? getDefaultDate(e.employmentStartDate) : ""}
						/>
						<InputFormControl
							readOnly
							size="sm"
							label="Last Day Worked"
							valueText={e.employmentLeaveDate ? getDefaultDate(e.employmentLeaveDate) : ""}
						/>
					</>
				) : (
					<>
						<DateTimeFormControl
							label="Start Date"
							valueText1={e.employmentStartDate ? getDefaultDate(e.employmentStartDate) : ""}
							name1="employmentStartDate"
							handleChange={(ev) =>
								handleFieldChange("employmentInfo", "employmentStartDate", ev.target.value)
							}
						/>
						<DateTimeFormControl
							required
							label="Last Day Worked"
							valueText1={e.employmentLeaveDate ? getDefaultDate(e.employmentLeaveDate) : ""}
							name1="employmentLeaveDate"
							handleChange={(ev) =>
								handleFieldChange("employmentInfo", "employmentLeaveDate", ev.target.value)
							}
						/>
					</>
				)}
			</HStack>
			<Stack spacing={2}>
				<TextTitle title="Positions" />
				{e.positions?.length ? (
					e.positions.map((position, index) => (
						<HStack
							key={`${position?.title}_${index}`}
							border="1px solid"
							borderColor="gray.200"
							borderRadius="md"
							p={2}
							spacing={6}
						>
							<Box flex={1}>
								<Text fontSize="xs" color="gray.500">
									Position
								</Text>
								<Text>{position?.title || "-"}</Text>
							</Box>
							<Box flex={1}>
								<Text fontSize="xs" color="gray.500">
									Pay rate
								</Text>
								<Text>{position?.payRate ? getAmount(position.payRate) : "-"}</Text>
							</Box>
							<Box flex={1}>
								<Text fontSize="xs" color="gray.500">
									Pay group
								</Text>
								<Text>{position?.employmentPayGroup || "-"}</Text>
							</Box>
						</HStack>
					))
				) : (
					<Text color="gray.500" fontSize="sm">
						No positions on file (add them in the employee's Employment info).
					</Text>
				)}
			</Stack>
		</Stack>
	);
};
