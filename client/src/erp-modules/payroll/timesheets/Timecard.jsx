import { Tbody, Td, Tr } from "@chakra-ui/react";
import PrimaryButton from "components/ui/button/PrimaryButton";
import TableLayout from "components/ui/table/TableLayout";
import TextTitle from "components/ui/text/TextTitle";
import { getParamKey, getStatusStyle } from "./data";

const Timecard = ({ cols, data }) => (
	<TableLayout isTimesheet cols={cols}>
		<Tbody>
			{data?.map(
				({
					_id,
					employeeId,
					approveStatus,
					payType,
					clockIns,
					clockOuts,
					startBreaks,
					endBreaks,
					regHoursWorked,
					overtimeHoursWorked,
					dblOvertimeHoursWorked,
					statDayHoursWorked,
					sickPayHours,
					statDayHours,
					vacationPayHours,
				}) => {
					const approveStatusBtnCss = getStatusStyle(approveStatus);

					const { param_hours } = getParamKey(payType);
					const param_hours_worked =
						param_hours === "regHoursWorked"
							? regHoursWorked
							: param_hours === "overtimeHoursWorked"
							? overtimeHoursWorked
							: param_hours === "dblOvertimeHoursWorked"
							? dblOvertimeHoursWorked
							: param_hours === "statDayHoursWorked"
							? statDayHoursWorked
							: param_hours === "statDayHours"
							? statDayHours
							: param_hours === "sickPayHours"
							? sickPayHours
							: vacationPayHours;

					const hhMMFormattedTime = `${(param_hours_worked / 60).toFixed(0)}:${
						param_hours_worked % 60
					}`;
					return (
						<Tr key={_id}>
							<Td>
								<TextTitle title={employeeId?.fullName} />
							</Td>
							<Td>
								<PrimaryButton
									color={approveStatusBtnCss.color}
									bg={approveStatusBtnCss.bg}
									name={approveStatus}
									size="xs"
									px={0}
									hover={"transparent"}
								/>
							</Td>
							<Td>{clockIns.length > 0 ? clockIns[0] : ""}</Td>
							<Td>{clockOuts.length > 0 ? clockOuts[0] : ""}</Td>
							<Td>
								{startBreaks.length > 0
									? startBreaks[startBreaks.length - 1]
									: ""}
							</Td>
							<Td>
								{endBreaks.length > 0 ? endBreaks[endBreaks.length - 1] : ""}
							</Td>
							<Td>
								{clockIns.length > 1 ? clockIns[clockIns.length - 1] : ""}
							</Td>
							<Td>
								{clockOuts.length > 1 ? clockIns[clockOuts.length - 1] : ""}
							</Td>
							<Td>{hhMMFormattedTime}</Td>
						</Tr>
					);
				},
			)}
		</Tbody>
	</TableLayout>
);

export default Timecard;
