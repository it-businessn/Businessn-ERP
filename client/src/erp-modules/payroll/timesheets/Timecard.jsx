import { Tbody, Td, Tr } from "@chakra-ui/react";
import EmptyRowRecord from "components/ui/EmptyRowRecord";
import TableLayout from "components/ui/table/TableLayout";
import { useEffect, useState } from "react";
import TimesheetService from "services/TimesheetService";
import { getTimeCardFormat } from "utils";

const sample = [
	{
		user_id: "7746",
		timestamp: "2024-09-23 23:59:10",
		status: 4,
		punch: "0",
	},
	{
		user_id: "7746",
		timestamp: "2024-09-23 23:59:10",
		status: 4,
		punch: "0",
	},
];

const Timecard = ({ cols, data }) => {
	const [timeRecords, setTimeRecords] = useState(null);
	const [timecardEntries, setTimecardEntries] = useState([]);

	useEffect(() => {
		const fetchAllTimecards = async () => {
			try {
				const response = await TimesheetService.getTimecards();
				setTimeRecords(response.data);
			} catch (error) {
				console.error(error);
			}
			// await TimesheetService.addTimecard(sample);
		};
		fetchAllTimecards();
	}, []);

	useEffect(() => {
		const groupedData = [];
		timeRecords?.forEach((record) => {
			let sameUser = groupedData
				.slice()
				.reverse()
				.find((user) => user.user_id === record.user_id);
			if (
				!sameUser ||
				(record.punch === "0" &&
					sameUser.punches.find((punch) => punch.punch === "0"))
			) {
				sameUser = {
					user_id: record.user_id,
					punches: [],
					employeeName: record?.employeeName ?? "",
				};
				groupedData.push(sameUser);
			}
			sameUser.punches.push({
				timestamp: record.timestamp,
				status: record.status,
				punch: record.punch,
			});
		});
		const mappedData = [];
		groupedData.forEach((user) => {
			// Split punches into chunks of 4
			for (let i = 0; i < user.punches.length; i += 4) {
				mappedData.push({
					user_id: user.user_id,
					punches: user.punches.slice(i, i + 4),
				});
			}
		});
		groupedData?.map((record) => {
			const { punches } = record;
			record.clockIn = punches.find(({ punch }) => punch === "0")?.timestamp;
			record.clockOut = punches.find(({ punch }) => punch === "1")?.timestamp;
			record.breakIn = punches.find(({ punch }) => punch === "2")?.timestamp;
			record.breakOut = punches.find(({ punch }) => punch === "3")?.timestamp;
			return record;
		});
		// console.log(groupedData);
		setTimecardEntries(groupedData);
	}, [timeRecords]);
	return (
		<TableLayout isTimesheet cols={cols}>
			<Tbody>
				{!timeRecords?.length && <EmptyRowRecord />}
				{/* {data?.map(
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

						const hhMMFormattedTime = `${(param_hours_worked / 60).toFixed(
							0,
						)}:${param_hours_worked % 60}`;
						return (
							<Tr key={_id}>
								<Td py={0}>
									<TextTitle title={employeeId?.fullName} />
								</Td>
								<Td>
									<TextTitle title={employeeId?.timeManagementBadgeID} />
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
							</Td> 
							</Tr>
						);
					},
				)} */}

				{timecardEntries?.map((record, index) => (
					<Tr key={`timecard_row_${index}`}>
						<Td py={1}>{record?.employeeName}</Td>
						<Td py={1}>{record?.user_id}</Td>
						<Td py={1}>
							{record.clockIn && getTimeCardFormat(record.clockIn)}
						</Td>
						<Td py={1}>
							{record.clockOut && getTimeCardFormat(record.clockOut)}
						</Td>
						<Td py={1}>
							{record.breakIn && getTimeCardFormat(record.breakIn)}
						</Td>
						<Td py={1}>
							{record.breakOut && getTimeCardFormat(record.breakOut)}
						</Td>
					</Tr>
				))}
			</Tbody>
		</TableLayout>
	);
};

export default Timecard;
