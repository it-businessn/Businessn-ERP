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
							<Td py={0}>
								<TextTitle title={employeeId?.fullName} />
							</Td>
							<Td p={0.5}>
								<PrimaryButton
									color={approveStatusBtnCss.color}
									bg={approveStatusBtnCss.bg}
									name={approveStatus}
									size="xs"
									px={0}
									hover={{
										bg: approveStatusBtnCss.bg,
										color: approveStatusBtnCss.color,
									}}
								/>
							</Td>
							<Td py={0}>{clockIns.length > 0 ? clockIns[0] : ""}</Td>
							<Td py={0}>{clockOuts.length > 0 ? clockOuts[0] : ""}</Td>
							<Td py={0}>{startBreaks?.[0] ?? ""}</Td>
							<Td py={0}>{endBreaks?.[0] ?? ""}</Td>
							<Td py={0}>{startBreaks?.[1] ?? ""}</Td>
							<Td py={0}>{endBreaks?.[1] ?? ""}</Td>
							<Td py={0}>{startBreaks?.[2] ?? ""}</Td>
							<Td py={0}>{endBreaks?.[2] ?? ""}</Td>
							<Td py={0}>{hhMMFormattedTime}</Td>

							{/* <Td py={0}>
								{startBreaks.length > 0
									? startBreaks[startBreaks.length - 1]
									: ""}
							</Td>
							<Td py={0}>
								{endBreaks.length > 0 ? endBreaks[endBreaks.length - 1] : ""}
							</Td>
							<Td py={0}>
								{clockIns.length > 1 ? clockIns[clockIns.length - 1] : ""}
							</Td>
							<Td py={0}>
								{clockOuts.length > 1 ? clockIns[clockOuts.length - 1] : ""}
							</Td> */}
						</Tr>
					);
				},
			)}
		</Tbody>
	</TableLayout>
);

export default Timecard;
